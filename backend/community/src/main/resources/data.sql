CREATE EXTENSION IF NOT EXISTS postgis;
CREATE EXTENSION IF NOT EXISTS postgis_topology;

SET TIME ZONE 'Asia/Seoul';

-- 이미 같은 (channel, token_hash)가 있을 수 있으니, 중복은 무시
-- 제약 이름을 그대로 사용: uq_push_token_channel_hash
INSERT INTO push_token
(user_id, channel, token, token_hash, active, fail_count, invalid_type,
 last_seen_at, last_sent_at, app_version, os_version, device_version,
 created_date, updated_date)
VALUES
-- 활성 PUSH 토큰: 최근 본 / 최근 보낸 시각 예시
(1001, 'EXPO', 'ExponentPushToken[Xa-K20A8h9SQ12HRvQqAoo]', 'ExponentPushToken[Xa-K20A8h9SQ12HRvQqAoo]',
 true, 0, NULL,
 now() - interval '10 minutes', now() - interval '1 day', '1.2.3', 'iOS17.4', 'iPhone12,1',
 now(), now()),
(1002, 'PUSH', 'fcm_1002_A', '2222222222222222222222222222222222222222222222222222222222222222',
 true, 0, NULL,
 now() - interval '45 minutes', now() - interval '2 days', '1.1.9', 'Android14', 'SM-S911N',
 now(), now()),
(1003, 'PUSH', 'fcm_1003_A', '3333333333333333333333333333333333333333333333333333333333333333',
 true, 0, NULL,
 now() - interval '2 hours', now() - interval '3 days', '1.0.0', 'iOS17.0', 'iPhone13,4',
 now(), now()),

-- 비활성/실패 누적 토큰 예시
(1001, 'PUSH', 'fcm_1001_OLD', '4444444444444444444444444444444444444444444444444444444444444444',
 false, 3, NULL,
 now() - interval '30 days', now() - interval '40 days', '0.9.0', 'iOS16.7', 'iPhone10,4',
 now(), now()),

-- INAPP 채널 토큰(있다면): 채널이 다르면 같은 해시도 허용되지만 여기선 해시도 다르게 둠
(1004, 'INAPP', 'inapp_1004_A', '5555555555555555555555555555555555555555555555555555555555555555',
 true, 0, NULL,
 now() - interval '5 minutes', NULL, '2.0.1', 'Android13', 'Pixel6',
 now(), now()),

-- 또 다른 활성 PUSH 토큰
(1005, 'PUSH', 'fcm_1005_A', '6666666666666666666666666666666666666666666666666666666666666666',
 true, 0, NULL,
 now() - interval '3 minutes', now() - interval '6 hours', '1.3.0', 'Android14', 'SM-S921N',
 now(), now())

ON CONFLICT ON CONSTRAINT uq_push_token_channel_hash DO NOTHING;

