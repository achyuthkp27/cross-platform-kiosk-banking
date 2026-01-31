-- Comprehensive Seed Data Script
-- Creates multiple realistic users with full data
-- Run this after schema creation

-- =====================================================
-- CLEAR EXISTING DATA (for clean re-seeding)
-- =====================================================
TRUNCATE account_statements CASCADE;
TRUNCATE transactions CASCADE;
TRUNCATE cheque_book_orders CASCADE;
TRUNCATE customer_cards CASCADE;
TRUNCATE accounts CASCADE;
TRUNCATE customers CASCADE;

-- =====================================================
-- CUSTOMERS (3 demo users)
-- DOB format for login: DD/MM/YYYY
-- =====================================================

-- User 1: DEMO001 - John Demo (DOB: 01/01/1990)
INSERT INTO customers (user_id, dob_hash, pin_hash, name, mobile_number, email, language_pref, theme_pref, status)
VALUES ('DEMO001', '$2a$10$dummyhash_01011990', '$2a$10$dummyhash_pin1234', 'John Demo', '9876543210', 'john.demo@email.com', 'en', 'dark', 'ACTIVE');

-- User 2: SARAH02 - Sarah Miller (DOB: 15/06/1985)
INSERT INTO customers (user_id, dob_hash, pin_hash, name, mobile_number, email, language_pref, theme_pref, status)
VALUES ('SARAH02', '$2a$10$dummyhash_15061985', '$2a$10$dummyhash_pin1234', 'Sarah Miller', '8765432109', 'sarah.miller@email.com', 'en', 'light', 'ACTIVE');

-- User 3: RAJESH3 - Rajesh Kumar (DOB: 22/11/1978)
INSERT INTO customers (user_id, dob_hash, pin_hash, name, mobile_number, email, language_pref, theme_pref, status)
VALUES ('RAJESH3', '$2a$10$dummyhash_22111978', '$2a$10$dummyhash_pin1234', 'Rajesh Kumar', '7654321098', 'rajesh.kumar@email.com', 'en', 'dark', 'ACTIVE');

-- =====================================================
-- ACCOUNTS (Multiple accounts per user)
-- =====================================================

-- John Demo's accounts
INSERT INTO accounts (customer_id, account_number, ifsc_code, balance, available_balance, type, status)
SELECT id, '1001234567', 'KIOSK0001234', 75250.50, 73500.00, 'SAVINGS', 'ACTIVE' FROM customers WHERE user_id = 'DEMO001';

INSERT INTO accounts (customer_id, account_number, ifsc_code, balance, available_balance, type, status)
SELECT id, '1001234568', 'KIOSK0001234', 185000.00, 185000.00, 'CURRENT', 'ACTIVE' FROM customers WHERE user_id = 'DEMO001';

-- Sarah Miller's accounts
INSERT INTO accounts (customer_id, account_number, ifsc_code, balance, available_balance, type, status)
SELECT id, '2002345671', 'KIOSK0001234', 42500.75, 40000.00, 'SAVINGS', 'ACTIVE' FROM customers WHERE user_id = 'SARAH02';

INSERT INTO accounts (customer_id, account_number, ifsc_code, balance, available_balance, type, status)
SELECT id, '2002345672', 'KIOSK0001234', 320000.00, 320000.00, 'CURRENT', 'ACTIVE' FROM customers WHERE user_id = 'SARAH02';

-- Rajesh Kumar's accounts
INSERT INTO accounts (customer_id, account_number, ifsc_code, balance, available_balance, type, status)
SELECT id, '3003456789', 'KIOSK0001234', 156780.25, 155000.00, 'SAVINGS', 'ACTIVE' FROM customers WHERE user_id = 'RAJESH3';

-- =====================================================
-- CUSTOMER CARDS
-- =====================================================

-- John Demo's cards
INSERT INTO customer_cards (customer_id, card_number_masked, card_type, card_network, expiry_date, status)
SELECT id, '**** **** **** 4521', 'DEBIT', 'VISA', '08/2027', 'ACTIVE' FROM customers WHERE user_id = 'DEMO001';

INSERT INTO customer_cards (customer_id, card_number_masked, card_type, card_network, expiry_date, status)
SELECT id, '**** **** **** 8812', 'CREDIT', 'MASTERCARD', '03/2026', 'ACTIVE' FROM customers WHERE user_id = 'DEMO001';

