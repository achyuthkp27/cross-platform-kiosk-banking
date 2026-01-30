import React from 'react';
import { Box } from '@mui/material';
import { Card } from '../../types/card';
import CardVisual from './CardVisual';

interface CardCarouselProps {
    cards: Card[];
    selectedCard: Card | null;
    onSelect: (card: Card) => void;
}

const CardCarousel: React.FC<CardCarouselProps> = ({ cards, selectedCard, onSelect }) => {
    return (
        <Box
            sx={{
                display: 'flex',
                overflowX: 'auto',
                overflowY: 'hidden',
                py: 4,
                px: 2,
                gap: 2,
                scrollBehavior: 'smooth',
                width: '100%',
                justifyContent: cards.length < 3 ? 'center' : 'flex-start',
                '::-webkit-scrollbar': { display: 'none' }, // Hide scrollbar for cleaner look
                msOverflowStyle: 'none',  // IE and Edge
                scrollbarWidth: 'none',  // Firefox
                maskImage: 'linear-gradient(to right, transparent, black 10%, black 90%, transparent)',
            }}
        >
            {cards.map((card) => (
                <CardVisual
                    key={card.id}
                    card={card}
                    isSelected={selectedCard?.id === card.id}
                    onClick={() => onSelect(card)}
                />
            ))}
        </Box>
    );
};

export default CardCarousel;
