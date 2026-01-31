import React from 'react';
import { Container, Paper, Box } from '@mui/material';
import { motion } from 'framer-motion';
import { useThemeContext } from '../context/ThemeContext';

interface KioskPageProps {
    children: React.ReactNode;
    maxWidth?: number;
    noPaper?: boolean;
}

/**
 * Premium kiosk page container with sophisticated styling.
 * Provides consistent layout, animations, and visual treatment.
 * Fully theme-aware for dark/light modes.
 */
export default function KioskPage({ children, maxWidth = 700, noPaper = false }: KioskPageProps) {
    const { mode } = useThemeContext();
    const isDark = mode === 'dark';

    const content = (
        <motion.div
            initial={{ opacity: 0, y: 24, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -16, scale: 0.98 }}
            transition={{
                duration: 0.4,
                ease: [0.4, 0, 0.2, 1] // Material ease-out
            }}
            style={{ width: '100%' }}
        >
            {noPaper ? (
                <Box sx={{ textAlign: 'center' }}>
                    {children}
                </Box>
            ) : (
                <Paper
                    elevation={3}
                    sx={{
                        p: { xs: 4, md: 6 },
                        borderRadius: 4,
                        textAlign: 'center',
                        position: 'relative',
                        overflow: 'hidden',
                        background: isDark
                            ? 'linear-gradient(180deg, #0F172A 0%, #1E293B 100%)'
                            : 'linear-gradient(180deg, #FFFFFF 0%, #FAFBFC 100%)',
                        border: `1px solid ${isDark ? 'rgba(255, 255, 255, 0.06)' : 'rgba(0, 0, 0, 0.04)'}`,
                        transition: 'all 0.4s ease',
                        // Subtle top accent line
                        '&::before': {
                            content: '""',
                            position: 'absolute',
                            top: 0,
                            left: '50%',
                            transform: 'translateX(-50%)',
                            width: '60%',
                            height: 3,
                            background: isDark
                                ? 'linear-gradient(90deg, transparent, rgba(56, 189, 248, 0.4), transparent)'
                                : 'linear-gradient(90deg, transparent, rgba(10, 37, 64, 0.4), transparent)',
                            borderRadius: '0 0 4px 4px',
                        }
                    }}
                >
                    {children}
                </Paper>
            )}
        </motion.div>
    );

    return (
        <Box
            sx={{
                minHeight: '100vh',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: isDark
                    ? 'linear-gradient(135deg, #020617 0%, #0F172A 50%, #020617 100%)'
                    : 'linear-gradient(135deg, #F8FAFC 0%, #E2E8F0 50%, #F1F5F9 100%)',
                py: 4,
                px: 2,
                transition: 'background 0.4s ease',
                overflowY: 'auto',
                WebkitOverflowScrolling: 'touch',
            }}
        >
            <Container
                maxWidth={false}
                sx={{
                    maxWidth: maxWidth,
                    width: '100%',
                }}
            >
                {content}
            </Container>
        </Box>
    );
}