-- Sarah Miller's cards
INSERT INTO customer_cards (customer_id, card_number_masked, card_type, card_network, expiry_date, status)
SELECT id, '**** **** **** 3345', 'DEBIT', 'RUPAY', '11/2028', 'ACTIVE' FROM customers WHERE user_id = 'SARAH02';

INSERT INTO customer_cards (customer_id, card_number_masked, card_type, card_network, expiry_date, status, blocked_reason)
SELECT id, '**** **** **** 6721', 'CREDIT', 'VISA', '06/2025', 'BLOCKED', 'Lost card reported' FROM customers WHERE user_id = 'SARAH02';

-- Rajesh Kumar's cards
INSERT INTO customer_cards (customer_id, card_number_masked, card_type, card_network, expiry_date, status)
SELECT id, '**** **** **** 9901', 'DEBIT', 'VISA', '12/2027', 'ACTIVE' FROM customers WHERE user_id = 'RAJESH3';

-- =====================================================
-- ACCOUNT STATEMENTS (Transaction History)
-- =====================================================

-- John Demo - Savings Account (1001234567) Transaction History
INSERT INTO account_statements (account_id, txn_type, amount, balance_after, description, reference_id, txn_date)
SELECT id, 'CREDIT', 100000.00, 100000.00, 'Opening Deposit via Cash', 'OPEN_001', NOW() - INTERVAL '90 days' FROM accounts WHERE account_number = '1001234567';

INSERT INTO account_statements (account_id, txn_type, amount, balance_after, description, reference_id, txn_date)
SELECT id, 'CREDIT', 45000.00, 145000.00, 'Salary Credit - TechCorp Solutions', 'SAL_DEC_001', NOW() - INTERVAL '60 days' FROM accounts WHERE account_number = '1001234567';

INSERT INTO account_statements (account_id, txn_type, amount, balance_after, description, reference_id, txn_date)
SELECT id, 'DEBIT', 15000.00, 130000.00, 'EMI - Home Loan #HL2023001', 'EMI_DEC_001', NOW() - INTERVAL '58 days' FROM accounts WHERE account_number = '1001234567';

INSERT INTO account_statements (account_id, txn_type, amount, balance_after, description, reference_id, txn_date)
SELECT id, 'DEBIT', 8500.00, 121500.00, 'Online Shopping - Amazon', 'AMZN_001', NOW() - INTERVAL '52 days' FROM accounts WHERE account_number = '1001234567';

INSERT INTO account_statements (account_id, txn_type, amount, balance_after, description, reference_id, txn_date)
SELECT id, 'DEBIT', 2800.00, 118700.00, 'Electricity Bill - Adani Power', 'BILL_ELEC_001', NOW() - INTERVAL '45 days' FROM accounts WHERE account_number = '1001234567';

INSERT INTO account_statements (account_id, txn_type, amount, balance_after, description, reference_id, txn_date)
SELECT id, 'CREDIT', 45000.00, 163700.00, 'Salary Credit - TechCorp Solutions', 'SAL_JAN_001', NOW() - INTERVAL '30 days' FROM accounts WHERE account_number = '1001234567';

INSERT INTO account_statements (account_id, txn_type, amount, balance_after, description, reference_id, txn_date)
SELECT id, 'DEBIT', 15000.00, 148700.00, 'EMI - Home Loan #HL2023001', 'EMI_JAN_001', NOW() - INTERVAL '28 days' FROM accounts WHERE account_number = '1001234567';

INSERT INTO account_statements (account_id, txn_type, amount, balance_after, description, reference_id, txn_date)
SELECT id, 'DEBIT', 25000.00, 123700.00, 'Fund Transfer to Savings', 'NEFT_001', NOW() - INTERVAL '20 days' FROM accounts WHERE account_number = '1001234567';

INSERT INTO account_statements (account_id, txn_type, amount, balance_after, description, reference_id, txn_date)
SELECT id, 'DEBIT', 3500.00, 120200.00, 'Water Bill - BWSSB', 'BILL_WATER_001', NOW() - INTERVAL '15 days' FROM accounts WHERE account_number = '1001234567';

INSERT INTO account_statements (account_id, txn_type, amount, balance_after, description, reference_id, txn_date)
SELECT id, 'DEBIT', 12000.00, 108200.00, 'Insurance Premium - LIC', 'INS_001', NOW() - INTERVAL '10 days' FROM accounts WHERE account_number = '1001234567';

