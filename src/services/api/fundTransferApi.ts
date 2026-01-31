import { IFundTransferService } from '../../types/serviceInterfaces';
import { ApiResponse, TransferRecipient, TransferResult } from '../../types/services';
import { apiClient } from '../apiClient';

export const fundTransferApi: IFundTransferService = {
    async validateRecipient(accountNumber: string, ifsc: string): Promise<ApiResponse<{ valid: boolean; name?: string }>> {
        return apiClient.post('/transfers/validate-recipient', { accountNumber, ifsc });
    },

    async processTransfer(recipient: TransferRecipient, amount: number, fromAccount: string): Promise<ApiResponse<TransferResult>> {
        return apiClient.post('/transfers/process', { recipient, amount, fromAccount });
    }
};
