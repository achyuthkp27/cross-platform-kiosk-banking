import { useState, useCallback } from 'react';
import { Card, CardStatus } from '../types/card';

const MOCK_CARDS: Card[] = [
    {
        id: 'c1',
        number: '4532 **** **** 8890',
        holderName: 'John Doe',
        expiryDate: '12/28',
        cvv: '123',
        type: 'DEBIT',
        network: 'VISA',
        status: 'ACTIVE',
        balance: 24500.50,
        color: '#1A1F71' // Visa Blue
    },
    {
        id: 'c2',
        number: '5412 **** **** 3456',
        holderName: 'John Doe',
        expiryDate: '09/27',
        cvv: '456',
        type: 'CREDIT',
        network: 'MASTERCARD',
        status: 'ACTIVE',
        limit: 150000,
        used: 45200,
        color: '#222222' // Premium Black
    },
    {
        id: 'c3',
        number: '6521 **** **** 9876',
        holderName: 'John Doe',
        expiryDate: '03/29',
        cvv: '789',
        type: 'CREDIT',
        network: 'RUPAY',
        status: 'BLOCKED',
        limit: 50000,
        used: 0,
        color: '#C4262E' // RuPay brand colorish
    }
];

export const useCardServices = () => {
    const [cards, setCards] = useState<Card[]>(MOCK_CARDS);
    const [selectedCard, setSelectedCard] = useState<Card | null>(MOCK_CARDS[0]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const toggleCardStatus = useCallback(async (cardId: string) => {
        setLoading(true);
        setError(null);

        // Simulate API call
        return new Promise<void>((resolve) => {
            setTimeout(() => {
                setCards(prevCards => prevCards.map(card => {
                    if (card.id === cardId) {
                        const newStatus: CardStatus = card.status === 'ACTIVE' ? 'BLOCKED' : 'ACTIVE';
                        // Update selected card if it's the modified one
                        if (selectedCard?.id === cardId) {
                            setSelectedCard({ ...card, status: newStatus });
                        }
                        return { ...card, status: newStatus };
                    }
                    return card;
                }));
                setLoading(false);
                resolve();
            }, 1500);
        });
    }, [selectedCard]);

    const updatePin = useCallback(async (cardId: string) => {
        setLoading(true);
        setError(null);

        // Simulate API call
        return new Promise<void>((resolve) => {
            setTimeout(() => {
                console.log(`PIN updated for ${cardId}`);
                setLoading(false);
                resolve();
            }, 2000);
        });
    }, []);

    const requestReplacement = useCallback(async (cardId: string) => {
        setLoading(true);
        // Simulate API call
        return new Promise<void>((resolve) => {
            setTimeout(() => {
                console.log(`Replacement requested for ${cardId}`);
                setLoading(false);
                resolve();
            }, 2000);
        });
    }, []);

    return {
        cards,
        selectedCard,
        setSelectedCard,
        toggleCardStatus,
        updatePin,
        requestReplacement,
        loading,
        error
    };
};
