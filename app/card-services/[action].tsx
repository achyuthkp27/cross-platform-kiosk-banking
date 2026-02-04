import React, { useEffect, useState } from 'react';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Box, Typography } from '@mui/material';
import KioskPage from '../../src/components/KioskPage';
import PinChangeForm from '../../src/components/card-services/PinChangeForm';
import BlockCardFlow from '../../src/components/card-services/BlockCardFlow';
import ReplaceCardFlow from '../../src/components/card-services/ReplaceCardFlow';
import { useCardServices } from '../../src/hooks/useCardServices';
import { useToast } from '../../src/context/ToastContext';
import SuccessState from '../../src/components/SuccessState';

export default function CardActionPage() {
    const { action, cardId } = useLocalSearchParams();
    const router = useRouter();
    const { cards, toggleCardStatus, updatePin, requestReplacement, loading } = useCardServices();
    const { showSuccess, showError } = useToast();
    const [isSuccess, setIsSuccess] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');

    const card = cards.find(c => c.id === cardId);

    // Redirect if invalid access
    useEffect(() => {
        if (!card && !loading) {
            router.replace('/card-services');
        }
    }, [card, loading, router]);

    if (!card) return null;

    const handleBack = () => {
        router.back();
    };

    const handleCompletion = () => {
        setIsSuccess(true);
    };

    const handlePinChange = async (newPin: string) => {
        try {
            await updatePin(card.id);
            setSuccessMessage('PIN Updated Successfully');
            showSuccess('PIN updated');
            handleCompletion();
        } catch (err) {
            showError('Failed to update PIN');
        }
    };

    const handleBlockAction = async (reason?: string) => {
        try {
            await toggleCardStatus(card.id);
            const isBlocking = card.status !== 'BLOCKED';
            setSuccessMessage(isBlocking ? 'Card Blocked Successfully' : 'Card Unblocked Successfully');
            showSuccess(isBlocking ? 'Card blocked' : 'Card unblocked');
            handleCompletion();
        } catch (err) {
            showError('Failed to update card status');
        }
    };

    const handleReplacement = async () => {
        try {
            await requestReplacement(card.id);
            setSuccessMessage('Replacement Request Submitted');
            showSuccess('Request submitted');
            handleCompletion();
        } catch (err) {
            showError('Failed to request replacement');
        }
    };

    if (isSuccess) {
        return (
            <KioskPage>
                <SuccessState
                    message={successMessage}
                    subMessage="You will be redirected shortly..."
                    onHome={() => router.replace('/card-services')}
                />
            </KioskPage>
        );
    }

    const renderContent = () => {
        switch (action) {
            case 'pin':
                return (
                    <PinChangeForm
                        onCancel={handleBack}
                        onComplete={handlePinChange}
                        loading={loading}
                    />
                );
            case 'block':
                return (
                    <BlockCardFlow
                        isBlocked={card.status === 'BLOCKED'}
                        onCancel={handleBack}
                        onConfirm={handleBlockAction}
                        loading={loading}
                    />
                );
            case 'replace':
                return (
                    <ReplaceCardFlow
                        onCancel={handleBack}
                        onConfirm={handleReplacement}
                        loading={loading}
                    />
                );
            default:
                return (
                    <Box sx={{ textAlign: 'center' }}>
                        <Typography color="error">Invalid Action</Typography>
                    </Box>
                );
        }
    };

    return (
        <KioskPage>
            {renderContent()}
        </KioskPage>
    );
}
