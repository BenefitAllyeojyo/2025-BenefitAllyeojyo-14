# Outbox 전송 채널 Kafka 승격 설계

- **작성일**: 2026-07-28
- **대상 모듈**: `core-bank`(생산자), `community`(소비자)
- **한 줄 요약**: Outbox로 정합성을 유지한 채, 전송 채널을 "폴링 HTTP 웹훅"에서 "커밋 직후 Kafka 즉시 발행(fast-path) + 저주기 폴링 안전망(safety-net)"으로 승격해 전송 지연을 제거한다.

---

## 1. 배경과 목적

### 현재 구조 (as-is)
`core-bank`는 결제/거래 트랜잭션 안에서 `outbox` 테이블에 이벤트를 기록하고, `OutboxToCommunityDispatcher`가 **5초 주기로 폴링**하여 `CommunityWebHookClient`(WebClient)로 `community`에 HTTP POST(`/recommendations/*`)한다. `community`는 `event_consume_log.outbox_id` UNIQUE 제약으로 **소비 멱등성**을 보장한다.

- 정합성: 도메인 변경과 outbox 기록이 **같은 트랜잭션**(트랜잭셔널 아웃박스) → 이미 견고함 ✅
- 문제: 전송이 **폴링 주기(최대 5초 + 초기 지연 2초)만큼 지연**된다. 이벤트가 즉시 흘러야 하는 추천 파이프라인에서 이 지연이 병목.

### 목적
1. **전송 지연 제거** — 이벤트를 커밋 직후 즉시 흘린다. (동작하는 실측 개선)
2. **정합성/무유실 유지** — dual-write 유실(아래 §3)을 안전망으로 계속 방어한다.
3. **포트폴리오 서술 근거 확보** — 국내외 실제 사례와 트레이드오프를 저울질한 의사결정을 남긴다.

---

## 2. 핵심 개념: dual-write 구멍과 두 갈래의 방어

한 번의 결제 처리에서 우리는 서로 다른 두 저장소에 써야 한다: **DB**(거래 + outbox row)와 **Kafka**(전송 메시지). DB 트랜잭션은 DB 안만 원자적으로 묶으므로, **"커밋"과 "publish" 사이에는 항상 시간 간격**이 존재한다. 이 간격에서 실패하는 두 부류:

- **A. publish 자체가 실패로 떨어짐** — 브로커 다운, ISR 미달(`acks=all`), 버퍼 포화, 직렬화 실패 등. → **콜백에서 잡아 재시도**로 처리 가능.
- **B. 커밋은 됐는데 publish를 못 함** — 커밋 직후 프로세스가 죽음(배포 SIGKILL, OOMKilled, 스케일다운, 노드 장애). `send()`가 비동기라 버퍼(메모리)에만 있던 메시지는 소실되고, **실패 기록조차 못 남긴다.** → 콜백 재시도로 **못 잡는다.**

**B를 잡는 유일한 수단은, 앱 생존과 무관하게 DB 상태만 보고 동작하는 안전망**이다. 이 프로젝트는 이미 `sent_at IS NULL`을 스캔하는 폴링 워커를 갖고 있으므로, 이를 **저주기 안전망**으로 재활용한다.

> 이 구멍을 원천 제거하는 상위 방식은 CDC(Debezium이 WAL을 tailing)이지만, Kafka Connect + Debezium 인프라 운영 비용이 이 규모에 과하다. → §10 발전 방향으로 유보.

---

## 3. 목표 구조 (to-be): 3종 세트

```
                         ┌─────────────────────────── core-bank ───────────────────────────┐
                         │                                                                   │
  [결제 트랜잭션 T1] ────┼──> outbox INSERT (같은 커밋)                                      │
                         │        │                                                          │
                         │        ├─(AFTER_COMMIT)──> ① Fast-path: Kafka 즉시 발행 ──┐        │
                         │        │                     성공 시 sent_at 마킹          │        │
                         │        │                                                  │        │
                         │        └─(별개 스케줄)────> ② Safety-net: 저주기 폴링 ─────┤        │
                         │                              sent_at IS NULL 재발행         │        │
                         └──────────────────────────────────────────────────────────┼────────┘
                                                                                      │
                                              Kafka topic (per OutboxType)            │
                                                                                      ▼
                         ┌─────────────────────────── community ───────────────────────────┐
                         │  ③ @KafkaListener 소비 → event_consume_log.outbox_id UNIQUE 로   │
                         │     멱등 처리(중복이면 skip) → 추천 데이터 반영                   │
                         └───────────────────────────────────────────────────────────────┘
```

