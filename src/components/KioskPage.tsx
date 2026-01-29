import React from 'react';
import { Box, Paper, Fade, Container } from '@mui/material';
import { motion } from 'framer-motion';

interface KioskPageProps {
    children: React.ReactNode;
    maxWidth?: number | 'xs' | 'sm' | 'md' | 'lg' | 'xl';
    animationDirection?: 'up' | 'down' | 'left' | 'right' | 'fade';
}

export default function KioskPage({
    children,
    maxWidth = 600,
    animationDirection = 'up'
}: KioskPageProps) {
    const getInitialProps = () => {
        switch (animationDirection) {
            case 'up': return { opacity: 0, y: 20 };
            case 'down': return { opacity: 0, y: -20 };
            case 'left': return { opacity: 0, x: 20 };
            case 'right': return { opacity: 0, x: -20 };
            default: return { opacity: 0 };
        }
    };

    return (
        <Box
            sx={{
                height: '100vh',
                width: '100vw',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                bgcolor: 'background.default',
                overflow: 'hidden',
                background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)', // Premium subtle gradient
            }}
        >
            <Container maxWidth={typeof maxWidth === 'string' ? maxWidth : false} sx={{
                display: 'flex',
                justifyContent: 'center',
                maxWidth: typeof maxWidth === 'number' ? maxWidth : undefined
            }}>
                <motion.div
                    initial={getInitialProps()}
                    animate={{ opacity: 1, x: 0, y: 0 }}
                    transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                    style={{ width: '100%' }}
                >
                    <Paper
                        elevation={6}
                        sx={{
                            p: { xs: 4, md: 6 },
                            borderRadius: 4,
                            textAlign: 'center',
                            width: '100%',
                            backdropFilter: 'blur(10px)',
                            bgcolor: 'rgba(255, 255, 255, 0.9)',
                            border: '1px solid rgba(255, 255, 255, 0.3)',
                        }}
                    >
                        {children}
                    </Paper>
                </motion.div>
            </Container>
        </Box>
    );
}