-- university 더미 데이터
INSERT INTO university (
    id, name, type, campus_name, address, location, postal_code, main_phone,
    website, domain, access, "created_date", "updated_date"
)
VALUES
(
    1, '서울대학교', 'PUBLIC', '본캠퍼스', '서울 관악구',
    ST_GeomFromText('POINT(126.9568 37.4599)', 4326),
    '08826', '02-880-5114', 'https://www.snu.ac.kr', 'snu.ac.kr',
    'PUBLIC', NOW(), NOW()
),
(
    2, '연세대학교', 'PRIVATE', '신촌캠퍼스', '서울 서대문구',
    ST_GeomFromText('POINT(126.9368 37.5655)', 4326),
    '03722', '02-2123-2114', 'https://www.yonsei.ac.kr', 'yonsei.ac.kr',
    'PRIVATE', NOW(), NOW()
),
(
    3, '고려대학교', 'PRIVATE', '안암캠퍼스', '서울 성북구',
    ST_GeomFromText('POINT(127.0276 37.5894)', 4326),
    '02841', '02-3290-1114', 'https://www.korea.ac.kr', 'korea.ac.kr',
    'PRIVATE', NOW(), NOW()
),
(
    4, '한양대학교', 'PRIVATE', '서울캠퍼스', '서울 성동구',
    ST_GeomFromText('POINT(127.0455 37.5571)', 4326),
    '04763', '02-2220-0114', 'https://www.hanyang.ac.kr', 'hanyang.ac.kr',
    'PRIVATE', NOW(), NOW()
),
(
    5, '성균관대학교', 'PRIVATE', '명륜캠퍼스', '서울 종로구',
    ST_GeomFromText('POINT(126.9936 37.5874)', 4326),
    '03063', '02-760-0114', 'https://www.skku.edu', 'skku.edu',
    'PRIVATE', NOW(), NOW()
),
(
    6, '이화여자대학교', 'PRIVATE', '본캠퍼스', '서울 서대문구',
    ST_GeomFromText('POINT(126.9445 37.5643)', 4326),
    '03760', '02-3277-2114', 'https://www.ewha.ac.kr', 'ewha.ac.kr',
    'PRIVATE', NOW(), NOW()
),
(
    7, '중앙대학교', 'PRIVATE', '서울캠퍼스', '서울 동작구',
    ST_GeomFromText('POINT(126.9581 37.5049)', 4326),
    '06974', '02-820-5114', 'https://www.cau.ac.kr', 'cau.ac.kr',
    'PRIVATE', NOW(), NOW()
),
(
    8, '부산대학교', 'PUBLIC', '부산캠퍼스', '부산 금정구',
    ST_GeomFromText('POINT(129.0914 35.2322)', 4326),
    '46241', '051-510-1212', 'https://www.pusan.ac.kr', 'pusan.ac.kr',
    'PUBLIC', NOW(), NOW()
),
(
    9, '경북대학교', 'PUBLIC', '대구캠퍼스', '대구 북구',
    ST_GeomFromText('POINT(128.6105 35.8886)', 4326),
    '41566', '053-950-5114', 'https://www.knu.ac.kr', 'knu.ac.kr',
    'PUBLIC', NOW(), NOW()
),
(
    10, '전북대학교', 'PUBLIC', '전주캠퍼스', '전북 전주시 덕진구',
    ST_GeomFromText('POINT(127.1297 35.8485)', 4326),
    '54896', '063-270-2114', 'https://www.jbnu.ac.kr', 'jbnu.ac.kr',
    'PUBLIC', NOW(), NOW()
)
ON CONFLICT (id) DO NOTHING;

-- user_university 더미 매핑 (user_id → university_id)
-- university_id는 실제 존재하는 대학교 id로 바꿔서 쓰면 됨
INSERT INTO user_university (user_id, university_id, created_date, updated_date)
VALUES
    (1001, 1, NOW(), NOW()),
    (1002, 1, NOW(), NOW()),
    (1003, 2, NOW(), NOW()),
    (1004, 3, NOW(), NOW()),
    (1005, 4, NOW(), NOW()),
    (1006, 5, NOW(), NOW()),
    (1007, 6, NOW(), NOW());


--Category 더미 데이터
INSERT INTO category (
id, name, code
) VALUES
(
    1, 'CAFE', '001'
),
(
    2, 'BEAUTY', '002'
),
(
    3, 'CONVENIENCE STORE', '003'
),
(
    4, 'FOOD', '004'
),
(
    5, 'CULTURE', '005'
)
ON CONFLICT (id) DO NOTHING;


-- partnership 더미 데이터
INSERT INTO partnership (
    id, company_name, category_id, discount_rate, discount_amount,
    terms, notes, status, university_id, created_date, updated_date
) VALUES
(
    1, 'Starbucks', 1, 10.00, 1000.00,
    '10% off for university students', 'Notes about the partnership',
    'ACTIVE', 1, NOW(), NOW()
),
(
    2, 'OliveYoung', 2, 10.00, 3000.00,
    '10% off for university students', 'Notes about the partnership',
    'ACTIVE', 1, NOW(), NOW()
),
(
    3, 'CU', 3, 10.00, 3000.00,
    '10% off for university students', 'Notes about the partnership',
    'EXPIRED', 1, NOW(), NOW()
)
ON CONFLICT (id) DO NOTHING;


