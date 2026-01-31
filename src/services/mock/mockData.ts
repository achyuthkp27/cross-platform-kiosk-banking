/**
 * Centralized mock data store.
 * All mock services should use this data to ensure consistency.
 */

import { CustomerProfile, Account, Card, KioskConfig, FeatureFlags, AccountStatement } from '../../types/services';

// =====================================================
// MOCK CUSTOMERS
// =====================================================

export const MOCK_CUSTOMERS: Record<string, CustomerProfile & { dobHash: string; pinHash: string }> = {
    'DEMO001': {
        userId: 'DEMO001',
        name: 'John Demo',
        mobileNumber: '9876543210',
        email: 'john.demo@example.com',
        languagePref: 'en',
        themePref: 'light',
        dobHash: '01/01/1990', // Plain for mock comparison
        pinHash: '1234'
    },
    'TEST001': {
        userId: 'TEST001',
        name: 'Test User',
        mobileNumber: '9876543211',
        email: 'test@example.com',
        languagePref: 'en',
        themePref: 'dark',
        dobHash: '15/08/1985',
        pinHash: '4321'
    }
};

// =====================================================
// MOCK ACCOUNTS
// =====================================================

export const MOCK_ACCOUNTS: Record<string, Account[]> = {
    'DEMO001': [
        {
            id: 1,
            accountNumber: '1000000001',
            ifscCode: 'KIOSK0001234',
            balance: 50000.00,
            availableBalance: 48500.00,
            type: 'SAVINGS',
            status: 'ACTIVE'
        },
        {
            id: 2,
            accountNumber: '2000000001',
            ifscCode: 'KIOSK0001234',
            balance: 125000.00,
            availableBalance: 125000.00,
            type: 'CURRENT',
            status: 'ACTIVE'
        }
    ],
    'TEST001': [
        {
            id: 3,
            accountNumber: '5555555555',
            ifscCode: 'KIOSK0001234',
            balance: 10000.00,
            availableBalance: 10000.00,
            type: 'SAVINGS',
            status: 'ACTIVE'
        }
    ]
};

// =====================================================
// MOCK CARDS
// =====================================================

export const MOCK_CARDS: Record<string, Card[]> = {
    'DEMO001': [
        {
            id: 1,
            number: '4532789012348890',
            type: 'DEBIT',
            network: 'VISA',
            expiryDate: '12/28',
            status: 'ACTIVE',
            holderName: 'John Demo',
            balance: 24500.50,
            color: '#1A1F71' // Visa Blue
        },
        {
            id: 2,
            number: '5412789012343456',
            type: 'CREDIT',
            network: 'MASTERCARD',
            expiryDate: '09/27',
            status: 'ACTIVE',
            holderName: 'John Demo',
            limit: 150000,
            used: 45200,
            color: '#222222' // Premium Black
        }
    ],
    'TEST001': [
        {
            id: 3,
            number: '6521 **** **** 9876',
            type: 'DEBIT',
            network: 'RUPAY',
            expiryDate: '03/26',
            status: 'ACTIVE',
            holderName: 'Test User',
            balance: 5000.00,
            color: '#C4262E' // RuPay Red
        }
    ]
};

// =====================================================
// MOCK CONFIGURATION
// =====================================================

export const MOCK_CONFIG: KioskConfig = {
    session_timeout_seconds: 300,
    otp_expiry_seconds: 300,
    otp_max_attempts: 3,
    pin_max_attempts: 3,
    idle_reset_seconds: 60
};

export const MOCK_FEATURES: FeatureFlags = {
    fundTransfer: true,
    billPayment: true,
    chequeBook: true,
    cardServices: true
};

// =====================================================
// MOCK BILLERS
// =====================================================

export const MOCK_BILLERS: Record<string, string[]> = {
    electricity: ['Adani Electricity', 'Tata Power', 'BESCOM'],
    water: ['BWSSB', 'Delhi Jal Board'],
    gas: ['Indane Gas', 'HP Gas', 'Bharat Gas'],
    internet: ['JioFiber', 'Airtel Xstream', 'ACT Fibernet'],
    dth: ['Tata Play', 'Airtel Digital TV', 'Dish TV']
};

// =====================================================
// MOCK OTP STORE (runtime only)
// =====================================================

export const MOCK_OTP_STORE: Map<string, { code: string; expiresAt: number; attempts: number }> = new Map();

// =====================================================
// HELPER FUNCTIONS
// =====================================================

export const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const generateMockTxnId = () => `TXN-${Date.now()}-${Math.random().toString(36).substr(2, 6).toUpperCase()}`;

export const generateMockRefId = () => `REF-${Date.now().toString(36).toUpperCase()}`;
