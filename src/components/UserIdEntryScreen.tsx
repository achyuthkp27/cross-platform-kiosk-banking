import React, { useState } from 'react';
import { Typography } from '@mui/material';
import { useLanguage } from '../context/LanguageContext';
import KioskPage from './KioskPage';
import KioskTextField from './KioskTextField';
import ActionButtons from './ActionButtons';

export interface UserIdEntryScreenProps {
    /** Main title displayed at the top */
    title?: string;
    /** Subtitle/description text */
    subtitle?: string;
    /** Called when user proceeds with valid User ID */
    onNext: (userId: string) => void;
    /** Called when back/cancel button is pressed */
    onBack?: () => void;
    /** Text for the primary button */
    primaryButtonText?: string;
    /** Text for the secondary/back button */
    secondaryButtonText?: string;
    /** Placeholder text for the input */
    placeholder?: string;
    /** Label for the input field */
    inputLabel?: string;
    /** Max width for the page */
    maxWidth?: number;
    /** Custom validation function - return error message or empty string */
    validate?: (userId: string) => string;
}

/**
 * A unified User ID entry screen component.
 * Handles User ID input, validation, and navigation.
 * Use this component to ensure consistent User ID entry across all flows.
 */
export default function UserIdEntryScreen({
    title,
    subtitle,
    onNext,
    onBack,
    primaryButtonText,
    secondaryButtonText,
    placeholder,
    inputLabel,
    maxWidth = 500,
    validate
}: UserIdEntryScreenProps) {
    const { t } = useLanguage();
    const [userId, setUserId] = useState('');
    const [error, setError] = useState('');

    // Resolved text values with translations
    const resolvedTitle = title || t('auth.verify_identity') || 'Security Check';
    const resolvedSubtitle = subtitle || t('auth.verify_subtitle') || 'Please confirm your User ID to proceed.';
    const resolvedPrimaryText = primaryButtonText || t('common.next') || 'Next';
    const resolvedSecondaryText = secondaryButtonText || t('common.cancel') || 'Cancel';
    const resolvedInputLabel = inputLabel || t('auth.user_id') || 'User ID';

    const handleNext = () => {
        const trimmedUserId = userId.trim();

        if (!trimmedUserId) {
            setError(t('auth.user_id_required') || 'User ID is required');
            return;
        }

        // Run custom validation if provided
        if (validate) {
            const validationError = validate(trimmedUserId);
            if (validationError) {
                setError(validationError);
                return;
            }
        }

        onNext(trimmedUserId);
    };

    return (
        <KioskPage maxWidth={maxWidth}>
            <Typography variant="h4" gutterBottom color="primary" sx={{ fontWeight: 'bold' }}>
                {resolvedTitle}
            </Typography>
            <Typography variant="body1" sx={{ mb: 4, color: 'text.secondary' }}>
                {resolvedSubtitle}
            </Typography>

            <KioskTextField
                fullWidth
                label={resolvedInputLabel}
                variant="outlined"
                margin="normal"
                value={userId}
                onChange={(e) => {
                    setUserId(e.target.value);
                    setError('');
                }}
                error={!!error}
                helperText={error}
                placeholder={placeholder}
                InputProps={{
                    style: { fontSize: '1.2rem' }
                }}
                sx={{ mb: 4 }}
            />

            <ActionButtons
                onPrimary={handleNext}
                onSecondary={onBack}
                primaryText={resolvedPrimaryText}
                secondaryText={resolvedSecondaryText}
                primaryDisabled={!userId.trim()}
            />
        </KioskPage>
    );
}
