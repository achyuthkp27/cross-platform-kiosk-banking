-- Seed Customer if not exists (using manual ID 1 to be safe or rely on sequence reset if empty)
-- Since I don't want to conflict with existing auto-gen, I'll try to insert with a specific ID if empty?
-- Better: Use "INSERT INTO customers ... ON CONFLICT (user_id) DO NOTHING;"

INSERT INTO customers (user_id, name, dob_hash, pin_hash, mobile_number, email, created_at, updated_at, status, theme_pref, language_pref) 
VALUES ('DEMO001', 'Demo User', 'dummyhash01011990', '$2a$10$SomethingFor1234', '9876543210', 'demo@example.com', NOW(), NOW(), 'ACTIVE', 'light', 'en')
ON CONFLICT (user_id) DO NOTHING;

-- Seed Accounts
INSERT INTO accounts (customer_id, account_number, balance, available_balance, type, status, created_at)
SELECT id, '1000000001', 50000.00, 50000.00, 'SAVINGS', 'ACTIVE', NOW()
FROM customers WHERE user_id = 'DEMO001'
AND NOT EXISTS (SELECT 1 FROM accounts WHERE account_number = '1000000001');

INSERT INTO accounts (customer_id, account_number, balance, available_balance, type, status, created_at)
SELECT id, '2000000001', 150000.00, 150000.00, 'CURRENT', 'ACTIVE', NOW()
FROM customers WHERE user_id = 'DEMO001'
AND NOT EXISTS (SELECT 1 FROM accounts WHERE account_number = '2000000001');

-- Seed Cards
-- Card 1 (Debit)
INSERT INTO cards (user_id, account_id, card_number, cvv, pin, type, status, expiry_date, created_at)
SELECT 'DEMO001', id, '4532789012348890', '123', '1234', 'DEBIT', 'ACTIVE', '2028-12-31', NOW()
FROM accounts 
WHERE customer_id = (SELECT id FROM customers WHERE user_id = 'DEMO001' LIMIT 1)
AND account_number = '1000000001'
AND NOT EXISTS (SELECT 1 FROM cards WHERE card_number = '4532789012348890');

-- Card 2 (Credit)
INSERT INTO cards (user_id, account_id, card_number, cvv, pin, type, status, expiry_date, created_at)
SELECT 'DEMO001', id, '5412789012343456', '456', '4321', 'CREDIT', 'ACTIVE', '2027-09-30', NOW()
FROM accounts 
WHERE customer_id = (SELECT id FROM customers WHERE user_id = 'DEMO001' LIMIT 1)
AND account_number = '2000000001'
AND NOT EXISTS (SELECT 1 FROM cards WHERE card_number = '5412789012343456');
