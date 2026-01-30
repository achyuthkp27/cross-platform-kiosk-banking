import React, { useEffect } from 'react';
import { Box, Typography } from '@mui/material';
import { useRouter } from 'expo-router';
import KioskPage from '../../src/components/KioskPage';
import CardCarousel from '../../src/components/card-services/CardCarousel';
import ActionGrid, { CardAction } from '../../src/components/card-services/ActionGrid';
import { useCardServices } from '../../src/hooks/useCardServices';
import { useThemeContext } from '../../src/context/ThemeContext';
import ActionButtons from '../../src/components/ActionButtons';

export default function CardServicesDashboard() {
    const router = useRouter();
    const { cards, selectedCard, setSelectedCard } = useCardServices();
    const { mode } = useThemeContext();
    const isDark = mode === 'dark';

    const handleAction = (action: CardAction) => {
        if (!selectedCard) return;

        let routeAction = '';
        switch (action) {
            case 'BLOCK':
            case 'UNBLOCK':
                routeAction = 'block';
                break;
            case 'PIN':
                routeAction = 'pin';
                break;
            case 'REPLACE':
                routeAction = 'replace';
                break;
        }

        router.push({
            pathname: `/card-services/${routeAction}`,
            params: { cardId: selectedCard.id }
        });
    };

    return (
        <KioskPage maxWidth={900} noPaper>
            <Box sx={{ mb: 4, textAlign: 'center' }}>
                <Typography variant="h4" fontWeight="bold" gutterBottom>
                    Card Services
                </Typography>
                <Typography variant="h6" color="text.secondary">
                    Manage your debit and credit cards
                </Typography>
            </Box>

            {/* Card Selection */}
            <CardCarousel
                cards={cards}
                selectedCard={selectedCard}
                onSelect={setSelectedCard}
            />

            {/* Actions for Selected Card */}
            {selectedCard && (
                <Box sx={{ mt: 4, px: 2 }}>
                    <ActionGrid
                        card={selectedCard}
                        onAction={handleAction}
                        isDark={isDark}
                    />
                </Box>
            )}

            <Box sx={{ mt: 6, width: '100%', maxWidth: 400, mx: 'auto' }}>
                <ActionButtons
                    primaryText="Back to Dashboard"
                    onPrimary={() => router.push('/dashboard')}
                    fullWidth
                />
            </Box>
        </KioskPage>
    );
}
