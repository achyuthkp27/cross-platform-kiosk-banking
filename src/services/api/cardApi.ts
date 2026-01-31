import { ICardService } from '../../types/serviceInterfaces';
import { ApiResponse, Card } from '../../types/services';
import { apiClient } from '../apiClient';

export const cardApi: ICardService = {
    async getCards(customerId: string): Promise<ApiResponse<Card[]>> {
        return apiClient.get(`/cards?customerId=${customerId}`);
    },

    async blockCard(cardId: number, reason: string): Promise<ApiResponse<{ referenceId: string }>> {
        return apiClient.post(`/cards/${cardId}/block`, { reason });
    },

    async unblockCard(cardId: number): Promise<ApiResponse<void>> {
        return apiClient.post(`/cards/${cardId}/unblock`, {});
    },

    async replaceCard(cardId: number, reason: string, address: string): Promise<ApiResponse<{ referenceId: string; deliveryEstimate: string }>> {
        return apiClient.post(`/cards/${cardId}/replace`, { reason, address });
    }
};
