import React, { useRef, useState, useCallback } from 'react';
import { Box, Paper, alpha, useTheme } from '@mui/material';
import { motion, useMotionValue, useTransform, useSpring } from 'framer-motion';

interface ParallaxCardProps {
    children: React.ReactNode;
    intensity?: number;
    glare?: boolean;
    elevation?: number;
    borderRadius?: number;
    className?: string;
    sx?: object;
}

/**
 * Premium Parallax Card with 3D tilt effect and optional glare.
 * Creates an immersive, physical feeling for screen touches.
 */
export default function ParallaxCard({
    children,
    intensity = 15,
    glare = true,
    elevation = 8,
    borderRadius = 4,
    className,
    sx = {},
}: ParallaxCardProps) {
    const theme = useTheme();
    const isDark = theme.palette.mode === 'dark';
    const cardRef = useRef<HTMLDivElement>(null);
    const [isHovered, setIsHovered] = useState(false);

    // Motion values for smooth animation
    const x = useMotionValue(0);
    const y = useMotionValue(0);

    // Transform motion values to rotation
    const rotateX = useTransform(y, [-0.5, 0.5], [intensity, -intensity]);
    const rotateY = useTransform(x, [-0.5, 0.5], [-intensity, intensity]);

    // Spring physics for smooth animation
    const springRotateX = useSpring(rotateX, { stiffness: 300, damping: 30 });
    const springRotateY = useSpring(rotateY, { stiffness: 300, damping: 30 });

    // Glare position
    const glareX = useTransform(x, [-0.5, 0.5], [0, 100]);
    const glareY = useTransform(y, [-0.5, 0.5], [0, 100]);

    const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
        if (!cardRef.current) return;

        const rect = cardRef.current.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;

        // Normalize mouse position to -0.5 to 0.5
        const normalizedX = (e.clientX - centerX) / rect.width;
        const normalizedY = (e.clientY - centerY) / rect.height;

        x.set(normalizedX);
        y.set(normalizedY);
    }, [x, y]);

    const handleMouseEnter = useCallback(() => {
        setIsHovered(true);
    }, []);

    const handleMouseLeave = useCallback(() => {
        setIsHovered(false);
        x.set(0);
        y.set(0);
    }, [x, y]);

    return (
        <motion.div
            ref={cardRef}
            className={className}
            onMouseMove={handleMouseMove}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            style={{
                perspective: 1000,
                transformStyle: 'preserve-3d',
            }}
        >
            <motion.div
                style={{
                    rotateX: springRotateX,
                    rotateY: springRotateY,
                    transformStyle: 'preserve-3d',
                }}
            >
                <Paper
                    elevation={isHovered ? elevation + 4 : elevation}
                    sx={{
                        position: 'relative',
                        overflow: 'hidden',
                        borderRadius,
                        background: isDark
                            ? `linear-gradient(135deg, ${alpha('#1E293B', 0.9)} 0%, ${alpha('#0F172A', 0.95)} 100%)`
                            : `linear-gradient(135deg, ${alpha('#FFFFFF', 0.95)} 0%, ${alpha('#F1F5F9', 0.9)} 100%)`,
                        backdropFilter: 'blur(20px)',
                        border: `1px solid ${isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)'}`,
                        boxShadow: isHovered
                            ? isDark
                                ? `0 25px 50px -12px rgba(0, 0, 0, 0.5), 0 0 0 1px ${alpha(theme.palette.primary.main, 0.2)}`
                                : `0 25px 50px -12px rgba(0, 0, 0, 0.15), 0 0 0 1px ${alpha(theme.palette.primary.main, 0.1)}`
                            : undefined,
                        transition: 'box-shadow 0.3s ease',
                        ...sx,
                    }}
                >
                    {/* Content */}
                    <Box sx={{ position: 'relative', zIndex: 1 }}>
                        {children}
                    </Box>

                    {/* Glare Effect */}
                    {glare && (
                        <motion.div
                            style={{
                                position: 'absolute',
                                top: 0,
                                left: 0,
                                right: 0,
                                bottom: 0,
                                pointerEvents: 'none',
                                opacity: isHovered ? 0.15 : 0,
                                background: `radial-gradient(circle at ${glareX}% ${glareY}%, white 0%, transparent 60%)`,
                                transition: 'opacity 0.3s ease',
                            }}
                        />
                    )}

                    {/* Edge Highlight */}
                    <Box
                        sx={{
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            right: 0,
                            height: '1px',
                            background: isDark
                                ? 'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.2) 50%, transparent 100%)'
                                : 'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.8) 50%, transparent 100%)',
                            opacity: isHovered ? 1 : 0.5,
                            transition: 'opacity 0.3s ease',
                        }}
                    />
                </Paper>
            </motion.div>
        </motion.div>
    );
}
