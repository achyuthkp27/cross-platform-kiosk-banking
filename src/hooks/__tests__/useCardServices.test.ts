import { renderHook, act } from '@testing-library/react';
import { useCardServices } from '../useCardServices';

jest.useFakeTimers();

describe('useCardServices', () => {
    it('should load initial cards', () => {
        const { result } = renderHook(() => useCardServices());
        expect(result.current.cards.length).toBeGreaterThan(0);
        expect(result.current.selectedCard).toBeDefined();
    });

    it('should select a card', () => {
        const { result } = renderHook(() => useCardServices());
        const secondCard = result.current.cards[1];

        act(() => {
            result.current.setSelectedCard(secondCard);
        });

        expect(result.current.selectedCard?.id).toBe(secondCard.id);
    });

    it('should toggle card status (block/unblock)', async () => {
        const { result } = renderHook(() => useCardServices());
        const cardToToggle = result.current.cards[0]; // Assuming ACTIVE

        // Trigger Block
        let promise: Promise<void>;
        act(() => {
            promise = result.current.toggleCardStatus(cardToToggle.id, 'Lost');
        });

        expect(result.current.loading).toBe(true);

        await act(async () => {
            jest.runAllTimers();
            await promise;
        });

        expect(result.current.loading).toBe(false);
        const updatedCard = result.current.cards.find(c => c.id === cardToToggle.id);
        expect(updatedCard?.status).toBe('BLOCKED');

        // Trigger Unblock
        act(() => {
            promise = result.current.toggleCardStatus(cardToToggle.id);
        });

        await act(async () => {
            jest.runAllTimers();
            await promise;
        });

        const reUpdatedCard = result.current.cards.find(c => c.id === cardToToggle.id);
        expect(reUpdatedCard?.status).toBe('ACTIVE');
    });

    it('should update pin', async () => {
        const { result } = renderHook(() => useCardServices());
        const cardId = result.current.cards[0].id;

        let promise: Promise<void>;
        act(() => {
            promise = result.current.updatePin(cardId, '1234');
        });

        expect(result.current.loading).toBe(true);

        await act(async () => {
            jest.runAllTimers();
            await promise;
        });

        expect(result.current.loading).toBe(false);
    });

    it('should request replacement', async () => {
        const { result } = renderHook(() => useCardServices());
        const cardId = result.current.cards[0].id;

        let promise: Promise<void>;
        act(() => {
            promise = result.current.requestReplacement(cardId);
        });

        expect(result.current.loading).toBe(true);

        await act(async () => {
            jest.runAllTimers();
            await promise;
        });

        expect(result.current.loading).toBe(false);
    });
});
