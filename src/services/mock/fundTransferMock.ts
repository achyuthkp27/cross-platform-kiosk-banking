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
    },

    async getBeneficiaries(): Promise<ApiResponse<{ id: string; name: string; account: string; ifsc: string }[]>> {
        await delay(500);
        return {
            success: true,
            data: [
                { id: 'ben_1', name: 'John Doe', account: '1234567890', ifsc: 'HDFC0001234' },
                { id: 'ben_2', name: 'Jane Smith', account: '0987654321', ifsc: 'SBIN0001234' },
            ]
        };
    },

    async addBeneficiary(name: string, account: string, ifsc: string): Promise<ApiResponse<{ id: string; name: string; account: string; ifsc: string }>> {
        await delay(1000);
        return {
            success: true,
            message: 'Beneficiary added',
            data: {
                id: `ben_${Date.now()}`,
                name,
                account,
                ifsc
            }
        };
    }
};
