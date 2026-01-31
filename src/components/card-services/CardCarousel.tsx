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
                py: 6,
                px: 4,
                gap: 3,
                scrollBehavior: 'smooth',
                width: '100%',
                scrollSnapType: 'x mandatory',
                justifyContent: cards.length < 3 ? 'center' : 'flex-start',
                '::-webkit-scrollbar': { display: 'none' }, 
                msOverflowStyle: 'none',  
                scrollbarWidth: 'none',
                WebkitOverflowScrolling: 'touch',
                // Remove maskImage as it can interfere with pointer events on some browsers
            }}
        >
            {cards.map((card) => (
                <Box key={card.id} sx={{ scrollSnapAlign: 'center', flexShrink: 0 }}>
                    <CardVisual
                        card={card}
                        isSelected={selectedCard?.id === card.id}
                        onClick={() => {
                            console.log('[DEBUG] Card clicked:', card.id);
                            onSelect(card);
                        }}
                    />
                </Box>
            ))}
        </Box>
    );
};

export default CardCarousel;
