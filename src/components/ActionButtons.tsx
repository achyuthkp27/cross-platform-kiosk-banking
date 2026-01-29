import React from 'react';
import { Box, Button, alpha, useTheme } from '@mui/material';
import { motion } from 'framer-motion';
import { useThemeContext } from '../context/ThemeContext';

interface ActionButtonsProps {
    onPrimary: () => void;
    onSecondary?: () => void;
    primaryText: string;
    secondaryText?: string;
    primaryDisabled?: boolean;
    secondaryDisabled?: boolean;
    loading?: boolean;
    fullWidth?: boolean;
}

/**
 * Premium action buttons with smooth press animations and sophisticated styling.
 * Fully theme-aware for dark/light modes.
 */
export default function ActionButtons({
    onPrimary,
    onSecondary,
    primaryText,
    secondaryText = 'Back',
    primaryDisabled = false,
    secondaryDisabled = false,
    loading = false,
    fullWidth = true
}: ActionButtonsProps) {
    const theme = useTheme();
    const { mode } = useThemeContext();
    const isDark = mode === 'dark';

    const buttonVariants = {
        rest: { scale: 1 },
        pressed: { scale: 0.97 },
        hover: { scale: 1.02 }
    };

    return (
        <Box
            sx={{
                display: 'flex',
                justifyContent: 'center',
                gap: 2,
                mt: 4,
                flexDirection: fullWidth ? 'row' : 'column',
                alignItems: 'center',
            }}
        >
            {onSecondary && (
                <motion.div
                    variants={buttonVariants}
                    initial="rest"
                    whileHover={!secondaryDisabled ? "hover" : "rest"}
                    whileTap={!secondaryDisabled ? "pressed" : "rest"}
                    style={{ flex: fullWidth ? 1 : 'none', width: fullWidth ? '100%' : 'auto' }}
                >
                    <Button
                        variant="outlined"
                        size="large"
                        onClick={onSecondary}
                        disabled={secondaryDisabled || loading}
                        fullWidth={fullWidth}
                        aria-label={secondaryText}
                        sx={{
                            height: 56,
                            borderRadius: 3,
                            fontSize: '1rem',
                            fontWeight: 600,
                            borderWidth: 2,
                            borderColor: isDark ? 'rgba(255, 255, 255, 0.2)' : 'divider',
                            color: isDark ? '#F8FAFC' : 'text.secondary',
                            bgcolor: isDark ? 'rgba(255, 255, 255, 0.05)' : 'transparent',
                            transition: 'all 0.2s ease',
                            '&:hover': {
                                borderWidth: 2,
                                borderColor: 'primary.main',
                                color: 'primary.main',
                                bgcolor: (theme) => alpha(theme.palette.primary.main, isDark ? 0.15 : 0.04),
                            },
                            '&:disabled': {
                                borderColor: isDark ? 'rgba(255, 255, 255, 0.1)' : 'divider',
                                color: isDark ? 'rgba(255, 255, 255, 0.3)' : 'text.disabled',
                                bgcolor: isDark ? 'rgba(255, 255, 255, 0.03)' : 'transparent',
                            }
                        }}
                    >
                        {secondaryText}
                    </Button>
                </motion.div>
            )}

            <motion.div
                variants={buttonVariants}
                initial="rest"
                whileHover={!primaryDisabled ? "hover" : "rest"}
                whileTap={!primaryDisabled ? "pressed" : "rest"}
                style={{ flex: fullWidth ? 2 : 'none', width: fullWidth ? '100%' : 'auto' }}
            >
                <Button
                    variant="contained"
                    size="large"
                    onClick={onPrimary}
                    disabled={primaryDisabled || loading}
                    fullWidth={fullWidth}
                    aria-label={primaryText}
                    aria-busy={loading}
                    sx={{
                        height: 56,
                        borderRadius: 3,
                        fontSize: '1rem',
                        fontWeight: 600,
                        background: (theme) => `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.light} 100%)`,
                        boxShadow: (theme) => isDark
                            ? `0 0 20px ${alpha(theme.palette.primary.main, 0.3)}`
                            : `0 4px 14px ${alpha(theme.palette.primary.main, 0.25)}`,
                        transition: 'all 0.2s ease',
                        '&:hover': {
                            boxShadow: (theme) => isDark
                                ? `0 0 30px ${alpha(theme.palette.primary.main, 0.5)}`
                                : `0 8px 25px ${alpha(theme.palette.primary.main, 0.35)}`,
                        },
                        '&:disabled': {
                            background: isDark
                                ? 'linear-gradient(135deg, #334155 0%, #475569 100%)'
                                : 'linear-gradient(135deg, #CBD5E1 0%, #E2E8F0 100%)',
                            color: isDark ? 'rgba(255, 255, 255, 0.4)' : 'rgba(255, 255, 255, 0.8)',
                            boxShadow: 'none',
                        }
                    }}
                >
                    {primaryText}
                </Button>
            </motion.div>
        </Box>
    );
}
