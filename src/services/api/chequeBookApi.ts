import { IChequeBookService } from '../../types/serviceInterfaces';
import { ApiResponse, ChequeBookRequest, ChequeBookResponse } from '../../types/services';
import { apiClient } from '../apiClient';

export const chequeBookApi: IChequeBookService = {
    async requestChequeBook(request: ChequeBookRequest): Promise<ApiResponse<ChequeBookResponse>> {
        return apiClient.post('/cheque-book/request', request);
    }
};
