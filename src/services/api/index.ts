/**
 * Real API implementations - barrel export
 */

export { authApi } from './authApi';
export { otpApi } from './otpApi';
export { configApi } from './configApi';
export { auditApi } from './auditApi';

// Re-export new real API implementations
export { billPaymentApi } from './billPaymentApi';
export { fundTransferApi } from './fundTransferApi';
export { cardApi } from './cardApi';
export { chequeBookApi } from './chequeBookApi';

// Account service - to be implemented
import { IAccountService } from '../../types/serviceInterfaces';
import { ApiResponse, Account, AccountStatement } from '../../types/services';
import { apiClient } from '../apiClient';

export const accountApi: IAccountService = {
    async getAccounts(customerId: string): Promise<ApiResponse<Account[]>> {
        // Use path parameter instead of query string for production safety
        // Note: customerId arg is ignored in REAL mode as backend extracts user from token
        return apiClient.get(`/accounts`);
    },

    async getBalance(accountId: number): Promise<ApiResponse<{ balance: number; available: number }>> {
        return apiClient.get(`/accounts/${accountId}/balance`);
    },

    async getStatement(accountId: number, startDate?: string, endDate?: string): Promise<ApiResponse<AccountStatement[]>> {
        let url = `/accounts/${accountId}/statement`;
        if (startDate) url += `?startDate=${startDate}`;
        if (endDate) url += `&endDate=${endDate}`;
        return apiClient.get(url);
    }
};


