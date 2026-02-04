import React, { useState } from 'react';
import { Box, Typography, Button, alpha } from '@mui/material';
import { useRouter } from 'expo-router';
import LanguageSelector from '../src/components/language/LanguageSelector';
import { useLanguage } from '../src/context/LanguageContext';
import { motion } from 'framer-motion';
import ThemeToggle from '../src/components/theme/ThemeToggle';
import { MaterialIcons } from '@expo/vector-icons';
import { useThemeContext } from '../src/context/ThemeContext';

// Advanced Noise Texture
const NoiseTexture = ({ isDark }: { isDark: boolean }) => (
    <Box
        component="svg"
        sx={{
            position: 'absolute',
            inset: 0,
            width: '100%',
            height: '100%',
            opacity: isDark ? 0.05 : 0.03,
            pointerEvents: 'none',
            zIndex: 1,
            mixBlendMode: 'overlay',
        }}
    >
        <filter id="noise">
            <feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves="3" stitchTiles="stitch" />
        </filter>
        <rect width="100%" height="100%" filter="url(#noise)" />
    </Box>
);

// Floating Orb Component
const FloatingOrb = ({
    size,
    color,
    top,
    left,
    delay = 0,
    duration = 20
}: {
    size: number;
    color: string;
    top?: string | number;
    left?: string | number;
    delay?: number;
    duration?: number
}) => (
    <motion.div
        animate={{
            y: [0, -40, 0],
            x: [0, 20, 0],
            scale: [1, 1.1, 1],
        }}
        transition={{
            duration,
            repeat: Infinity,
            ease: "easeInOut",
            delay,
        }}
        style={{
            position: 'absolute',
            top,
            left,
            width: size,
            height: size,
            borderRadius: '50%',
            background: `radial-gradient(circle at 30% 30%, ${color}, transparent 70%)`,
            filter: 'blur(60px)',
            opacity: 0.6,
            zIndex: 0,
        }}
    />
);

