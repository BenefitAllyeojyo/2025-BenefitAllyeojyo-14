# 헤이영  서버 (heyyoung  server)

대학생들을 위한 혜택 정보 플랫폼의 핵심 웹 애플리케이션입니다. **커뮤니티 서버와 결제서버를 물리적으로 분리하여 보안성을 높였습니다**

- **앱 이름**: 혜택을 알려줘 (BenefitAllyeojyo)
- **버전**: 1.0.0
- **개발 도구**: Spring + postgreSQL
- **실제 배포**: AWS EC2, AWS RDS
- **스웨거** " https://api.brainpix.net/swagger-ui/index.html#/

## 🚀 시작하기

### 필수 요구사항
- Java 17
- postgreSQL 17 + postGIS 3.5

### community server application.yml 설정

```
spring:
  web:
    resources:
      add-mappings: false
  datasource:
    write:
      driver-class-name: org.postgresql.Driver
      jdbc-url: <your-write-databse>
      username: <userName>>
      password: <password>
    read:
      driver-class-name: org.postgresql.Driver
      jdbc-url: <your-read-databse>
      username: <userName>>
      password: <password>
  jpa:
    properties:
      hibernate:
        format_sql: true
    defer-datasource-initialization: true
    show-sql: true
    hibernate:
      ddl-auto: create
    open-in-view: false
  sql:
    init:
      mode: always
  batch:
    job:
      enabled: false # 애플리케이션 부팅 시 자동 실행 방지
    jdbc:
      initialize-schema: always # 배치 메타테이블 자동 생성(해커톤 용)

api:
  core-bank:
    url: <core-bank-url>

firebase:
  credentials:
    type: <type>
    project_id: <id>
    private_key_id: <id>
    private_key: <key>
    client_email: <email>
    client_id: <id>
    auth_uri:  <url>
    token_uri:  <url>
    auth_provider_x509_cert_url:  <url>
    client_x509_cert_url: <url>
    universe_domain: <domain>

```
### core-bank server application.yml 설정

```
spring:
  datasource:
    write:
      driver-class-name: org.postgresql.Driver
      jdbc-url: <your-write-databse>
      username: <userName>>
      password: <password>
    read:
      driver-class-name: org.postgresql.Driver
      jdbc-url: <your-read-databse>
      username: <userName>>
      password: <password>
  jpa:
    properties:
      hibernate:
        format_sql: true
    defer-datasource-initialization: true
    show-sql: true
    hibernate:
      ddl-auto: create
    open-in-view: false
  sql:
    init:
      mode: always

logging:
  level:
    org.hibernate.SQL: warn

community:
  base-url: <your-community-server-url>
  webhook:
    endpoints:
      TRANSACTION_COMPLETED: /recommendations/category
      PAYMENT_METHOD_LINKED: /recommendations/hour

outbox:
  dispatch:
    delay-ms: 5000            # 주기
    initial-delay-ms: 2000    # 기동 직후 약간 늦게 시작

api:
  core-bank:
    url: <your-server-url>


external:
  bank:
    api:
      url:
        inquire: <bank-url>
        withdraw: <bank-url>
        history: <bank-url>
      key: "<api-key>"

jwt:
  secret:
    key: <jwt-key>
  qr:
    expiration:
      ms: 60000

jasypt:
  encryptor:
    password: <db-encode-key>


```



## 🏗️ 프로젝트 구조

```
community/
├── ⚙️ .gradle/                    
├── 🏗️ build/                     
├── 📱 src/
│   └── main/
│       └── java/
│           └── com/
│               └── heyoung/
│                   ├── 📁 domain/              # 도메인별 기능
│                   │   ├── 📁 benefit/         # 혜택 관련
│                   │   ├── 📁 notification/    # 알림 관련
│                   │   ├── 📁 payment/         # 결제 관련
│                   │   ├── 📁 recommendation/  # 추천 관련
│                   │   └── 📁 university/      # 대학교 관련
│                   ├── 🌐 global/              # 전역 설정 및 공통 모듈
│                   │   ├── 📁 entity/          # 엔티티 클래스
│                   │   ├── 📁 enums/           # 열거형
│                   │   ├── 📁 exception/       # 예외 처리
│                   │   ├── 📁 infra/           # 인프라 관련
│                   │   ├── 📁 swaggerconfig/   # Swagger 설정
│                   │   ├── 📁 util/            # 유틸리티 함수
│                   │   └── 📁 webconfig/       # 웹 관련 설정
│                   └── 🚀 HeyoungCommunityApplication.java # 메인 애플리케이션 실행 클래스


core-bank/
├── 🏗️ build/                     
├── 📱 src/
│   └── main/
│       └── java/
│           └── com/
│               └── heyoung/
│                   ├── 📁 domain/              # 도메인별 기능
│                   │   ├── 📁 outbox/          # 아웃박스 패턴 관련
│                   │   ├── 📁 payment/         # 결제 관련
│                   │   └── 📁 user/            # 사용자 관련
│                   ├── 🌐 global/              # 전역 설정 및 공통 모듈
│                   │   ├── ⚙️ config/          # 환경 설정
│                   │   ├── 🔐 encoding/        # 인코딩 관련
│                   │   ├── 📁 entity/          # 엔티티 클래스
│                   │   ├── 📁 enums/           # 열거형
│                   │   ├── 📁 exception/       # 예외 처리
│                   │   ├── 📁 swaggerconfig/   # Swagger 설정
│                   │   └── 📁 utils/           # 유틸리티 함수
│                   └── 🚀 HeyoungCoreBankApplication.java # 메인 애플리케이션 실행 클래스

```

## 🔧 주요 기능 및 설계

###  1. 지도 기반 혜택 조회

###  2. 사용하지 않은 혜택 알림

###  3. QR 결제 시 자동으로 혜택 적용

###  4. 데이터베이스 주요 정보 암호화 데이터베이스 레플리카 적용

###  5. 커뮤니티 서버와 코어뱅크 서버 망분리

## 🌎 인프라 
<img width="1124" height="905" alt="image" src="https://github.com/user-attachments/assets/5d1989c2-4341-41f5-b555-7753f4a8103e" />

## Scouter 모니터링
<img width="1911" height="1058" alt="image" src="https://github.com/user-attachments/assets/3fa0c346-3bce-4c64-8205-4f123a799a39" />

## 커뮤니티 서버 ERD
<img width="1240" height="878" alt="image" src="https://github.com/user-attachments/assets/2d0d8305-1c94-4a24-9563-c5ff94249a2e" />

## 코어뱅크 서버 ERD 
<img width="964" height="885" alt="image" src="https://github.com/user-attachments/assets/b6ff8f05-8da7-48c7-86f3-bb51b6d795d1" />



