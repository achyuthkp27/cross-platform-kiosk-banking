import { useState, useCallback, useEffect } from 'react';
import { Card, CardStatus } from '../types/card';
import { cardService } from '../services';

export const useCardServices = (customerId: string = 'current-user') => {
    const [cards, setCards] = useState<Card[]>([]);
    const [selectedCard, setSelectedCard] = useState<Card | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchCards = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await cardService.getCards(customerId);
            if (response.success && response.data) {
                setCards(response.data);
                // Select first card by default if none selected
                if (!selectedCard && response.data.length > 0) {
                    setSelectedCard(response.data[0]);
                }
            } else {
                setError(response.message || 'Failed to fetch cards');
            }
        } catch (e) {
             setError('Failed to fetch cards');
             console.error(e);
        } finally {
            setLoading(false);
        }
    }, [customerId, selectedCard]);

    // Initial load
    useEffect(() => {
        fetchCards();
    }, [fetchCards]);

    const toggleCardStatus = useCallback(async (cardIdInput: string | number, reason?: string) => {
        setLoading(true);
        setError(null);
        
        const cardId = Number(cardIdInput);

        try {
            const card = cards.find(c => c.id === cardId);
            if (!card) throw new Error('Card not found');

            const isBlocking = card.status === 'ACTIVE';
            let success = false;

            // Important: Service methods now return ApiResponse
            if (isBlocking) {
                const res = await cardService.blockCard(cardId, reason || 'User Request');
                success = res.success;
            } else {
                 const res = await cardService.unblockCard(cardId);
                 success = res.success;
            }

            if (success) {
                 // Refresh or Optimistic Update
                 // Doing optimistic update here for standard behavior, ideally fetchCards()
                 setCards(prevCards => prevCards.map(c => {
                    if (c.id === cardId) {
                        const newStatus: CardStatus = isBlocking ? 'BLOCKED' : 'ACTIVE';
                        if (selectedCard?.id === cardId) {
                            setSelectedCard({ ...c, status: newStatus });
                        }
                        return { ...c, status: newStatus };
                    }
                    return c;
                }));
            } else {
                setError('Operation failed');
            }
        } catch (e) {
            setError('Failed to update card status');
            console.error(e);
        } finally {
            setLoading(false);
        }
    }, [cards, selectedCard]);

    const updatePin = useCallback(async (cardIdInput: string | number, newPin: string) => {
         // Placeholder: Ideally this should call cardService.changePin if that existed.
         // For now, retaining a brief simulation delay to match UI expectations
         // as this method isn't in ICardService yet.
         return new Promise<void>((resolve) => {
            setTimeout(() => {
                setLoading(false);
                resolve();
            }, 1000);
        });
    }, []);

    const requestReplacement = useCallback(async (cardIdInput: string | number) => {
        setLoading(true);
        const cardId = Number(cardIdInput);
        try {
            const res = await cardService.replaceCard(cardId, 'Damaged', 'Default Address');
             if (!res.success) {
                 setError(res.message || 'Failed to request replacement');
             }
        } catch (e) {
            setError('Failed to request replacement');
        } finally {
            setLoading(false);
        }
    }, []);

    return {
        cards,
        selectedCard,
        setSelectedCard,
        toggleCardStatus,
        updatePin,
        requestReplacement,
        loading,
        error,
        fetchCards
    };
};