INSERT INTO account_statements (account_id, txn_type, amount, balance_after, description, reference_id, txn_date)
SELECT id, 'DEBIT', 5000.00, 103200.00, 'ATM Withdrawal - HDFC ATM', 'ATM_001', NOW() - INTERVAL '7 days' FROM accounts WHERE account_number = '1001234567';

INSERT INTO account_statements (account_id, txn_type, amount, balance_after, description, reference_id, txn_date)
SELECT id, 'CREDIT', 8000.00, 111200.00, 'UPI Credit - PhonePe', 'UPI_REC_001', NOW() - INTERVAL '5 days' FROM accounts WHERE account_number = '1001234567';

INSERT INTO account_statements (account_id, txn_type, amount, balance_after, description, reference_id, txn_date)
SELECT id, 'DEBIT', 799.00, 110401.00, 'Netflix Subscription', 'SUB_NETF_001', NOW() - INTERVAL '3 days' FROM accounts WHERE account_number = '1001234567';

INSERT INTO account_statements (account_id, txn_type, amount, balance_after, description, reference_id, txn_date)
SELECT id, 'DEBIT', 35150.50, 75250.50, 'Fund Transfer - IMPS to ICICI', 'IMPS_001', NOW() - INTERVAL '1 day' FROM accounts WHERE account_number = '1001234567';

-- John Demo - Current Account (1001234568) Transaction History
INSERT INTO account_statements (account_id, txn_type, amount, balance_after, description, reference_id, txn_date)
SELECT id, 'CREDIT', 200000.00, 200000.00, 'Opening Deposit - Cheque', 'OPEN_002', NOW() - INTERVAL '120 days' FROM accounts WHERE account_number = '1001234568';

INSERT INTO account_statements (account_id, txn_type, amount, balance_after, description, reference_id, txn_date)
SELECT id, 'DEBIT', 50000.00, 150000.00, 'Vendor Payment - TCS', 'VEND_001', NOW() - INTERVAL '90 days' FROM accounts WHERE account_number = '1001234568';

INSERT INTO account_statements (account_id, txn_type, amount, balance_after, description, reference_id, txn_date)
SELECT id, 'CREDIT', 85000.00, 235000.00, 'Business Receipt - Invoice #1234', 'BIZ_REC_001', NOW() - INTERVAL '60 days' FROM accounts WHERE account_number = '1001234568';

INSERT INTO account_statements (account_id, txn_type, amount, balance_after, description, reference_id, txn_date)
SELECT id, 'DEBIT', 50000.00, 185000.00, 'Office Rent - Jan 2026', 'RENT_001', NOW() - INTERVAL '30 days' FROM accounts WHERE account_number = '1001234568';

-- Sarah Miller - Savings Account (2002345671) Transaction History
INSERT INTO account_statements (account_id, txn_type, amount, balance_after, description, reference_id, txn_date)
SELECT id, 'CREDIT', 50000.00, 50000.00, 'Opening Deposit', 'OPEN_003', NOW() - INTERVAL '180 days' FROM accounts WHERE account_number = '2002345671';

INSERT INTO account_statements (account_id, txn_type, amount, balance_after, description, reference_id, txn_date)
SELECT id, 'CREDIT', 35000.00, 85000.00, 'Salary Credit - Infosys', 'SAL_OCT_002', NOW() - INTERVAL '120 days' FROM accounts WHERE account_number = '2002345671';

INSERT INTO account_statements (account_id, txn_type, amount, balance_after, description, reference_id, txn_date)
SELECT id, 'DEBIT', 8000.00, 77000.00, 'Mutual Fund SIP - HDFC', 'SIP_001', NOW() - INTERVAL '100 days' FROM accounts WHERE account_number = '2002345671';

INSERT INTO account_statements (account_id, txn_type, amount, balance_after, description, reference_id, txn_date)
SELECT id, 'CREDIT', 35000.00, 112000.00, 'Salary Credit - Infosys', 'SAL_NOV_002', NOW() - INTERVAL '90 days' FROM accounts WHERE account_number = '2002345671';

INSERT INTO account_statements (account_id, txn_type, amount, balance_after, description, reference_id, txn_date)
SELECT id, 'DEBIT', 25000.00, 87000.00, 'Travel Booking - MakeMyTrip', 'TRV_001', NOW() - INTERVAL '75 days' FROM accounts WHERE account_number = '2002345671';