--partnership_branch 더미 데이터
INSERT INTO partnership_branch
(id, name, address, location, phone, business_hours_json, start_date, end_date, status, partnership_id)
VALUES
(
    1,
    '스타벅스 관악서울대입구R점',
    '서울 관악구 관악로 158',
    ST_SetSRID(ST_MakePoint(126.95280377997965, 37.47927529407993), 4326), -- 경도, 위도
    '02-1234-5678',
    '{"mon":"07:00-22:00","tue":"07:00-22:00","wed":"07:00-22:00","thu":"07:00-22:00","fri":"07:00-22:00","sat":"07:00-22:00","sun":"07:00-22:00"}',
    '2025-08-01',
    '2025-09-30',
    'ACTIVE',
    1
),
(
    2,
    '스타벅스 서울대입구역점',
    '서울 관악구 남부순환로 1812',
    ST_SetSRID(ST_MakePoint(126.95135823610674 , 37.48116232181828), 4326), -- 경도, 위도
    '02-1234-5678',
    '{"mon":"07:00-22:00","tue":"07:00-22:00","wed":"07:00-22:00","thu":"07:00-22:00","fri":"07:00-22:00","sat":"07:00-22:00","sun":"07:00-22:00"}',
    '2025-08-01',
    '2025-09-30',
    'ACTIVE',
    1
),
(
    3,
    '스타벅스 서울대입구역8번출구점',
    '서울 관악구 남부순환로 1831',
    ST_SetSRID(ST_MakePoint(126.95365619637556 , 37.4811767606375), 4326), -- 경도, 위도
    '02-1234-5678',
    '{"mon":"07:00-22:00","tue":"07:00-22:00","wed":"07:00-22:00","thu":"07:00-22:00","fri":"07:00-22:00","sat":"07:00-22:00","sun":"07:00-22:00"}',
    '2025-08-01',
    '2025-09-30',
    'ACTIVE',
    1
),
(
    4,
    '올리브영 관악 타운',
    '서울 관악구 관악로 173',
    ST_SetSRID(ST_MakePoint(126.95227152324334, 37.480662634299556), 4326), -- 경도, 위도
    '02-1234-5678',
    '{"mon":"07:00-22:00","tue":"07:00-22:00","wed":"07:00-22:00","thu":"07:00-22:00","fri":"07:00-22:00","sat":"07:00-22:00","sun":"07:00-22:00"}',
    '2025-08-01',
    '2025-08-31',
    'ACTIVE',
    2
),
(
    5,
    '올리브영 서울대입구역점',
    '서울 관악구 남부순환로 1840 올리브영',
    ST_SetSRID(ST_MakePoint(126.95430397934122 , 37.48034357962654), 4326), -- 경도, 위도
    '02-1234-5678',
    '{"mon":"07:00-22:00","tue":"07:00-22:00","wed":"07:00-22:00","thu":"07:00-22:00","fri":"07:00-22:00","sat":"07:00-22:00","sun":"07:00-22:00"}',
    '2025-08-01',
    '2025-08-31',
    'ACTIVE',
    2
)
ON CONFLICT (id) DO NOTHING;

INSERT INTO partnership_image
(id,image_url, partnership_id)
VALUES
    (1, 'https://heyoung.s3.ap-northeast-2.amazonaws.com/store_image.png', 1),
    (2, 'https://heyoung.s3.ap-northeast-2.amazonaws.com/store_image.png', 1),
    (3, 'https://heyoung.s3.ap-northeast-2.amazonaws.com/store_image.png', 2),
    (4, 'https://heyoung.s3.ap-northeast-2.amazonaws.com/store_image.png', 2),
    (5, 'https://heyoung.s3.ap-northeast-2.amazonaws.com/store_image.png', 3)
ON CONFLICT (id) DO NOTHING;

INSERT INTO user_university (id, user_id, university_id, created_date, updated_date)
VALUES (1, 1, 1, NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

INSERT INTO notification
(user_id, title, content, type, channel, click_url, image_path,
 send_status, scheduled_at, partnership_id, created_date, updated_date)
VALUES
    (
        1001,                                        -- << 테스트할 사용자 ID
        '[테스트] 곧 발송 예정',                       -- title
        '곧 발송되는지 점검하는 더미 메시지입니다.',     -- content
        'PAYMENT_BASED',                              -- NotificationType (너희 enum 값으로 맞춰)
        'EXPO',                                       -- NotificationChannel (INAPP/PUSH 중 실제 발송 로직이 보는 값)
        'https://example.com',                        -- click_url
        'https://picsum.photos/200',                  -- image_path
        'SCHEDULED',                                  -- SendStatus
        NOW() + INTERVAL '10 seconds',                -- 30초 뒤 발송
        (SELECT p.id
         FROM partnership p
         WHERE p.status = 'ACTIVE'
         ORDER BY p.id DESC
         LIMIT 1),                                   -- 임의의 활성 제휴 하나
        NOW(), NOW()
    );
