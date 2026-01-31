import { IChequeBookService } from '../../types/serviceInterfaces';
import { ApiResponse, ChequeBookRequest, ChequeBookResponse } from '../../types/services';
import { apiClient } from '../apiClient';

export const chequeBookApi: IChequeBookService = {
    async requestChequeBook(request: ChequeBookRequest): Promise<ApiResponse<ChequeBookResponse>> {
        return apiClient.post('/cheque-book/order', request);
    }
};

// Additional API functions for cheque book orders
export const chequeBookOrdersApi = {
    async getOrders(): Promise<ApiResponse<any[]>> {
        return apiClient.get(`/cheque-book/orders`);
    },

    async getOrder(referenceId: string): Promise<ApiResponse<any>> {
        return apiClient.get(`/cheque-book/order/${referenceId}`);
    }
};