- **① Fast-path (신규)**: outbox row를 커밋한 트랜잭션의 `AFTER_COMMIT` 시점에 Kafka로 즉시 발행. 정상 경로에서 지연 ≈ 0.
- **② Safety-net (기존 워커 재설정)**: 폴링 주기를 5초 → **30~60초**로 낮추고, `sent_at IS NULL`인 미전송분만 Kafka로 재발행. B(크래시 유실)와 A(발행 실패 잔여분)를 사후 복구.
- **③ 멱등 소비 (기존 자산 재활용 + 전송 방식 전환)**: `community`를 REST 수신에서 **Kafka 소비**로 전환. 중복은 `event_consume_log.outbox_id`로 무해화 → at-least-once + 멱등 = effectively-once.

**두 발행 경로(①②)는 동일한 Kafka 토픽으로 발행**하며, "outbox → 메시지 변환 → Kafka 발행 → `sent_at` 마킹"이라는 **단일 발행 로직을 공유**한다(중복 구현 금지).

---

## 4. 아키텍처 상세

### 4.1 Kafka 토픽 설계
- **토픽을 OutboxType별로 분리**한다. 기존에 수신 엔드포인트가 type별로 갈라져 있으므로(`/recommendations/category`, `/recommendations/hour`) 그 경계를 그대로 승계.
  - `TRANSACTION_COMPLETED` → `command.corebank.transaction-completed.v1`
  - `PAYMENT_METHOD_LINKED` → `command.corebank.payment-method-linked.v1`
- **파티션 키 = `userId`**. 같은 사용자의 이벤트가 같은 파티션으로 가 **사용자 단위 순서**를 보장한다. (전역 순서는 목표 아님 — YAGNI)
- **`acks=all`**, `enable.idempotence=true`(프로듀서 중복 억제), `retries` 충분히. → A 부류를 프로듀서 레벨에서 1차 방어.
- 메시지 헤더에 `outboxId`, `outboxType`, `eventId(uniqKey)` 포함 → 소비자 dedup 및 추적 용이.

### 4.2 ① Fast-path — 커밋 직후 발행
- 신규 컴포넌트 `OutboxKafkaPublisher`(발행 + `sent_at` 마킹을 캡슐화, ①②가 공유).
- outbox 기록 서비스(`OutBoxCommandServiceImpl`)가 저장한 outbox id들을, `AFTER_COMMIT`에서 발행하도록 트리거.
  - 구현: `ApplicationEventPublisher`로 도메인 내부 이벤트(예: `OutboxRecorded(ids)`)를 발행하고, `@TransactionalEventListener(phase = AFTER_COMMIT)`가 이를 받아 `OutboxKafkaPublisher.publish(ids)` 호출.
  - **반드시 커밋 이후**에 발행한다(커밋 전 발행 시 롤백돼도 메시지가 나가는 오류 방지).
- 발행 결과 처리:
  - 성공 콜백 → 해당 outbox row `sent_at = now()` 마킹(별도 트랜잭션).
  - 실패/콜백 미도착 → **아무것도 하지 않는다.** `sent_at`이 NULL로 남아 ②가 자동으로 줍는다. (Fast-path는 best-effort)

### 4.3 ② Safety-net — 저주기 폴링 (기존 워커 재설정)
- `OutboxToCommunityDispatcher`의 전송 대상을 **HTTP → Kafka로 교체**(`OutboxKafkaPublisher` 재사용). 픽업/리스/백오프/재시도(`FOR UPDATE SKIP LOCKED`, `attempt`, `nextRetryAt`) 로직은 **그대로 유지**.
- 폴링 주기: `outbox.dispatch.delay-ms` 기본값을 5000 → **30000~60000**으로 상향(설정만 변경). 안전망 역할이므로 지연에 둔감.
- 선택적 개선: 29CM 사례처럼 "**커밋 후 N분(예: 1~2분) 이상 경과한 미전송분만**" 픽업하도록 픽업 쿼리에 age 조건 추가 가능 → fast-path와 폴링이 같은 레코드를 동시에 집어 중복 발행하는 창을 줄인다. (멱등 소비가 있으므로 필수는 아님. 트레이드오프로 §9에서 논의)

