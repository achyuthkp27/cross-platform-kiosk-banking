/**
 * Shared TypeScript types for API services.
 * Both real API and mock services must use these exact types.
 */

// =====================================================
// COMMON TYPES
// =====================================================

export interface ApiResponse<T> {
    success: boolean;
    message?: string;
    data?: T;
    token?: string;
    refreshToken?: string;
}

// =====================================================
// AUTH TYPES
// =====================================================

export interface LoginRequest {
    userId: string;
    dob: string; // DD/MM/YYYY format
}

export interface LoginResponse {
    userId: string;
    name: string;
    languagePref: string;
    themePref: string;
}

export interface CustomerProfile {
    userId: string;
    name: string;
    mobileNumber?: string;
    email?: string;
    languagePref: string;
    themePref: string;
}

// =====================================================
// OTP TYPES
// =====================================================

export interface OtpGenerateRequest {
    identifier: string;
    purpose?: 'LOGIN' | 'TRANSACTION' | 'PIN_CHANGE';
}

export interface OtpValidateRequest {
    identifier: string;
    code: string;
}

export interface OtpValidateResponse {
    valid: boolean;
    message: string;
}

// =====================================================
// CONFIG TYPES
// =====================================================

export interface KioskConfig {
    session_timeout_seconds: number;
    otp_expiry_seconds: number;
    otp_max_attempts: number;
    pin_max_attempts: number;
    idle_reset_seconds: number;
}

export interface FeatureFlags {
    fundTransfer: boolean;
    billPayment: boolean;
    chequeBook: boolean;
    cardServices: boolean;
}

// =====================================================
// ACCOUNT TYPES
// =====================================================

export interface Account {
    id: number;
    accountNumber: string;
    ifscCode: string;
    balance: number;
    availableBalance: number;
    type: 'Savings' | 'Current' | 'FD' | string;
    status: 'ACTIVE' | 'FROZEN' | 'CLOSED';
}

export interface AccountStatement {
    id: number;
    txnType: 'CREDIT' | 'DEBIT';
    amount: number;
    balanceAfter: number;
    description: string;
    referenceId: string;
    txnDate: string;
}

// =====================================================
// CARD TYPES
// =====================================================

// Reusing the richer UI type definition for Card or aligning them?
// The UI type has balance, limit, color, etc.
// The Service type had minimal fields.
// Let's migrate the Service type to support the fields needed by the UI.

export interface Card {
    id: number; // Back to number to match backend/mockData
    number: string; // Changed from cardNumberMasked
    holderName?: string; // Optional if backend doesn't send it immediately
    expiryDate: string; // MM/YY
    cvv?: string; // Often not sent for security
    type: 'DEBIT' | 'CREDIT'; // Changed from cardType
    network: 'VISA' | 'MASTERCARD' | 'RUPAY'; // Changed from cardNetwork
    status: 'ACTIVE' | 'BLOCKED' | 'FROZEN'; // Added FROZEN
    balance?: number; // For Debit
    limit?: number;   // For Credit
    used?: number;    // For Credit
    color?: string;    // Visually distinct color for UI
}

// =====================================================
// TRANSACTION TYPES
// =====================================================

export interface TransferRecipient {
    name: string;
    accountNumber: string;
    ifsc: string;
    bankName?: string;
}

export interface TransferResult {
    txnId: string;
    status: 'SUCCESS' | 'FAILED' | 'PENDING';
}

export interface BillDetails {
    amount: number;
    dueDate: string;
    name: string;
    billNo: string;
}

// =====================================================
// AUDIT TYPES
// =====================================================

export interface AuditLogEntry {
    id: number;
    action: string;
    actorType: 'CUSTOMER' | 'ADMIN' | 'SYSTEM';
    actorId?: string;
    targetType?: string;
    targetId?: string;
    details?: string;
    timestamp: string;
}

export interface AuditLogRequest {
    action: string;
    actorType?: 'CUSTOMER' | 'ADMIN' | 'SYSTEM';
    actorId?: string;
    targetType?: string;
    targetId?: string;
    details?: string;
}

// =====================================================
// CHEQUE BOOK TYPES
// =====================================================

export interface ChequeBookRequest {
    accountId: string; // or number, aligning with Account.id which is number
    leaves: number;
    deliveryAddress: {
        line1: string;
        line2: string;
        city: string;
        pin: string;
    };
    chargeAmount?: number; // Processing fee to debit from account
}

export interface ChequeBookResponse {
    referenceId: string;
    status: 'REQUESTED';
    deliveryEstimate: string;
}
