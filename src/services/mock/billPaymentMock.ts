/**
 * Mock implementation for Bill Payment Service
 */

import { IBillPaymentService } from '../../types/serviceInterfaces';
import { ApiResponse, BillDetails } from '../../types/services';
import { MOCK_BILLERS, delay, generateMockTxnId } from './mockData';

export const billPaymentMock: IBillPaymentService = {
    async getBillers(category: string): Promise<ApiResponse<string[]>> {
        await delay(500);

        const billers = MOCK_BILLERS[category] || [];

        return {
            success: true,
            data: billers
        };
    },

    async fetchBill(billerId: string, consumerNo: string): Promise<ApiResponse<BillDetails>> {
        await delay(1500);

        if (!billerId || !consumerNo) {
            return {
                success: false,
                message: 'Invalid biller or consumer number'
            };
        }

        // Generate random bill amount between 500 and 5500
        const amount = Math.floor(Math.random() * 5000) + 500;

        return {
            success: true,
            data: {
                amount,
                dueDate: '15/02/2026',
                name: 'John Demo',
                billNo: `B-${Date.now()}`
            }
        };
    },

    async payBill(details: { billNo: string; amount: number; paymentMethod: string }): Promise<ApiResponse<{ txnId: string }>> {
        await delay(2000);

        console.log(`[MOCK] Paying bill ${details.billNo}: ₹${details.amount} via ${details.paymentMethod}`);

        return {
            success: true,
            message: 'Payment successful',
            data: {
                txnId: generateMockTxnId()
            }
        };
    }
};
