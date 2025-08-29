INSERT INTO users (id, user_key, email, password, name, student_number, phone, status, created_date, updated_date)
VALUES (1, '6cf1c68c-2c4f-4c33-8694-d0f9136ec54c', 'tjdwntjdeo@naver.com', 'benefit14!', '김성주', '2020111111', '010-1234-5678', 'ACTIVE', NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

INSERT INTO account (id, account_number, balance, bank_name, bank_code, holder_name, user_id, created_date, updated_date)
VALUES (1, '0010557208817301', 999999900, '한국은행', 'BANK_OF_KOREA',  'holderName', 1, NOW(), NOW())
ON CONFLICT (id) DO NOTHING;


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