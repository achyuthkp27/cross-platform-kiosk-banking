import { IChequeBookService } from '../../types/serviceInterfaces';
import { ApiResponse, ChequeBookRequest, ChequeBookResponse } from '../../types/services';

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const chequeBookMock: IChequeBookService = {
    async requestChequeBook(request: ChequeBookRequest): Promise<ApiResponse<ChequeBookResponse>> {
        await delay(1500);
        
        // Basic validation mock
        if (request.leaves > 100) {
            return {
                success: false,
                message: 'Maximum 100 leaves allowed per request'
            };
        }

        return {
            success: true,
            data: {
                referenceId: `CB${Math.floor(Math.random() * 1000000)}`,
                status: 'REQUESTED',
                deliveryEstimate: '3-5 Business Days'
            }
        };
    }
};
