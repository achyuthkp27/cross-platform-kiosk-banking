-- Initial Schema Script
-- Run this to initialize the database tables

-- =====================================================
-- LEGACY TABLES (kept for compatibility)
-- =====================================================

CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =====================================================
-- CUSTOMER AUTHENTICATION
-- =====================================================

CREATE TABLE IF NOT EXISTS customers (
    id SERIAL PRIMARY KEY,
    user_id VARCHAR(20) UNIQUE NOT NULL,  -- Customer's banking user ID
    dob_hash VARCHAR(255) NOT NULL,        -- Hashed DOB for login validation
    pin_hash VARCHAR(255),                 -- Hashed PIN for transactions
    mobile_number VARCHAR(15),
    email VARCHAR(100),
    name VARCHAR(100) NOT NULL,
    language_pref VARCHAR(10) DEFAULT 'en',
    theme_pref VARCHAR(10) DEFAULT 'light',
    status VARCHAR(20) DEFAULT 'ACTIVE',   -- ACTIVE, BLOCKED, DORMANT
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS customer_cards (
    id SERIAL PRIMARY KEY,
    customer_id INTEGER REFERENCES customers(id) ON DELETE CASCADE,
    card_number_masked VARCHAR(20) NOT NULL,  -- e.g., **** **** **** 1234
    card_type VARCHAR(20) NOT NULL,           -- DEBIT, CREDIT
    card_network VARCHAR(20) DEFAULT 'VISA',  -- VISA, MASTERCARD, RUPAY
    expiry_date VARCHAR(7),                   -- MM/YYYY
    status VARCHAR(20) DEFAULT 'ACTIVE',      -- ACTIVE, BLOCKED, EXPIRED
    blocked_reason VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =====================================================
-- ACCOUNTS & TRANSACTIONS
-- =====================================================

CREATE TABLE IF NOT EXISTS accounts (
    id SERIAL PRIMARY KEY,
    customer_id INTEGER REFERENCES customers(id) ON DELETE CASCADE,
    account_number VARCHAR(20) UNIQUE NOT NULL,
    ifsc_code VARCHAR(15) DEFAULT 'KIOSK0001234',
    balance DECIMAL(15, 2) DEFAULT 0.00,
    available_balance DECIMAL(15, 2) DEFAULT 0.00,
    type VARCHAR(20) NOT NULL,             -- SAVINGS, CURRENT, FD
    status VARCHAR(20) DEFAULT 'ACTIVE',   -- ACTIVE, FROZEN, CLOSED
    last_activity TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS account_statements (
    id SERIAL PRIMARY KEY,
    account_id INTEGER REFERENCES accounts(id) ON DELETE CASCADE,
    txn_type VARCHAR(20) NOT NULL,         -- CREDIT, DEBIT
    amount DECIMAL(15, 2) NOT NULL,
    balance_after DECIMAL(15, 2) NOT NULL,
    description VARCHAR(255),
    reference_id VARCHAR(50),
    txn_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS transactions (
    id VARCHAR(50) PRIMARY KEY,
    customer_id INTEGER REFERENCES customers(id),
    account_id INTEGER REFERENCES accounts(id),
    type VARCHAR(50) NOT NULL,             -- BILL_PAYMENT, FUND_TRANSFER, CHEQUE_ORDER
    amount DECIMAL(15, 2) NOT NULL,
    status VARCHAR(20) NOT NULL,           -- SUCCESS, FAILED, PENDING
    details JSONB,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS billers (
    id VARCHAR(50) PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    category VARCHAR(50) NOT NULL,
    icon_url VARCHAR(255),
    is_active BOOLEAN DEFAULT true
);

CREATE TABLE IF NOT EXISTS cheque_book_orders (
    id SERIAL PRIMARY KEY,
    customer_id INTEGER REFERENCES customers(id),
    account_id INTEGER REFERENCES accounts(id),
    leaves INTEGER NOT NULL DEFAULT 25,    -- 25, 50, 100
    status VARCHAR(20) DEFAULT 'PENDING',  -- PENDING, DISPATCHED, DELIVERED
    tracking_id VARCHAR(50),
    delivery_address TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =====================================================
-- OTP MANAGEMENT
-- =====================================================

CREATE TABLE IF NOT EXISTS otp_records (
    id SERIAL PRIMARY KEY,
    identifier VARCHAR(100) NOT NULL,      -- user_id, card_id, or mobile
    code_hash VARCHAR(255) NOT NULL,       -- Hashed OTP for security
    purpose VARCHAR(50) DEFAULT 'LOGIN',   -- LOGIN, TRANSACTION, PIN_CHANGE
    attempts INTEGER DEFAULT 0,
    max_attempts INTEGER DEFAULT 3,
    expires_at TIMESTAMP NOT NULL,
    validated BOOLEAN DEFAULT false,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_otp_identifier ON otp_records(identifier);
CREATE INDEX IF NOT EXISTS idx_otp_expires ON otp_records(expires_at);

-- =====================================================
-- ADMIN & CONFIGURATION
-- =====================================================

CREATE TABLE IF NOT EXISTS admin_users (
    id SERIAL PRIMARY KEY,
    admin_id VARCHAR(20) UNIQUE NOT NULL,
    pin_hash VARCHAR(255) NOT NULL,
    name VARCHAR(100) NOT NULL,
    role VARCHAR(20) DEFAULT 'OPERATOR',   -- OPERATOR, SUPERVISOR, ADMIN
    status VARCHAR(20) DEFAULT 'ACTIVE',
    last_login TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS kiosk_config (
    id SERIAL PRIMARY KEY,
    config_key VARCHAR(50) UNIQUE NOT NULL,
    config_value VARCHAR(255) NOT NULL,
    description VARCHAR(255),
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_by INTEGER REFERENCES admin_users(id)
);

-- =====================================================
-- SESSION & AUDIT
-- =====================================================

CREATE TABLE IF NOT EXISTS sessions (
    id VARCHAR(50) PRIMARY KEY,
    customer_id INTEGER REFERENCES customers(id),
    started_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    expires_at TIMESTAMP NOT NULL,
    last_activity TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    is_active BOOLEAN DEFAULT true,
    ip_address VARCHAR(45),
    device_info VARCHAR(255)
);

CREATE TABLE IF NOT EXISTS audit_logs (
    id SERIAL PRIMARY KEY,
    action VARCHAR(100) NOT NULL,
    actor_type VARCHAR(20) NOT NULL,       -- CUSTOMER, ADMIN, SYSTEM
    actor_id VARCHAR(50),
    target_type VARCHAR(50),               -- ACCOUNT, CARD, TRANSACTION
    target_id VARCHAR(50),
    details TEXT,
    ip_address VARCHAR(45),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_audit_actor ON audit_logs(actor_type, actor_id);
CREATE INDEX IF NOT EXISTS idx_audit_created ON audit_logs(created_at);

-- =====================================================
-- SEED DATA
-- =====================================================

-- Default kiosk configuration
INSERT INTO kiosk_config (config_key, config_value, description) VALUES
('session_timeout_seconds', '300', 'Session timeout in seconds'),
('otp_expiry_seconds', '300', 'OTP validity period in seconds'),
('otp_max_attempts', '3', 'Maximum OTP validation attempts'),
('pin_max_attempts', '3', 'Maximum PIN validation attempts'),
('idle_reset_seconds', '60', 'Idle time before kiosk resets to home'),
('enable_fund_transfer', 'true', 'Enable fund transfer feature'),
('enable_bill_payment', 'true', 'Enable bill payment feature'),
('enable_cheque_book', 'true', 'Enable cheque book ordering'),
('enable_card_services', 'true', 'Enable card management services')
ON CONFLICT (config_key) DO NOTHING;

-- Billers
INSERT INTO billers (id, name, category) VALUES
('biller_elec_1', 'Adani Electricity', 'electricity'),
('biller_elec_2', 'Tata Power', 'electricity'),
('biller_water_1', 'BWSSB', 'water'),
('biller_net_1', 'JioFiber', 'internet'),
('biller_gas_1', 'Indane Gas', 'gas'),
('biller_dth_1', 'Tata Play', 'dth')
ON CONFLICT (id) DO NOTHING;

-- Default admin user (PIN: 1234 -> hashed)
INSERT INTO admin_users (admin_id, pin_hash, name, role) VALUES
('ADMIN001', '$2a$10$dummyhashfordevonly1234', 'System Administrator', 'ADMIN')
ON CONFLICT (admin_id) DO NOTHING;

-- Demo customer (DOB: 01/01/1990, PIN: 1234)
INSERT INTO customers (user_id, dob_hash, pin_hash, name, mobile_number) VALUES
('DEMO001', '$2a$10$dummyhashfordob01011990', '$2a$10$dummyhashforpin1234', 'John Demo', '9876543210')
ON CONFLICT (user_id) DO NOTHING;

-- Demo accounts for demo customer
INSERT INTO accounts (customer_id, account_number, balance, available_balance, type) 
SELECT c.id, '1234567890', 50000.00, 48500.00, 'SAVINGS'
FROM customers c WHERE c.user_id = 'DEMO001'
ON CONFLICT (account_number) DO NOTHING;

INSERT INTO accounts (customer_id, account_number, balance, available_balance, type) 
SELECT c.id, '9876543210', 125000.00, 125000.00, 'CURRENT'
FROM customers c WHERE c.user_id = 'DEMO001'
ON CONFLICT (account_number) DO NOTHING;

-- Demo cards for demo customer
INSERT INTO customer_cards (customer_id, card_number_masked, card_type, card_network, expiry_date)
SELECT c.id, '**** **** **** 4532', 'DEBIT', 'VISA', '12/2028'
FROM customers c WHERE c.user_id = 'DEMO001'
ON CONFLICT DO NOTHING;

INSERT INTO customer_cards (customer_id, card_number_masked, card_type, card_network, expiry_date, status)
SELECT c.id, '**** **** **** 8901', 'CREDIT', 'MASTERCARD', '06/2027', 'ACTIVE'
FROM customers c WHERE c.user_id = 'DEMO001'
ON CONFLICT DO NOTHING;