INSERT INTO account_statements (account_id, txn_type, amount, balance_after, description, reference_id, txn_date)
SELECT id, 'DEBIT', 8000.00, 79000.00, 'Mutual Fund SIP - HDFC', 'SIP_002', NOW() - INTERVAL '70 days' FROM accounts WHERE account_number = '2002345671';

INSERT INTO account_statements (account_id, txn_type, amount, balance_after, description, reference_id, txn_date)
SELECT id, 'CREDIT', 35000.00, 114000.00, 'Salary Credit - Infosys', 'SAL_DEC_002', NOW() - INTERVAL '60 days' FROM accounts WHERE account_number = '2002345671';

INSERT INTO account_statements (account_id, txn_type, amount, balance_after, description, reference_id, txn_date)
SELECT id, 'DEBIT', 45000.00, 69000.00, 'Gold Purchase - Tanishq', 'GOLD_001', NOW() - INTERVAL '45 days' FROM accounts WHERE account_number = '2002345671';

INSERT INTO account_statements (account_id, txn_type, amount, balance_after, description, reference_id, txn_date)
SELECT id, 'CREDIT', 35000.00, 104000.00, 'Salary Credit - Infosys', 'SAL_JAN_002', NOW() - INTERVAL '30 days' FROM accounts WHERE account_number = '2002345671';

INSERT INTO account_statements (account_id, txn_type, amount, balance_after, description, reference_id, txn_date)
SELECT id, 'DEBIT', 8000.00, 96000.00, 'Mutual Fund SIP - HDFC', 'SIP_003', NOW() - INTERVAL '25 days' FROM accounts WHERE account_number = '2002345671';

INSERT INTO account_statements (account_id, txn_type, amount, balance_after, description, reference_id, txn_date)
SELECT id, 'DEBIT', 18000.00, 78000.00, 'Credit Card Bill Payment', 'CC_BILL_001', NOW() - INTERVAL '15 days' FROM accounts WHERE account_number = '2002345671';

INSERT INTO account_statements (account_id, txn_type, amount, balance_after, description, reference_id, txn_date)
SELECT id, 'DEBIT', 35499.25, 42500.75, 'Investment - Zerodha', 'INV_001', NOW() - INTERVAL '3 days' FROM accounts WHERE account_number = '2002345671';

-- Rajesh Kumar - Savings Account (3003456789) Transaction History
INSERT INTO account_statements (account_id, txn_type, amount, balance_after, description, reference_id, txn_date)
SELECT id, 'CREDIT', 200000.00, 200000.00, 'Fixed Deposit Maturity', 'FD_MAT_001', NOW() - INTERVAL '45 days' FROM accounts WHERE account_number = '3003456789';

INSERT INTO account_statements (account_id, txn_type, amount, balance_after, description, reference_id, txn_date)
SELECT id, 'DEBIT', 25000.00, 175000.00, 'Medical Expenses - Apollo', 'MED_001', NOW() - INTERVAL '40 days' FROM accounts WHERE account_number = '3003456789';

INSERT INTO account_statements (account_id, txn_type, amount, balance_after, description, reference_id, txn_date)
SELECT id, 'DEBIT', 12000.00, 163000.00, 'School Fees - DPS', 'EDU_001', NOW() - INTERVAL '30 days' FROM accounts WHERE account_number = '3003456789';

INSERT INTO account_statements (account_id, txn_type, amount, balance_after, description, reference_id, txn_date)
SELECT id, 'CREDIT', 5000.00, 168000.00, 'Interest Credit', 'INT_001', NOW() - INTERVAL '20 days' FROM accounts WHERE account_number = '3003456789';

INSERT INTO account_statements (account_id, txn_type, amount, balance_after, description, reference_id, txn_date)
SELECT id, 'DEBIT', 8500.00, 159500.00, 'Vehicle Insurance Renewal', 'VEH_INS_001', NOW() - INTERVAL '10 days' FROM accounts WHERE account_number = '3003456789';

INSERT INTO account_statements (account_id, txn_type, amount, balance_after, description, reference_id, txn_date)
SELECT id, 'DEBIT', 2719.75, 156780.25, 'Grocery - BigBasket', 'GRO_001', NOW() - INTERVAL '2 days' FROM accounts WHERE account_number = '3003456789';

-- =====================================================
-- CHEQUE BOOK ORDERS
-- =====================================================

