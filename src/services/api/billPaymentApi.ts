import { IBillPaymentService } from '../../types/serviceInterfaces';
import { ApiResponse, BillDetails } from '../../types/services';
import { apiClient } from '../apiClient';

export const billPaymentApi: IBillPaymentService = {
    async getBillers(category: string): Promise<ApiResponse<string[]>> {
        return apiClient.get(`/bill-payment/billers/${category}`);
    },

    async fetchBill(billerId: string, consumerNo: string): Promise<ApiResponse<BillDetails>> {
        return apiClient.post('/bill-payment/fetch', { billerId, consumerNo });
    },

    async payBill(details: { billNo: string; amount: number; paymentMethod: string; fromAccount: string }): Promise<ApiResponse<{ txnId: string }>> {
        return apiClient.post('/bill-payment/pay', details);
    }
};