export default function LandingScreen() {
    const router = useRouter();
    const { t } = useLanguage();
    const { mode } = useThemeContext();
    const [isHovered, setIsHovered] = useState(false);

    const isDark = mode === 'dark';

    // Theme-aware colors
    const bgGradient = isDark
        ? 'linear-gradient(180deg, #02040A 0%, #050A19 50%, #02040A 100%)'
        : 'linear-gradient(180deg, #F8FAFC 0%, #E2E8F0 50%, #F8FAFC 100%)';

    const accentColor = isDark ? '#00D4FF' : '#0A2540';
    const secondaryColor = isDark ? '#6366F1' : '#0891B2';

    const textPrimary = isDark ? '#FFFFFF' : '#0F172A';
    const textSecondary = isDark ? '#94A3B8' : '#475569';
    const textMuted = isDark ? alpha('#94A3B8', 0.4) : alpha('#475569', 0.6);

    const gridColor = isDark ? 'rgba(255, 255, 255, 0.03)' : 'rgba(0, 0, 0, 0.03)';
    const buttonBg = isDark ? 'rgba(255, 255, 255, 0.05)' : 'rgba(10, 37, 64, 0.05)';
    const buttonBorder = isDark ? alpha('#fff', 0.1) : alpha('#0A2540', 0.2);
    const buttonTextColor = isDark ? '#fff' : '#0A2540';

    return (
        <Box
            sx={{
                height: '100vh',
                width: '100vw',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: bgGradient,
                position: 'relative',
                overflow: 'hidden',
                color: textPrimary,
                transition: 'background 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
            }}
        >
            {/* ============ ATMOSPHERE LAYERS ============ */}

            {/* Deep Space / Light Sky Background */}
            <Box
                sx={{
                    position: 'absolute',
                    inset: 0,
                    background: isDark
                        ? 'radial-gradient(ellipse at top center, rgba(5, 16, 40, 0.4) 0%, transparent 80%)'
                        : 'radial-gradient(ellipse at top center, rgba(255, 255, 255, 0.8) 0%, transparent 80%)',
                    zIndex: 0,
                    transition: 'background 0.4s ease',
                }}
            />

            {/* Glowing Orbs */}
            <FloatingOrb size={500} color={alpha(accentColor, isDark ? 0.15 : 0.08)} top="-20%" left="20%" duration={25} />
            <FloatingOrb size={400} color={alpha(secondaryColor, isDark ? 0.1 : 0.06)} top="60%" left="-10%" delay={5} duration={30} />
            <FloatingOrb size={300} color={alpha(isDark ? '#8B5CF6' : '#0891B2', isDark ? 0.08 : 0.05)} top="20%" left="80%" delay={2} duration={20} />

            {/* Grid Overlay (Subtle Tech Feel) */}
            <Box
                sx={{
                    position: 'absolute',
                    inset: 0,
                    backgroundImage: `
                        linear-gradient(${gridColor} 1px, transparent 1px),
                        linear-gradient(90deg, ${gridColor} 1px, transparent 1px)
                    `,
                    backgroundSize: '100px 100px',
                    opacity: isDark ? 0.2 : 0.5,
                    zIndex: 0,
                    maskImage: 'radial-gradient(circle at center, black 40%, transparent 100%)',
                }}
            />

            <NoiseTexture isDark={isDark} />

            {/* ============ HEADER CONTROLS ============ */}
            <Box
                sx={{
                    position: 'absolute',
                    top: 48,
                    right: 48,
                    zIndex: 50,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 2,
                }}
            >
                <ThemeToggle sx={{ position: 'relative', top: 'auto', right: 'auto', zIndex: 1 }} />
                <LanguageSelector />
            </Box>

            {/* ============ MAIN CENTERPIECE ============ */}
            <Box
                sx={{
                    zIndex: 10,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    maxWidth: '1200px',
                    width: '100%',
                    px: 4,
                }}
            >
                {/* 1. LOGO REVEAL */}
                <motion.div
                    initial={{ opacity: 1, scale: 0.8, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
                >
                    <Box
                        sx={{
                            width: 120,
                            height: 120,
                            mb: 6,
                            position: 'relative',
                            borderRadius: '30px',
                            overflow: 'hidden',
                            boxShadow: isDark
                                ? `0 0 60px ${alpha(accentColor, 0.3)}`
                                : `0 20px 60px ${alpha('#000', 0.1)}`,
                            border: `1px solid ${isDark ? alpha(accentColor, 0.2) : alpha('#000', 0.08)}`,
                            transition: 'box-shadow 0.4s ease, border-color 0.4s ease',
                        }}
                    >
                        <Box
                            component="img"
                            src="./logo.png"
                            sx={{
                                width: '100%',
                                height: '100%',
                                objectFit: 'cover',
                            }}
                        />
                    </Box>
                </motion.div>

                {/* 2. MAIN HEADLINE */}
                <motion.div
                    initial={{ opacity: 1, y: 40 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
                >
                    <Typography
                        variant="h1"
                        sx={{
                            fontSize: { xs: '3.5rem', md: '5rem', lg: '6.5rem' },
                            fontWeight: 800,
                            textAlign: 'center',
                            lineHeight: 0.95,
                            letterSpacing: '-0.04em',
                            mb: 3,
                            color: 'transparent',
                            background: isDark
                                ? 'linear-gradient(135deg, #FFFFFF 0%, #94A3B8 100%)'
                                : 'linear-gradient(135deg, #0A2540 0%, #1E3A5F 100%)',
                            backgroundClip: 'text',
                            WebkitBackgroundClip: 'text',
                            textShadow: isDark
                                ? `0 20px 60px ${alpha('#000', 0.5)}`
                                : `0 10px 40px ${alpha('#0A2540', 0.15)}`,
                            transition: 'all 0.4s ease',
                        }}
                    >
                        {t('landing.welcome')}
                    </Typography>
                </motion.div>

                {/* 3. SUBTEXT */}
                <motion.div
                    initial={{ opacity: 1 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 1.5, delay: 0.6 }}
                >
                    <Typography
                        variant="h5"
                        sx={{
                            fontSize: { xs: '1.1rem', md: '1.5rem' },
                            fontWeight: 400,
                            color: alpha(textSecondary, 0.8),
                            textAlign: 'center',
                            maxWidth: '600px',
                            mb: 8,
                            letterSpacing: '0.02em',
                            transition: 'color 0.4s ease',
                        }}
                    >
                        {t('landing.tagline')}
                    </Typography>
                </motion.div>

                {/* 4. INTERACTIVE START BUTTON */}
                <motion.div
                    initial={{ scale: 0.9, opacity: 1 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.8, delay: 0.8, type: 'spring' }}
                >
                    <motion.div
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onHoverStart={() => setIsHovered(true)}
                        onHoverEnd={() => setIsHovered(false)}
                    >
                        <Button
                            onClick={() => router.push('/login')}
                            sx={{
                                position: 'relative',
                                background: isHovered
                                    ? `linear-gradient(135deg, ${accentColor} 0%, ${secondaryColor} 100%)`
                                    : buttonBg,
                                color: isHovered ? '#fff' : buttonTextColor,
                                fontSize: '1.25rem',
                                fontWeight: 700,
                                letterSpacing: '0.1em',
                                padding: '24px 80px',
                                borderRadius: '100px',
                                textTransform: 'uppercase',
                                border: '1px solid',
                                borderColor: isHovered ? 'transparent' : buttonBorder,
                                overflow: 'hidden',
                                backdropFilter: 'blur(20px)',
                                boxShadow: isHovered
                                    ? `0 0 60px ${alpha(accentColor, 0.4)}, inset 0 0 20px ${alpha('#fff', 0.2)}`
                                    : isDark
                                        ? 'none'
                                        : `0 8px 30px ${alpha('#000', 0.08)}`,
                                transition: 'all 0.4s cubic-bezier(0.22, 1, 0.36, 1)',
                            }}
                        >
                            {/* Inner shine effect */}
                            <Box sx={{
                                position: 'absolute',
                                top: 0, left: 0, right: 0, bottom: 0,
                                background: 'linear-gradient(180deg, rgba(255,255,255,0.1) 0%, transparent 100%)',
                                opacity: isHovered ? 1 : 0,
                                transition: 'opacity 0.3s',
                            }} />

                            {/* Button Text */}
                            <Box sx={{ position: 'relative', zIndex: 2, display: 'flex', alignItems: 'center', gap: 2 }}>
                                {t('landing.start')}
                                <MaterialIcons
                                    name="arrow-forward"
                                    size={24}
                                    color={isHovered ? '#fff' : buttonTextColor}
                                    style={{
                                        opacity: isHovered ? 1 : 0.6,
                                        transform: isHovered ? 'translateX(4px)' : 'translateX(0)',
                                    }}
                                />
                            </Box>
                        </Button>
                    </motion.div>
                </motion.div>
            </Box>

            {/* ============ FOOTER / STATUS ============ */}
            <Box
                sx={{
                    position: 'absolute',
                    bottom: 40,
                    left: 0,
                    right: 0,
                    display: 'flex',
                    justifyContent: 'center',
                    gap: 4,
                }}
            >
                {['Secure', 'Encrypted', '24/7 Support'].map((item, index) => (
                    <motion.div
                        key={item}
                        initial={{ opacity: 1, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 1.2 + (index * 0.1), duration: 1 }}
                    >
                        <Typography
                            variant="caption"
                            sx={{
                                color: textMuted,
                                textTransform: 'uppercase',
                                letterSpacing: '0.15em',
                                fontSize: '0.7rem',
                                display: 'flex',
                                alignItems: 'center',
                                gap: 1,
                                transition: 'color 0.4s ease',
                                '&::before': {
                                    content: '""',
                                    width: 4,
                                    height: 4,
                                    borderRadius: '50%',
                                    background: accentColor,
                                    opacity: isDark ? 0.5 : 0.8,
                                }
                            }}
                        >
                            {item}
                        </Typography>
                    </motion.div>
                ))}
            </Box>
        </Box>
    );
}
