/**
 * RUNTIME DATA MODE SWITCHER
 * 
 * This is the central export for all services.
 * Based on EXPO_PUBLIC_DATA_MODE environment variable, it exports either:
 * - REAL: All services make actual API calls to the backend
 * - MOCK: All services use local mock data, no network calls
 * 
 * IMPORTANT: There is NO fallback from REAL to MOCK. In REAL mode,
 * API failures will result in errors, not mock data.
 */

import { IServices } from '../types/serviceInterfaces';
// Import real API implementations
import { authApi, otpApi, configApi, auditApi, accountApi, cardApi, fundTransferApi, billPaymentApi, chequeBookApi } from './api';

// Import mock implementations
import { authMock, otpMock, configMock, auditMock, accountMock, cardMock, fundTransferMock, billPaymentMock, chequeBookMock } from './mock';

// Data mode from environment variable
const DATA_MODE = process.env.EXPO_PUBLIC_DATA_MODE || 'MOCK';

// Validate mode
if (DATA_MODE !== 'REAL' && DATA_MODE !== 'MOCK') {
    console.error(`[SERVICES] Invalid DATA_MODE: ${DATA_MODE}. Must be 'REAL' or 'MOCK'. Defaulting to MOCK.`);
}

const isRealMode = DATA_MODE === 'REAL';

// Log mode on initialization
console.log(`\n========================================`);
console.log(`  DATA MODE: ${isRealMode ? 'REAL (API)' : 'MOCK (Local)'}`);
console.log(`========================================\n`);

// Create unified services object
// Note: For existing services (card, fundTransfer, billPayment) that have inline
// mock logic in apiClient, we're migrating to the new pattern incrementally.
// The cardMock/fundTransferMock/billPaymentMock are ready and will be used in MOCK mode.

export const services: IServices = {
    auth: isRealMode ? authApi : authMock,
    otp: isRealMode ? otpApi : otpMock,
    config: isRealMode ? configApi : configMock,
    account: isRealMode ? accountApi : accountMock,
    card: isRealMode ? cardApi : cardMock,
    fundTransfer: isRealMode ? fundTransferApi : fundTransferMock,
    billPayment: isRealMode ? billPaymentApi : billPaymentMock,
    audit: isRealMode ? auditApi : auditMock,
    chequeBook: isRealMode ? chequeBookApi : chequeBookMock
};

// Export individual services for direct import
export const authService = services.auth;
export const otpService = services.otp;
export const configService = services.config;
export const accountService = services.account;
export const cardService = services.card;
export const fundTransferService = services.fundTransfer;
export const billPaymentService = services.billPayment;
export const auditService = services.audit;
export const chequeBookService = services.chequeBook;

// Export mode flag for components that need to know
export const isApiMode = isRealMode;
export const DATA_MODE_VALUE = DATA_MODE;

// Export types
export * from '../types/services';
export * from '../types/serviceInterfaces';
