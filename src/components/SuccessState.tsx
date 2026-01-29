import React, { useEffect, useState } from 'react';
import { Box, Typography, Button, alpha, useTheme } from '@mui/material';
import { motion } from 'framer-motion';
import Confetti from './Confetti';

interface SuccessStateProps {
    message: string;
    subMessage?: string;
    onHome?: () => void;
    showConfetti?: boolean;
}

/**
 * Premium success state with animated checkmark and celebration effect.
 */
export default function SuccessState({ message, subMessage, onHome, showConfetti = false }: SuccessStateProps) {
    const theme = useTheme();
    const [triggerConfetti, setTriggerConfetti] = useState(false);

    useEffect(() => {
        if (showConfetti) {
            // Delay confetti slightly for dramatic effect
            const timer = setTimeout(() => setTriggerConfetti(true), 300);
            return () => clearTimeout(timer);
        }
    }, [showConfetti]);

    // Particle positions for celebration effect
    const particles = [
        { x: -60, y: -40, delay: 0.3, size: 8 },
        { x: 50, y: -50, delay: 0.35, size: 6 },
        { x: -45, y: 30, delay: 0.4, size: 7 },
        { x: 55, y: 25, delay: 0.45, size: 5 },
        { x: -30, y: -60, delay: 0.5, size: 6 },
        { x: 40, y: -35, delay: 0.55, size: 8 },
    ];

    return (
        <Box sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            py: 6,
            position: 'relative',
        }}>
            {/* Confetti Celebration */}
            <Confetti show={triggerConfetti} duration={4000} pieceCount={80} />

            {/* Success Circle with Checkmark */}
            <Box sx={{ position: 'relative', mb: 4 }}>
                {/* Celebration Particles */}
                {particles.map((particle, i) => (
                    <motion.div
                        key={i}
                        initial={{ scale: 0, x: 0, y: 0, opacity: 0 }}
                        animate={{
                            scale: [0, 1, 0],
                            x: [0, particle.x],
                            y: [0, particle.y],
                            opacity: [0, 1, 0],
                        }}
                        transition={{
                            duration: 0.8,
                            delay: particle.delay,
                            ease: 'easeOut',
                        }}
                        style={{
                            position: 'absolute',
                            left: '50%',
                            top: '50%',
                            width: particle.size,
                            height: particle.size,
                            borderRadius: '50%',
                            background: theme.palette.success.main,
                        }}
                    />
                ))}

                {/* Ripple Effect */}
                <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1.4, opacity: 0 }}
                    transition={{ duration: 0.8, delay: 0.2, ease: 'easeOut' }}
                    style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        borderRadius: '50%',
                        border: `3px solid ${theme.palette.success.main}`,
                    }}
                />

                {/* Main Circle */}
                <motion.div
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{
                        type: 'spring',
                        stiffness: 260,
                        damping: 20,
                        delay: 0.1
                    }}
                >
                    <Box sx={{
                        width: 120,
                        height: 120,
                        borderRadius: '50%',
                        background: `linear-gradient(135deg, ${theme.palette.success.main} 0%, ${theme.palette.success.dark} 100%)`,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        boxShadow: `0 16px 40px ${alpha(theme.palette.success.main, 0.35)}`,
                        position: 'relative',
                        overflow: 'hidden',
                    }}>
                        {/* Shine effect */}
                        <Box
                            sx={{
                                position: 'absolute',
                                top: 0,
                                left: 0,
                                right: 0,
                                height: '50%',
                                background: 'linear-gradient(180deg, rgba(255,255,255,0.25) 0%, transparent 100%)',
                                borderRadius: '50% 50% 0 0',
                            }}
                        />

                        {/* Animated Checkmark */}
                        <svg
                            width="60"
                            height="60"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="white"
                            strokeWidth="3"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            style={{ position: 'relative', zIndex: 1 }}
                        >
                            <motion.path
                                d="M20 6L9 17l-5-5"
                                initial={{ pathLength: 0, opacity: 0 }}
                                animate={{ pathLength: 1, opacity: 1 }}
                                transition={{
                                    duration: 0.5,
                                    delay: 0.4,
                                    ease: "easeOut"
                                }}
                            />
                        </svg>
                    </Box>
                </motion.div>
            </Box>

            {/* Message */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 0.5, ease: 'easeOut' }}
                style={{ textAlign: 'center' }}
            >
                <Typography
                    variant="h4"
                    sx={{
                        fontWeight: 700,
                        mb: 1.5,
                        background: `linear-gradient(135deg, ${theme.palette.success.dark} 0%, ${theme.palette.success.main} 100%)`,
                        backgroundClip: 'text',
                        WebkitBackgroundClip: 'text',
                        color: 'transparent',
                    }}
                >
                    {message}
                </Typography>

                {subMessage && (
                    <Typography
                        variant="body1"
                        color="text.secondary"
                        sx={{
                            mb: 4,
                            maxWidth: 400,
                            mx: 'auto',
                            lineHeight: 1.6,
                        }}
                    >
                        {subMessage}
                    </Typography>
                )}

                {onHome && (
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.7, duration: 0.4 }}
                    >
                        <Button
                            variant="contained"
                            onClick={onHome}
                            size="large"
                            sx={{
                                px: 5,
                                py: 1.5,
                                borderRadius: 3,
                                fontWeight: 600,
                            }}
                        >
                            Back to Dashboard
                        </Button>
                    </motion.div>
                )}
            </motion.div>
        </Box>
    );
}
