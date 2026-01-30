import React, { useState, useRef } from 'react';
import { Box, alpha } from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';

interface RippleConfig {
    x: number;
    y: number;
    size: number;
    id: number;
}

interface RippleButtonProps {
    children: React.ReactNode;
    color?: string;
    duration?: number;
    disabled?: boolean;
    onClick?: (e: React.MouseEvent<HTMLDivElement>) => void;
    className?: string;
    style?: React.CSSProperties;
}

/**
 * Premium ripple effect wrapper for any clickable element
 */
export default function RippleButton({
    children,
    color = 'rgba(255, 255, 255, 0.4)',
    duration = 600,
    disabled = false,
    onClick,
    className,
    style,
}: RippleButtonProps) {
    const [ripples, setRipples] = useState<RippleConfig[]>([]);
    const containerRef = useRef<HTMLDivElement>(null);
    const nextId = useRef(0);

    const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
        if (disabled) return;

        const container = containerRef.current;
        if (!container) return;

        const rect = container.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const size = Math.max(rect.width, rect.height) * 2;

        const newRipple: RippleConfig = {
            x: x - size / 2,
            y: y - size / 2,
            size,
            id: nextId.current++,
        };

        setRipples((prev) => [...prev, newRipple]);

        // Remove ripple after animation
        setTimeout(() => {
            setRipples((prev) => prev.filter((r) => r.id !== newRipple.id));
        }, duration);

        onClick?.(e);
    };

    return (
        <Box
            ref={containerRef}
            onClick={handleClick}
            className={className}
            sx={{
                position: 'relative',
                overflow: 'hidden',
                cursor: disabled ? 'default' : 'pointer',
                ...style,
            }}
        >
            {children}
            <AnimatePresence>
                {ripples.map((ripple) => (
                    <motion.div
                        key={ripple.id}
                        initial={{ scale: 0, opacity: 0.5 }}
                        animate={{ scale: 1, opacity: 0 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: duration / 1000, ease: 'easeOut' }}
                        style={{
                            position: 'absolute',
                            left: ripple.x,
                            top: ripple.y,
                            width: ripple.size,
                            height: ripple.size,
                            borderRadius: '50%',
                            backgroundColor: color,
                            pointerEvents: 'none',
                        }}
                    />
                ))}
            </AnimatePresence>
        </Box>
    );
}

/**
 * Input glow effect for focused inputs
 */
export const InputGlow = ({
    children,
    focused,
    color = '#00D4FF',
    intensity = 0.3,
}: {
    children: React.ReactNode;
    focused: boolean;
    color?: string;
    intensity?: number;
}) => {
    return (
        <Box
            sx={{
                position: 'relative',
                transition: 'all 0.3s ease',
                '&::before': {
                    content: '""',
                    position: 'absolute',
                    inset: -2,
                    borderRadius: 'inherit',
                    background: `radial-gradient(ellipse at center, ${alpha(color, focused ? intensity : 0)} 0%, transparent 70%)`,
                    opacity: focused ? 1 : 0,
                    transition: 'opacity 0.3s ease',
                    pointerEvents: 'none',
                    zIndex: -1,
                },
            }}
        >
            {children}
        </Box>
    );
};

/**
 * Success checkmark animation
 */
export const AnimatedCheckmark = ({
    show,
    size = 80,
    color = '#10B981',
}: {
    show: boolean;
    size?: number;
    color?: string;
}) => {
    return (
        <AnimatePresence>
            {show && (
                <motion.div
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0, opacity: 0 }}
                    transition={{ type: 'spring', damping: 12, stiffness: 200 }}
                >
                    <Box
                        sx={{
                            width: size,
                            height: size,
                            borderRadius: '50%',
                            background: `linear-gradient(135deg, ${color} 0%, ${alpha(color, 0.8)} 100%)`,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            boxShadow: `0 8px 32px ${alpha(color, 0.4)}`,
                        }}
                    >
                        <motion.svg
                            width={size * 0.5}
                            height={size * 0.5}
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="white"
                            strokeWidth={3}
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        >
                            <motion.path
                                d="M5 12l5 5L20 7"
                                initial={{ pathLength: 0 }}
                                animate={{ pathLength: 1 }}
                                transition={{ duration: 0.4, delay: 0.2 }}
                            />
                        </motion.svg>
                    </Box>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

/**
 * Loading spinner with premium animation
 */
export const LoadingSpinner = ({
    size = 40,
    color = '#00D4FF',
    thickness = 3,
}: {
    size?: number;
    color?: string;
    thickness?: number;
}) => {
    return (
        <Box
            sx={{
                width: size,
                height: size,
                position: 'relative',
            }}
        >
            <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                style={{
                    width: '100%',
                    height: '100%',
                    borderRadius: '50%',
                    border: `${thickness}px solid ${alpha(color, 0.2)}`,
                    borderTopColor: color,
                }}
            />
        </Box>
    );
};