### 4.4 ③ Consumer — community 전송 방식 전환
- `community`에 Kafka Consumer 도입: `@KafkaListener`(토픽별) → 기존 `RecommendationCommandServiceImpl`의 처리 로직 재사용.
- **멱등성은 기존 그대로**: `eventConsumeLogRepository.existsByOutboxId(outboxId)`로 중복이면 skip, 처리 후 `EventConsumeLog` 저장(`outbox_id` UNIQUE).
- 컨슈머 오프셋 커밋 전략: **처리 성공(멱등 로그 저장 커밋) 후 오프셋 커밋**. 처리 중 실패 시 오프셋 미커밋 → 재소비(at-least-once). 컨슈머에는 트랜잭션 타임아웃 우려로 과한 `@Transactional` 결합을 피하고, 멱등 저장 단위만 트랜잭션으로 묶는다.
- 기존 REST 엔드포인트(`/recommendations/*`)는 전환 완료 후 제거하거나, 롤백 대비로 한시적 유지(플래그) 후 제거.

### 4.5 at-least-once / 순서 / 멱등 요약
- **전달 보장**: at-least-once (fast-path 성공 후 콜백 유실이나 폴링 재발행으로 **중복은 가능**, 유실은 없음).
- **중복 방어**: 소비자 `event_consume_log.outbox_id` UNIQUE (이미 구현) → 재적용 무해.
- **순서**: `userId` 파티션 키로 사용자 단위 순서 보장. fast-path와 폴링이 뒤섞여도 같은 파티션 내에서 처리되며, 멱등 처리가 재정렬을 무해화.

---

## 5. 컴포넌트별 변경 (파일 단위)

### core-bank
| 파일 | 변경 |
|---|---|
| `domain/outbox/publisher/OutboxKafkaPublisher.java` (신규) | outbox id → 변환 → Kafka 발행 → `sent_at` 마킹. ①②가 공유하는 단일 발행 지점. |
| `domain/outbox/service/OutBoxCommandServiceImpl.java` | 저장 후 `OutboxRecorded(ids)` 도메인 이벤트 발행 추가. |
| `domain/outbox/listener/OutboxCommitListener.java` (신규) | `@TransactionalEventListener(AFTER_COMMIT)` → `OutboxKafkaPublisher.publish(ids)`. |
| `domain/outbox/service/OutboxToCommunityDispatcher.java` | 전송 대상 `CommunityWebHookClient` → `OutboxKafkaPublisher`로 교체. 폴링 로직/상태전이 유지. self-invocation `@Transactional` 리스크 정리(§8). |
| `domain/outbox/converter/OutBoxConverter.java` | HTTP DTO 변환 → Kafka 메시지(payload + 헤더) 변환으로 조정(재사용). |
| `domain/outbox/client/CommunityWebHookClient.java` | 전환 완료 후 제거(또는 한시 유지). |
| `global/config/KafkaProducerConfig.java` (신규) | `acks=all`, `enable.idempotence=true`, 키/값 직렬화, 파티션 키. |
| `application.yml` (gitignore) | Kafka 부트스트랩/토픽/`outbox.dispatch.delay-ms` 상향. 예시는 §8. |

### community
| 파일 | 변경 |
|---|---|
| `recommendation/consumer/RecommendationKafkaListener.java` (신규) | 토픽별 `@KafkaListener` → 기존 서비스 위임. |
| `recommendation/service/RecommendationCommandServiceImpl.java` | 멱등 처리 로직 재사용(변경 최소). |
| `recommendation/controller/RecommendationController.java` | REST 엔드포인트 제거 또는 한시 유지 후 제거. |
| `global/config/KafkaConsumerConfig.java` (신규) | 컨슈머 그룹, 오프셋 커밋 전략, 역직렬화, 에러 핸들러. |

---

## 6. 실패 시나리오 매핑 (설계 검증)

