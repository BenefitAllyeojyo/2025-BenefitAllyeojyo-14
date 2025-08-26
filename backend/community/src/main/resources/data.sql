CREATE EXTENSION IF NOT EXISTS postgis;
CREATE EXTENSION IF NOT EXISTS postgis_topology;

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