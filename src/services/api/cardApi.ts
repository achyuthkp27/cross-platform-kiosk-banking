import { ICardService } from '../../types/serviceInterfaces';
import { ApiResponse, Card } from '../../types/services';
import { apiClient } from '../apiClient';

export const cardApi: ICardService = {
    async getCards(userId: string): Promise<ApiResponse<Card[]>> {
        // userId arg is ignored in REAL mode
        return apiClient.get(`/cards`);
    },

    async blockCard(cardId: number, reason: string): Promise<ApiResponse<any>> {
        return apiClient.post(`/cards/${cardId}/block`, { reason });
    },

    async unblockCard(cardId: number): Promise<ApiResponse<void>> {
        return apiClient.post(`/cards/${cardId}/unblock`, {});
    },

    async replaceCard(cardId: number, reason: string, address: string): Promise<ApiResponse<{ referenceId: string; deliveryEstimate: string }>> {
        return apiClient.post(`/cards/${cardId}/replace`, { reason, address });
    },

    async requestNewCard(accountId: number, type: string): Promise<ApiResponse<Card>> {
        return apiClient.post(`/cards/request`, { accountId, type });
    }
};