| 시나리오 | 무슨 일 | 결과 |
|---|---|---|
| 정상 | 커밋 → AFTER_COMMIT 발행 성공 → `sent_at` 마킹 | 즉시 전송, 폴링은 이 레코드 무시 |
| A: 브로커 다운 | fast-path 발행 실패(콜백 에러) | `sent_at` NULL 유지 → ②가 재발행. 브로커 복구 후 성공 |
| B: 커밋 후 크래시 | AFTER_COMMIT 발행 전/중 프로세스 사망 | `sent_at` NULL 유지 → 재시작/타 인스턴스의 ②가 줍기 → 전송 |
| 콜백 유실(발행은 됨) | Kafka엔 갔으나 `sent_at` 마킹 전 사망 | ②가 재발행 → **중복** → 소비자 `outbox_id` UNIQUE로 skip |
| 소비자 처리 실패 | 처리 중 예외 | 오프셋 미커밋 → 재소비(멱등) |
| 영구 실패(`attempt≥5`) | 재시도 소진 | 기존과 동일하게 테이블에 잔류(미전송). §8에서 관측성 보강 논의 |

→ **모든 경로에서 유실 없음, 중복은 멱등으로 무해.** 목적(지연 제거)과 정합성(무유실)을 동시 충족.

---

## 7. 데이터 흐름 (정상 경로)

1. `TransactionService.executeTransaction()` — 거래/혜택 저장 + `saveTransactionOutBox()` (T1, 같은 커밋)
2. T1 커밋 → `OutboxCommitListener`(AFTER_COMMIT) 발동
3. `OutboxKafkaPublisher.publish(ids)` → `command.corebank.transaction-completed.v1`에 `userId` 키로 발행
4. 성공 콜백 → outbox `sent_at = now()`
5. `community` `RecommendationKafkaListener` 소비 → `existsByOutboxId` 확인 → 신규면 처리 + `EventConsumeLog` 저장 → 오프셋 커밋
6. (병렬) `OutboxToCommunityDispatcher`가 30~60초마다 `sent_at IS NULL` 스캔 → 있으면 3~4 반복(안전망)

---

## 8. 설정 · 인프라 · 곁다리 개선

### 로컬 인프라
- `docker-compose.yml`에 Kafka(단일 브로커 KRaft 모드로 충분) + (선택) Kafka UI 추가. 포트폴리오 재현성 확보.

### 설정 예시 (application.yml — 저장소엔 gitignore, 문서로 기록)
```yaml
spring:
  kafka:
    bootstrap-servers: localhost:9092
    producer:
      acks: all
      properties:
        enable.idempotence: true
    consumer:
      group-id: community-recommendation
      auto-offset-reset: earliest
      enable-auto-commit: false
outbox:
  dispatch:
    delay-ms: 30000        # 5000 → 상향(안전망)
    initial-delay-ms: 5000
```

### 곁다리 개선 (지금 손대는 코드라 함께 정리 — 과설계 금지)
1. **Dispatcher self-invocation `@Transactional` 리스크**: 같은 빈 내 `protected @Transactional` 메서드 호출은 프록시 AOP가 안 걸릴 수 있음. 발행 로직을 별도 빈(`OutboxKafkaPublisher`)으로 분리하면서 자연히 해소된다.
2. **placeholder 저장 후 setter 갱신(dirty checking 의존)**: 현 방식 유지하되, 발행 시점에 payload가 확정돼 있는지 검증 로그 추가.
3. **영구 실패(`attempt≥5`) 관측성**: 현재 별도 알림 없이 방치. 최소한 **미전송 오래된 건수 메트릭/로그**를 남겨 안전망이 놓치는 것을 감지(경량 DLQ 대체). Firebase/배치 알림 인프라가 이미 있으나 스코프 밖 — 메트릭만.

---

## 9. 트레이드오프 (명시적 저울질)

