import { IFundTransferService } from '../../types/serviceInterfaces';
import { ApiResponse, TransferRecipient, TransferResult } from '../../types/services';
import { apiClient } from '../apiClient';

export const fundTransferApi: IFundTransferService = {
    async validateRecipient(accountNumber: string, ifsc: string): Promise<ApiResponse<{ valid: boolean; name?: string }>> {
        return apiClient.post('/fund-transfer/validate', { accountNumber, ifsc });
    },

    async processTransfer(recipient: TransferRecipient, amount: number, fromAccount: string, idempotencyKey?: string): Promise<ApiResponse<TransferResult>> {
        const finalKey = idempotencyKey || (typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : `req_${Date.now()}_${Math.random()}`);
        return apiClient.request('/fund-transfer/process', {
            method: 'POST',
            body: JSON.stringify({
                beneficiaryName: recipient.name,
                accountNumber: recipient.accountNumber,
                ifsc: recipient.ifsc,
                amount: amount,
                fromAccount: fromAccount
            }),
            // @ts-ignore - Custom property handled by ApiClient
            idempotencyKey: finalKey
        });
    },

    async getBeneficiaries(): Promise<ApiResponse<{ id: string; name: string; account: string; ifsc: string }[]>> {
        return apiClient.get('/fund-transfer/beneficiaries');
    },

    async addBeneficiary(name: string, account: string, ifsc: string): Promise<ApiResponse<{ id: string; name: string; account: string; ifsc: string }>> {
        return apiClient.post('/fund-transfer/beneficiaries', { name, accountNumber: account, ifsc });
    }
};
