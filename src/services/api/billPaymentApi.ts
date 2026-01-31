import { IBillPaymentService } from '../../types/serviceInterfaces';
import { ApiResponse, BillDetails } from '../../types/services';
import { apiClient } from '../apiClient';

export const billPaymentApi: IBillPaymentService = {
    async getBillers(category: string): Promise<ApiResponse<string[]>> {
        return apiClient.get(`/bills/billers?category=${category}`);
    },

    async fetchBill(billerId: string, consumerNo: string): Promise<ApiResponse<BillDetails>> {
        return apiClient.post('/bills/fetch', { billerId, consumerNo });
    },

    async payBill(details: { billNo: string; amount: number; paymentMethod: string; fromAccount: string }): Promise<ApiResponse<{ txnId: string }>> {
        return apiClient.post('/bills/pay', details);
    }
};