| 결정 | 택한 것 | 버린 것 | 이유 |
|---|---|---|---|
| 유실 방어 방식 | **직접발행 + 폴링 안전망** (계열 A) | CDC 재동기화 배치 (계열 B) | 규모상 outbox `sent_at` 이벤트 단위 복구가 소스 전량 재스캔보다 저비용. 인프라(Debezium) 불필요. |
| 폴링 처리 | **저주기로 유지** | 완전 제거 | 제거하면 B(크래시 유실) 방어 불가. 존치가 안전망의 핵심. |
| fast-path 신뢰성 | **best-effort(마킹 실패 시 폴링 위임)** | fast-path에서 재시도 책임까지 | 재시도를 폴링에 일원화 → 발행 경로 단순. 중복은 멱등이 흡수. |
| 순서 보장 | **userId 단위** | 전역 순서 | 추천 반영에 사용자 단위면 충분. 전역 순서는 파티션 1개 강제라 처리량 희생. |
| age 픽업 조건(§4.3) | **선택 도입** | 항상 도입 | 중복 발행 창은 줄지만 안전망 반응이 느려짐. 멱등이 있어 필수 아님 — 부하 보고 결정. |
| 초기 전송 | 정합성 우선 | 최저 지연 극단 추구 | at-least-once + 멱등으로 "무유실"을 우선, 지연은 fast-path로 충분히 해결. |

---

## 10. 발전 방향 (포트폴리오 "확장" 서술 — 범위 밖)

- **CDC 승격 (계열 B)**: 앱 발행을 제거하고 Debezium이 PostgreSQL WAL을 tailing → Kafka. dual-write 구멍 **원천 제거**. 실제 대규모 색인(Netflix DBLog, Shopify incremental snapshot, Airbnb SpinalTap, 사내 flex 재동기화 배치)이 이 계열. 대가는 Kafka Connect+Debezium 운영 복잡도.
- **재동기화 배치**: 소스(거래 내역) 전량을 주기적으로 재스캔·재발행(`CORRECTION`)해 파생 추천 스토어를 결과적 정합으로 치유(flex 방식). outbox 없이도 무유실 달성 가능한 대안.

이 프로젝트는 계열 A를 택했고, 위 두 가지는 "데이터 규모가 커지고 파생 스토어가 늘면 이 방향으로 승격한다"는 **조건부 로드맵**으로 서술한다.

---

## 11. 범위 밖 (YAGNI)
- 전역 순서 보장, exactly-once 트랜잭셔널 프로듀서-컨슈머 결합.
- CDC/Debezium 도입(발전 방향으로만).
- 다중 브로커/파티션 튜닝, 스키마 레지스트리(Avro) — 단일 브로커 + JSON으로 충분.
- 정식 DLQ 토픽(영구 실패는 메트릭/로그 관측으로 갈음).

---

## 12. 참고 사례 (의사결정 근거)

**계열 A (직접발행 + 안전망) — 채택 근거**
- 29CM: AFTER_COMMIT 직접 발행 + "상태≠send_success & 10분 경과분" 폴링 재발행 — 본 설계의 쌍둥이. https://medium.com/@greg.shiny82/트랜잭셔널-아웃박스-패턴의-실제-구현-사례-29cm-0f822fc23edb
- minjun.blog: AFTER_COMMIT 즉시 발행 + 500ms 폴링(`SKIP LOCKED`) 안전망. https://minjun.blog/outbox_pattern/
- Wix Greyhound: 직접 발행 + broker 다운 시 S3 fallback → 복구 서비스. https://medium.com/wix-engineering/6-event-driven-architecture-patterns-part-2-455cc73b22e1
- 리디: 폴링 퍼블리셔(CDC 의도적 배제, 운영 단순성). https://ridicorp.com/story/transactional-outbox-pattern-ridi/

**계열 B (CDC + 재동기화) — 발전 방향 근거**
- 우아한형제들: Debezium CDC + Outbox 테이블 샤딩(순서/처리량). https://techblog.woowahan.com/17386/
- Netflix DBLog: watermark 기반 on-demand dump(재동기화). https://netflixtechblog.com/dblog-a-generic-change-data-capture-framework-69351fb9099b
- Shopify: Debezium + incremental snapshot backfill. https://shopify.engineering/capturing-every-change-shopify-sharded-monolith
- Airbnb SpinalTap: continuous validator + checkpoint 롤백 자동 치유. https://medium.com/airbnb-engineering/capturing-data-evolution-in-a-service-oriented-architecture-72f7c643ee6f

**공통 원칙 (전 출처 일치)**
- Outbox/CDC = at-least-once. exactly-once "결과"는 **소비자 멱등성**으로 완성 (이 프로젝트: `event_consume_log.outbox_id` UNIQUE, 이미 구현).
- 참고: microservices.io(Chris Richardson), Confluent dual-write blog, Debezium, AWS/Azure outbox 가이드.