INSERT INTO cheque_book_orders (customer_id, account_id, leaves, status, tracking_id, delivery_address, created_at)
SELECT c.id, a.id, 50, 'DELIVERED', 'TRK_CHQ_001', '123 Main Street, Bengaluru - 560001', NOW() - INTERVAL '30 days'
FROM customers c 
JOIN accounts a ON a.customer_id = c.id 
WHERE c.user_id = 'DEMO001' AND a.account_number = '1001234567';

INSERT INTO cheque_book_orders (customer_id, account_id, leaves, status, tracking_id, delivery_address, created_at)
SELECT c.id, a.id, 25, 'DISPATCHED', 'TRK_CHQ_002', '456 Park Avenue, Mumbai - 400001', NOW() - INTERVAL '5 days'
FROM customers c 
JOIN accounts a ON a.customer_id = c.id 
WHERE c.user_id = 'SARAH02' AND a.account_number = '2002345671';

-- =====================================================
-- TRANSACTIONS (Bill Payments, Fund Transfers)
-- =====================================================

INSERT INTO transactions (id, customer_id, account_id, type, amount, status, details, created_at)
SELECT 'TXN_BILL_001', c.id, a.id, 'BILL_PAYMENT', 2800.00, 'SUCCESS', 
       '{"biller": "Adani Electricity", "billNumber": "ELEC2024001", "dueDate": "2026-01-15"}'::jsonb,
       NOW() - INTERVAL '45 days'
FROM customers c 
JOIN accounts a ON a.customer_id = c.id 
WHERE c.user_id = 'DEMO001' AND a.account_number = '1001234567';

INSERT INTO transactions (id, customer_id, account_id, type, amount, status, details, created_at)
SELECT 'TXN_NEFT_001', c.id, a.id, 'FUND_TRANSFER', 25000.00, 'SUCCESS', 
       '{"beneficiary": "Savings Account", "ifsc": "KIOSK0001234", "accountNo": "1001234568", "mode": "NEFT"}'::jsonb,
       NOW() - INTERVAL '20 days'
FROM customers c 
JOIN accounts a ON a.customer_id = c.id 
WHERE c.user_id = 'DEMO001' AND a.account_number = '1001234567';

INSERT INTO transactions (id, customer_id, account_id, type, amount, status, details, created_at)
SELECT 'TXN_IMPS_001', c.id, a.id, 'FUND_TRANSFER', 35150.50, 'SUCCESS', 
       '{"beneficiary": "External Account", "ifsc": "ICIC0001234", "accountNo": "9988776655", "mode": "IMPS"}'::jsonb,
       NOW() - INTERVAL '1 day'
FROM customers c 
JOIN accounts a ON a.customer_id = c.id 
WHERE c.user_id = 'DEMO001' AND a.account_number = '1001234567';

-- =====================================================
-- AUDIT LOGS (Sample entries)
-- =====================================================

INSERT INTO audit_logs (action, actor_type, actor_id, target_type, target_id, details, created_at)
VALUES 
('USER_LOGIN', 'CUSTOMER', 'DEMO001', 'SESSION', 'SES_001', 'Successful login via OTP', NOW() - INTERVAL '1 day'),
('VIEW_STATEMENT', 'CUSTOMER', 'DEMO001', 'ACCOUNT', '1001234567', 'Statement viewed for Jan 2026', NOW() - INTERVAL '23 hours'),
('BILL_PAYMENT', 'CUSTOMER', 'DEMO001', 'TRANSACTION', 'TXN_BILL_001', 'Electricity bill paid', NOW() - INTERVAL '45 days'),
('FUND_TRANSFER', 'CUSTOMER', 'DEMO001', 'TRANSACTION', 'TXN_NEFT_001', 'NEFT transfer completed', NOW() - INTERVAL '20 days'),
('USER_LOGIN', 'CUSTOMER', 'SARAH02', 'SESSION', 'SES_002', 'Successful login via OTP', NOW() - INTERVAL '12 hours'),
('CARD_BLOCK', 'CUSTOMER', 'SARAH02', 'CARD', '2', 'Credit card blocked - Lost', NOW() - INTERVAL '10 days');

SELECT 'Comprehensive seed data created successfully!' as result;
SELECT 'Users: DEMO001 (01/01/1990), SARAH02 (15/06/1985), RAJESH3 (22/11/1978)' as login_info;
