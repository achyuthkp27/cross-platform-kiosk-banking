-- Migration 03: Cheque Book Orders and Customer Address
-- Run after 01_schema.sql and 02_seed_statements.sql

-- New table for cheque book orders
CREATE TABLE IF NOT EXISTS cheque_book_orders (
    id BIGSERIAL PRIMARY KEY,
    account_id BIGINT NOT NULL REFERENCES accounts(id),
    user_id VARCHAR(50) NOT NULL,
    leaves INTEGER NOT NULL CHECK (leaves IN (25, 50, 100)),
    charge_amount DECIMAL(10,2) NOT NULL,
    status VARCHAR(20) DEFAULT 'ORDERED' CHECK (status IN ('ORDERED', 'DISPATCHED', 'DELIVERED', 'COMPLETED')),
    reference_id VARCHAR(50) UNIQUE NOT NULL,
    ordered_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    dispatched_at TIMESTAMP,
    delivered_at TIMESTAMP,
    delivery_address_line1 VARCHAR(200),
    delivery_address_line2 VARCHAR(200),
    delivery_city VARCHAR(100),
    delivery_pin VARCHAR(10),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Add address fields to customers table
ALTER TABLE customers ADD COLUMN IF NOT EXISTS address_line1 VARCHAR(200);
ALTER TABLE customers ADD COLUMN IF NOT EXISTS address_line2 VARCHAR(200);
ALTER TABLE customers ADD COLUMN IF NOT EXISTS city VARCHAR(100);
ALTER TABLE customers ADD COLUMN IF NOT EXISTS pin_code VARCHAR(10);

-- Update existing demo customer with sample address
UPDATE customers 
SET address_line1 = '123 Highland Park',
    address_line2 = 'Financial District',
    city = 'Metropolis',
    pin_code = '500081'
WHERE user_id = 'DEMO001';

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS idx_cheque_orders_user ON cheque_book_orders(user_id);
CREATE INDEX IF NOT EXISTS idx_cheque_orders_status ON cheque_book_orders(status);
