/**
 * Mock implementation for Fund Transfer Service
 */

import { IFundTransferService } from '../../types/serviceInterfaces';
import { ApiResponse, TransferRecipient, TransferResult } from '../../types/services';
import { delay, generateMockTxnId } from './mockData';

export const fundTransferMock: IFundTransferService = {
    async validateRecipient(accountNumber: string, ifsc: string): Promise<ApiResponse<{ valid: boolean; name?: string }>> {
        await delay(1000);

        // Mock validation logic
        const valid = accountNumber.length >= 9 && ifsc.length === 11;

        return {
            success: true,
            data: {
                valid,
                name: valid ? 'Mock Beneficiary' : undefined
            }
        };
    },

    async processTransfer(recipient: TransferRecipient, amount: number, fromAccount?: string): Promise<ApiResponse<TransferResult>> {
        await delay(2000);

        console.log(`[MOCK] Transferring ₹${amount} to ${recipient.name} (${recipient.accountNumber})`);

        return {
            success: true,
            message: 'Transfer successful',
            data: {
                txnId: generateMockTxnId(),
                status: 'SUCCESS'
            }
        };
    }
};
