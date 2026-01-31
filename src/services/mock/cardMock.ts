/**
 * Mock implementation for Card Service
 */

import { ICardService } from '../../types/serviceInterfaces';
import { ApiResponse, Card } from '../../types/services';
import { MOCK_CARDS, delay, generateMockRefId } from './mockData';

export const cardMock: ICardService = {
    async getCards(customerId: string): Promise<ApiResponse<Card[]>> {
        await delay(500);

        const cards = MOCK_CARDS[customerId] || [];

        return {
            success: true,
            data: cards
        };
    },

    async blockCard(cardId: number, reason: string): Promise<ApiResponse<{ referenceId: string }>> {
        await delay(1000);

        console.log(`[MOCK] Blocking card ${cardId}: ${reason}`);

        return {
            success: true,
            message: 'Card blocked successfully',
            data: {
                referenceId: generateMockRefId()
            }
        };
    },

    async unblockCard(cardId: number): Promise<ApiResponse<void>> {
        await delay(1000);

        console.log(`[MOCK] Unblocking card ${cardId}`);

        return {
            success: true,
            message: 'Card unblocked successfully'
        };
    },

    async replaceCard(cardId: number, reason: string, address: string): Promise<ApiResponse<{ referenceId: string; deliveryEstimate: string }>> {
        await delay(1500);

        console.log(`[MOCK] Requesting replacement for card ${cardId}: ${reason}`);

        return {
            success: true,
            message: 'Replacement card requested',
            data: {
                referenceId: generateMockRefId(),
                deliveryEstimate: '5-7 business days'
            }
        };
    },

    async requestNewCard(accountId: number, type: string): Promise<ApiResponse<Card>> {
        await delay(1000);
        
        return {
            success: true,
            message: 'Card requested successfully',
            data: {
                id: Math.floor(Math.random() * 10000),
                number: '4' + Math.random().toString().slice(2, 17),
                holderName: 'DEMO USER',
                expiryDate: '12/30',
                cvv: '123',
                type: type as 'DEBIT' | 'CREDIT',
                network: 'VISA',
                status: 'ACTIVE',
            }
        };
    }
};
