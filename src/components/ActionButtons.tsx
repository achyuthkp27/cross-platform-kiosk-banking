import React from 'react';
import { Button, Box, CircularProgress } from '@mui/material';
import { useLanguage } from '../context/LanguageContext';

export interface ActionButtonsProps {
    /** Callback for primary (right) button */
    onPrimary: () => void;
    /** Callback for secondary (left) button - if not provided, button is hidden */
    onSecondary?: () => void;
    /** Text for primary button - defaults to translation key 'common.next' */
    primaryText?: string;
    /** Text for secondary button - defaults to translation key 'common.back' */
    secondaryText?: string;
    /** Whether primary button is disabled */
    primaryDisabled?: boolean;
    /** Whether secondary button is disabled */
    secondaryDisabled?: boolean;
    /** Show loading spinner on primary button */
    loading?: boolean;
    /** Color for primary button */
    primaryColor?: 'primary' | 'success' | 'error' | 'inherit';
    /** Variant for primary button */
    primaryVariant?: 'contained' | 'outlined' | 'text';
    /** Variant for secondary button */
    secondaryVariant?: 'contained' | 'outlined' | 'text';
    /** Custom styling */
    sx?: object;
}

/**
 * A reusable action buttons component for consistent button layouts across the app.
 * Provides a Back/Cancel button on the left and a primary action button on the right.
 */
export default function ActionButtons({
    onPrimary,
    onSecondary,
    primaryText,
    secondaryText,
    primaryDisabled = false,
    secondaryDisabled = false,
    loading = false,
    primaryColor = 'primary',
    primaryVariant = 'contained',
    secondaryVariant = 'outlined',
    sx = {}
}: ActionButtonsProps) {
    const { t } = useLanguage();

    const resolvedPrimaryText = primaryText || t('common.next');
    const resolvedSecondaryText = secondaryText || t('common.back');

    return (
        <Box sx={{ display: 'flex', gap: 2, ...sx }}>
            {onSecondary && (
                <Button
                    fullWidth
                    variant={secondaryVariant}
                    size="large"
                    onClick={onSecondary}
                    disabled={secondaryDisabled || loading}
                    sx={{ height: 56, borderRadius: 2 }}
                >
                    {resolvedSecondaryText}
                </Button>
            )}
            <Button
                fullWidth
                variant={primaryVariant}
                color={primaryColor}
                size="large"
                onClick={onPrimary}
                disabled={primaryDisabled || loading}
                sx={{ height: 56, borderRadius: 2 }}
            >
                {loading ? <CircularProgress size={24} color="inherit" /> : resolvedPrimaryText}
            </Button>
        </Box>
    );
}
