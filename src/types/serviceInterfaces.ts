/**
 * Service interface definitions.
 * Both api/* and mock/* implementations must conform to these interfaces.
 */

import {
    ApiResponse,
    LoginRequest,
    LoginResponse,
    CustomerProfile,
    OtpGenerateRequest,
    OtpValidateRequest,
    OtpValidateResponse,
    KioskConfig,
    FeatureFlags,
    Account,
    AccountStatement,
    Card,
    TransferRecipient,
    TransferResult,
    BillDetails,
    AuditLogEntry,
    AuditLogRequest,
    ChequeBookRequest,
    ChequeBookResponse
} from './services';

// =====================================================
// AUTH SERVICE
// =====================================================

export interface IAuthService {
    login(request: LoginRequest): Promise<ApiResponse<LoginResponse>>;
    validatePin(userId: string, pin: string): Promise<ApiResponse<void>>;
    changePin(userId: string, oldPin: string, newPin: string): Promise<ApiResponse<void>>;
    updatePreferences(userId: string, language?: string, theme?: string): Promise<ApiResponse<void>>;
    logout(userId: string): Promise<void>;
    getProfile(userId: string): Promise<ApiResponse<CustomerProfile>>;
}

// =====================================================
// OTP SERVICE
// =====================================================

export interface IOtpService {
    generate(request: OtpGenerateRequest): Promise<ApiResponse<void>>;
    validate(request: OtpValidateRequest): Promise<ApiResponse<OtpValidateResponse>>;
}

// =====================================================
// CONFIG SERVICE
// =====================================================

export interface IConfigService {
    getAll(): Promise<ApiResponse<KioskConfig>>;
    getSessionTimeout(): Promise<number>;
    getOtpConfig(): Promise<{ expirySeconds: number; maxAttempts: number }>;
    getFeatures(): Promise<ApiResponse<FeatureFlags>>;
}

// =====================================================
// ACCOUNT SERVICE
// =====================================================

export interface IAccountService {
    getAccounts(customerId: string): Promise<ApiResponse<Account[]>>;
    getBalance(accountId: number): Promise<ApiResponse<{ balance: number; available: number }>>;
    getStatement(accountId: number, startDate?: string, endDate?: string): Promise<ApiResponse<AccountStatement[]>>;
}

// =====================================================
// CARD SERVICE
// =====================================================

export interface ICardService {
    getCards(customerId: string): Promise<ApiResponse<Card[]>>;
    blockCard(cardId: number, reason: string): Promise<ApiResponse<{ referenceId: string }>>;
    unblockCard(cardId: number): Promise<ApiResponse<void>>;
    replaceCard(cardId: number, reason: string, address: string): Promise<ApiResponse<{ referenceId: string; deliveryEstimate: string }>>;
}

// =====================================================
// FUND TRANSFER SERVICE
// =====================================================

export interface IFundTransferService {
    validateRecipient(accountNumber: string, ifsc: string): Promise<ApiResponse<{ valid: boolean; name?: string }>>;
    processTransfer(recipient: TransferRecipient, amount: number, fromAccount: string): Promise<ApiResponse<TransferResult>>;
}

// =====================================================
// BILL PAYMENT SERVICE
// =====================================================

export interface IBillPaymentService {
    getBillers(category: string): Promise<ApiResponse<string[]>>;
    fetchBill(billerId: string, consumerNo: string): Promise<ApiResponse<BillDetails>>;
    payBill(details: { billNo: string; amount: number; paymentMethod: string; fromAccount: string }): Promise<ApiResponse<{ txnId: string }>>;
}

// =====================================================
// AUDIT SERVICE
// =====================================================

export interface IAuditService {
    log(request: AuditLogRequest): Promise<ApiResponse<{ id: number }>>;
    getLogs(page?: number, size?: number, actorType?: string): Promise<ApiResponse<AuditLogEntry[]>>;
}

// =====================================================
// CHEQUE BOOK SERVICE
// =====================================================

export interface IChequeBookService {
    requestChequeBook(request: ChequeBookRequest): Promise<ApiResponse<ChequeBookResponse>>;
}

// =====================================================
// COMBINED SERVICES EXPORT
// =====================================================

export interface IServices {
    auth: IAuthService;
    otp: IOtpService;
    config: IConfigService;
    account: IAccountService;
    card: ICardService;
    fundTransfer: IFundTransferService;
    billPayment: IBillPaymentService;
    audit: IAuditService;
    chequeBook: IChequeBookService;
}
