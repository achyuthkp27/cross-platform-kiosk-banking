import React from 'react';
import { Box, alpha, useTheme } from '@mui/material';
import { motion } from 'framer-motion';

interface AnimatedCheckProps {
    size?: number;
    color?: string;
    strokeWidth?: number;
}

/**
 * Premium animated checkmark with draw-on effect.
 * Perfect for success states.
 */
export const AnimatedCheck = ({ size = 100, color, strokeWidth = 4 }: AnimatedCheckProps) => {
    const theme = useTheme();
    const checkColor = color || theme.palette.success.main;

    return (
        <Box
            sx={{
                width: size,
                height: size,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
            }}
        >
            {/* Background Circle */}
            <motion.div
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.4, ease: [0.34, 1.56, 0.64, 1] }}
                style={{
                    position: 'absolute',
                    width: size,
                    height: size,
                    borderRadius: '50%',
                    background: `linear-gradient(135deg, ${checkColor} 0%, ${alpha(checkColor, 0.8)} 100%)`,
                    boxShadow: `0 10px 40px ${alpha(checkColor, 0.4)}`,
                }}
            />

            {/* Check SVG */}
            <motion.svg
                width={size * 0.5}
                height={size * 0.5}
                viewBox="0 0 24 24"
                fill="none"
                style={{ position: 'relative', zIndex: 1 }}
            >
                <motion.path
                    d="M4 12l6 6L20 6"
                    stroke="white"
                    strokeWidth={strokeWidth}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    initial={{ pathLength: 0, opacity: 0 }}
                    animate={{ pathLength: 1, opacity: 1 }}
                    transition={{ duration: 0.5, delay: 0.3, ease: 'easeOut' }}
                />
            </motion.svg>

            {/* Particle Burst */}
            {[...Array(8)].map((_, i) => (
                <motion.div
                    key={i}
                    initial={{ scale: 0, x: 0, y: 0, opacity: 1 }}
                    animate={{
                        scale: [0, 1, 0],
                        x: [0, Math.cos((i * 45 * Math.PI) / 180) * size * 0.8],
                        y: [0, Math.sin((i * 45 * Math.PI) / 180) * size * 0.8],
                        opacity: [1, 0],
                    }}
                    transition={{ duration: 0.6, delay: 0.2, ease: 'easeOut' }}
                    style={{
                        position: 'absolute',
                        width: 8,
                        height: 8,
                        borderRadius: '50%',
                        background: checkColor,
                    }}
                />
            ))}
        </Box>
    );
};

interface AnimatedErrorProps {
    size?: number;
    color?: string;
    strokeWidth?: number;
}

/**
 * Premium animated X mark for error states.
 */
export const AnimatedError = ({ size = 100, color, strokeWidth = 4 }: AnimatedErrorProps) => {
    const theme = useTheme();
    const errorColor = color || theme.palette.error.main;

    return (
        <Box
            sx={{
                width: size,
                height: size,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
            }}
        >
            {/* Background Circle with shake */}
            <motion.div
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1, x: [0, -5, 5, -5, 5, 0] }}
                transition={{
                    scale: { duration: 0.4, ease: [0.34, 1.56, 0.64, 1] },
                    x: { duration: 0.4, delay: 0.3 },
                }}
                style={{
                    position: 'absolute',
                    width: size,
                    height: size,
                    borderRadius: '50%',
                    background: `linear-gradient(135deg, ${errorColor} 0%, ${alpha(errorColor, 0.8)} 100%)`,
                    boxShadow: `0 10px 40px ${alpha(errorColor, 0.4)}`,
                }}
            />

            {/* X SVG */}
            <motion.svg
                width={size * 0.4}
                height={size * 0.4}
                viewBox="0 0 24 24"
                fill="none"
                style={{ position: 'relative', zIndex: 1 }}
            >
                <motion.path
                    d="M6 6l12 12M18 6l-12 12"
                    stroke="white"
                    strokeWidth={strokeWidth}
                    strokeLinecap="round"
                    initial={{ pathLength: 0, opacity: 0 }}
                    animate={{ pathLength: 1, opacity: 1 }}
                    transition={{ duration: 0.4, delay: 0.3 }}
                />
            </motion.svg>
        </Box>
    );
};

interface PulsingDotProps {
    size?: number;
    color?: string;
}

/**
 * Premium pulsing dot for loading/processing states.
 */
export const PulsingDot = ({ size = 16, color }: PulsingDotProps) => {
    const theme = useTheme();
    const dotColor = color || theme.palette.primary.main;

    return (
        <Box sx={{ position: 'relative', width: size, height: size }}>
            {/* Outer pulse ring */}
            <motion.div
                animate={{
                    scale: [1, 2],
                    opacity: [0.6, 0],
                }}
                transition={{
                    duration: 1.5,
                    repeat: Infinity,
                    ease: 'easeOut',
                }}
                style={{
                    position: 'absolute',
                    width: size,
                    height: size,
                    borderRadius: '50%',
                    backgroundColor: dotColor,
                }}
            />
            {/* Inner solid dot */}
            <Box
                sx={{
                    position: 'absolute',
                    width: size,
                    height: size,
                    borderRadius: '50%',
                    backgroundColor: dotColor,
                }}
            />
        </Box>
    );
};

interface FloatingGradientProps {
    children: React.ReactNode;
    colors?: string[];
}

/**
 * Floating Gradient Background animation.
 */
export const FloatingGradient = ({ 
    children, 
    colors = ['#00D4FF', '#6366F1', '#8B5CF6'] 
}: FloatingGradientProps) => {
    return (
        <Box sx={{ position: 'relative', overflow: 'hidden' }}>
            {/* Animated gradient blobs */}
            {colors.map((color, i) => (
                <motion.div
                    key={i}
                    animate={{
                        x: [0, 100 * (i % 2 === 0 ? 1 : -1), 0],
                        y: [0, 50 * (i % 2 === 0 ? -1 : 1), 0],
                        scale: [1, 1.2, 1],
                    }}
                    transition={{
                        duration: 15 + i * 5,
                        repeat: Infinity,
                        ease: 'easeInOut',
                    }}
                    style={{
                        position: 'absolute',
                        width: 300,
                        height: 300,
                        borderRadius: '50%',
                        background: `radial-gradient(circle, ${alpha(color, 0.3)} 0%, transparent 70%)`,
                        filter: 'blur(60px)',
                        top: `${20 + i * 30}%`,
                        left: `${10 + i * 25}%`,
                        pointerEvents: 'none',
                        zIndex: 0,
                    }}
                />
            ))}
            <Box sx={{ position: 'relative', zIndex: 1 }}>{children}</Box>
        </Box>
    );
};

/**
 * Shimmer loading effect for text placeholders.
 */
export const ShimmerText = ({ width = 200, height = 24 }: { width?: number; height?: number }) => {
    const theme = useTheme();
    const isDark = theme.palette.mode === 'dark';

    return (
        <Box
            sx={{
                width,
                height,
                borderRadius: 1,
                overflow: 'hidden',
                position: 'relative',
                backgroundColor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.08)',
            }}
        >
            <motion.div
                animate={{ x: ['-100%', '100%'] }}
                transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
                style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    background: isDark
                        ? 'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.15) 50%, transparent 100%)'
                        : 'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.6) 50%, transparent 100%)',
                }}
            />
        </Box>
    );
};
