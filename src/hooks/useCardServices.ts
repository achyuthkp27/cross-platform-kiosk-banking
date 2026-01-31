import { useState, useCallback, useEffect } from 'react';
import { Card, CardStatus } from '../types/card';
import { cardService } from '../services';

export const useCardServices = (customerId: string = 'current-user') => {
    const [cards, setCards] = useState<Card[]>([]);
    const [selectedCard, setSelectedCard] = useState<Card | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchCards = useCallback(async () => {
        let activeUserId = customerId;
        if (activeUserId === 'current-user' && typeof window !== 'undefined') {
            const storedId = sessionStorage.getItem('kiosk_userId');
            if (storedId) activeUserId = storedId;
        }

        if (activeUserId === 'current-user' || !activeUserId) {
            console.warn('No userId available for fetching cards');
            return;
        }

        setLoading(true);
        setError(null);
        try {
            const response = await cardService.getCards(activeUserId);
            if (response.success && response.data) {
                // Enrich backend data with UI-only fields if missing
                const enrichedCards = response.data.map(card => {
                    const num = card.number || '';
                    // Format expiry date if it's in YYYY-MM-DD
                    let expiry = card.expiryDate;
                    if (expiry && expiry.includes('-')) {
                        const [y, m] = expiry.split('-');
                        expiry = `${m}/${y.slice(-2)}`;
                    }
                    return {
                        ...card,
                        expiryDate: expiry,
                        holderName: card.holderName || sessionStorage.getItem('userName') || 'Demo User',
                        network: card.network || (num.startsWith('4') ? 'VISA' : 'MASTERCARD'),
                        color: card.color || (String(card.type).toUpperCase() === 'CREDIT' ? '#111827' : '#0369a1') // Darker for credit, Blue for debit
                    };
                });
                
                setCards(enrichedCards);
                // Select first card by default if none selected
                if (!selectedCard && enrichedCards.length > 0) {
                    setSelectedCard(enrichedCards[0]);
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
    }, [customerId]);

    // Initial load
    useEffect(() => {
        fetchCards();
    }, [fetchCards]);

    const toggleCardStatus = useCallback(async (cardIdInput: string | number, reason?: string) => {
        setLoading(true);
        setError(null);
        
        const cardId = Number(cardIdInput);
        console.log('[DEBUG] toggleCardStatus called for cardId:', cardId);

        try {
            const card = cards.find(c => c.id === cardId);
            if (!card) {
                console.error('[DEBUG] Card not found in local state for ID:', cardId);
                throw new Error('Card not found');
            }

            console.log('[DEBUG] Current card status:', card.status);
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

    const requestNewCard = useCallback(async (accountId: number, type: string) => {
        setLoading(true);
        try {
            const res = await cardService.requestNewCard(accountId, type);
            if (res.success) {
                await fetchCards(); // Refresh list to show new card
            } else {
                setError(res.message || 'Failed to request new card');
            }
        } catch (e) {
            setError('Failed to request new card');
        } finally {
            setLoading(false);
        }
    }, [fetchCards]);

    return {
        cards,
        selectedCard,
        setSelectedCard,
        toggleCardStatus,
        updatePin,
        requestReplacement,
        requestNewCard, // Exposed
        loading,
        error,
        fetchCards
    };
};
