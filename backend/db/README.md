# Database Setup Guide

This guide explains how to set up the PostgreSQL database for the Kiosk Banking application.

## Prerequisites

- PostgreSQL installed (via Homebrew on macOS: `brew install postgresql`)
- PostgreSQL service running

## Step-by-Step Setup

### 1. Start PostgreSQL

```bash
# Start PostgreSQL service
brew services start postgresql

# Verify it's running
pg_isready
# Expected output: /tmp:5432 - accepting connections
```

### 2. Create PostgreSQL Role (if needed)

On macOS, the default PostgreSQL installation may not have a `postgres` user:

```bash
# Create postgres superuser role
createuser -s postgres
```

### 3. Create Database

```bash
# Create the kiosk_db database
createdb -U postgres kiosk_db
```

### 4. Execute Schema Script

```bash
# Navigate to project root
cd /path/to/kiosk

# Run the schema script
psql -U postgres -d kiosk_db -f backend/db/scripts/01_schema.sql
```

### 5. Verify Setup

```bash
# List all tables
psql -U postgres -d kiosk_db -c "\dt"

# Check demo data
psql -U postgres -d kiosk_db -c "SELECT * FROM customers;"
psql -U postgres -d kiosk_db -c "SELECT * FROM accounts;"
```

## Quick Setup (One Command)

Run all steps at once from project root:

```bash
brew services start postgresql && \
createuser -s postgres 2>/dev/null; \
createdb -U postgres kiosk_db 2>/dev/null; \
psql -U postgres -d kiosk_db -f backend/db/scripts/01_schema.sql
```

## Database Schema

The schema creates 13 tables:

| Table | Description |
|-------|-------------|
| `customers` | Customer authentication & profile |
| `customer_cards` | Debit/Credit cards linked to customers |
| `accounts` | Bank accounts (Savings, Current, FD) |
| `account_statements` | Transaction history per account |
| `transactions` | All transaction records |
| `billers` | Bill payment providers |
| `cheque_book_orders` | Cheque book order tracking |
| `otp_records` | OTP management for verification |
| `sessions` | Active customer sessions |
| `audit_logs` | System audit trail |
| `admin_users` | Admin/operator accounts |
| `kiosk_config` | Application configuration |
| `users` | Legacy table (kept for compatibility) |

## Demo Data

The schema seeds the following demo data:

- **Customer**: `DEMO001` / John Demo
  - DOB: 01/01/1990 (hashed)
  - PIN: 1234 (hashed)
  - Mobile: 9876543210

- **Accounts**:
  - Savings: `1234567890` (₹50,000)
  - Current: `9876543210` (₹1,25,000)

- **Cards**:
  - VISA Debit: `**** **** **** 4532`
  - Mastercard Credit: `**** **** **** 8901`

- **Admin**: `ADMIN001` (PIN: 1234)

- **Billers**: Adani Electricity, Tata Power, BWSSB, JioFiber, Indane Gas, Tata Play

## Troubleshooting

### "role postgres does not exist"
```bash
createuser -s postgres
```

### "database kiosk_db already exists"
```bash
# Drop and recreate (WARNING: This deletes all data)
dropdb -U postgres kiosk_db
createdb -U postgres kiosk_db
```

### PostgreSQL not running
```bash
brew services start postgresql
# or
pg_ctl -D /usr/local/var/postgres start
```

## Connection Details

Update `application.properties` if needed:

```properties
spring.datasource.url=jdbc:postgresql://localhost:5432/kiosk_db
spring.datasource.username=postgres
spring.datasource.password=postgres
```
