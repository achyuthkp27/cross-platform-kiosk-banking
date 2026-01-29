import React, { useState } from 'react';
import { Box, Typography, ClickAwayListener, useTheme, alpha } from '@mui/material';
import { useLanguage } from '../../context/LanguageContext';
import { Language } from '../../i18n/translations';
import { motion, AnimatePresence } from 'framer-motion';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';

const languages = [
    { code: 'en', flag: '🇺🇸', label: 'English' },
    { code: 'es', flag: '🇪🇸', label: 'Español' },
    { code: 'nl', flag: '🇳🇱', label: 'Nederlands' },
];

export default function LanguageSelector() {
    const { language, setLanguage } = useLanguage();
    const [isOpen, setIsOpen] = useState(false);
    const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
    const theme = useTheme();
    const isDark = theme.palette.mode === 'dark';

    const currentLang = languages.find(l => l.code === language) || languages[0];

    const handleSelect = (code: string) => {
        setLanguage(code as Language);
        setIsOpen(false);
    };

    return (
        <ClickAwayListener onClickAway={() => setIsOpen(false)}>
            <Box sx={{ position: 'relative', zIndex: 50 }}>
                {/* Trigger Button */}
                <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                >
                    <Box
                        onClick={() => setIsOpen(!isOpen)}
                        sx={{
                            display: 'flex',
                            alignItems: 'center',
                            cursor: 'pointer',
                            padding: '12px 20px',
                            background: isDark
                                ? 'rgba(255, 255, 255, 0.08)'
                                : 'rgba(255, 255, 255, 0.9)',
                            backdropFilter: 'blur(16px)',
                            border: '1px solid',
                            borderColor: isDark
                                ? 'rgba(255, 255, 255, 0.15)'
                                : 'rgba(0, 0, 0, 0.1)',
                            borderRadius: '30px',
                            boxShadow: isDark
                                ? '0 8px 32px rgba(0, 0, 0, 0.2)'
                                : '0 8px 32px rgba(0, 0, 0, 0.08)',
                            transition: 'all 0.3s ease',
                            '&:hover': {
                                background: isDark
                                    ? 'rgba(255, 255, 255, 0.12)'
                                    : 'rgba(255, 255, 255, 1)',
                                borderColor: isDark
                                    ? 'rgba(255, 255, 255, 0.25)'
                                    : 'rgba(0, 0, 0, 0.15)',
                                boxShadow: isDark
                                    ? '0 10px 40px rgba(0, 0, 0, 0.3)'
                                    : '0 10px 40px rgba(0, 0, 0, 0.12)',
                            }
                        }}
                    >
                        <motion.span
                            animate={{
                                y: isOpen ? -2 : 0,
                            }}
                            style={{
                                fontSize: '1.5rem',
                                marginRight: '12px',
                                display: 'inline-block',
                                filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.2))'
                            }}
                        >
                            {currentLang.flag}
                        </motion.span>

                        <Typography
                            sx={{
                                fontWeight: 600,
                                color: isDark ? 'white' : theme.palette.text.primary,
                                marginRight: '12px',
                                fontSize: '0.95rem',
                                letterSpacing: '0.02em',
                            }}
                        >
                            {currentLang.label}
                        </Typography>

                        <motion.div
                            animate={{ rotate: isOpen ? 180 : 0 }}
                            transition={{ duration: 0.4, type: "spring" }}
                        >
                            <KeyboardArrowDownIcon sx={{ color: isDark ? 'rgba(255,255,255,0.7)' : theme.palette.text.secondary }} />
                        </motion.div>
                    </Box>
                </motion.div>

                {/* Dropdown Menu */}
                <AnimatePresence>
                    {isOpen && (
                        <motion.div
                            initial={{ opacity: 0, y: -20, scale: 0.8 }}
                            animate={{ opacity: 1, y: 10, scale: 1 }}
                            exit={{ opacity: 0, y: -10, scale: 0.9 }}
                            transition={{
                                type: "spring",
                                stiffness: 400,
                                damping: 25,
                                mass: 0.8
                            }}
                            style={{
                                position: 'absolute',
                                top: '100%',
                                right: 0,
                                width: '220px',
                                overflow: 'hidden',
                                borderRadius: '24px',
                            }}
                        >
                            <Box
                                sx={{
                                    background: isDark
                                        ? 'rgba(15, 23, 42, 0.8)'
                                        : 'rgba(255, 255, 255, 0.95)',
                                    backdropFilter: 'blur(24px)',
                                    border: '1px solid',
                                    borderColor: isDark
                                        ? 'rgba(255, 255, 255, 0.1)'
                                        : 'rgba(0, 0, 0, 0.08)',
                                    boxShadow: isDark
                                        ? '0 20px 60px rgba(0, 0, 0, 0.5)'
                                        : '0 20px 60px rgba(0, 0, 0, 0.15)',
                                    padding: '8px',
                                    borderRadius: '24px',
                                }}
                            >
                                {languages.map((lang, index) => (
                                    <motion.div
                                        key={lang.code}
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: index * 0.05 }}
                                        onClick={() => handleSelect(lang.code)}
                                        onHoverStart={() => setHoveredIndex(index)}
                                        onHoverEnd={() => setHoveredIndex(null)}
                                        style={{
                                            position: 'relative',
                                            cursor: 'pointer',
                                            borderRadius: '16px',
                                            overflow: 'hidden',
                                            padding: '12px 16px',
                                            marginBottom: index === languages.length - 1 ? 0 : '4px',
                                            display: 'flex',
                                            alignItems: 'center',
                                            background: hoveredIndex === index
                                                ? (isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.05)')
                                                : 'transparent',
                                            transition: 'background 0.2s ease',
                                        }}
                                    >
                                        <motion.span
                                            animate={{
                                                scale: hoveredIndex === index ? 1.2 : 1,
                                                x: hoveredIndex === index ? 4 : 0,
                                            }}
                                            transition={{ type: "spring", stiffness: 300, damping: 15 }}
                                            style={{
                                                fontSize: '1.4rem',
                                                marginRight: '16px',
                                                display: 'inline-block',
                                                filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.2))'
                                            }}
                                        >
                                            {lang.flag}
                                        </motion.span>

                                        <Typography
                                            sx={{
                                                fontWeight: language === lang.code ? 700 : 500,
                                                color: language === lang.code
                                                    ? '#00D4FF'
                                                    : (isDark ? 'rgba(255,255,255,0.9)' : theme.palette.text.primary),
                                                fontSize: '0.95rem',
                                            }}
                                        >
                                            {lang.label}
                                        </Typography>

                                        {language === lang.code && (
                                            <motion.div
                                                layoutId="activeIndicator"
                                                style={{
                                                    position: 'absolute',
                                                    right: '16px',
                                                    width: '6px',
                                                    height: '6px',
                                                    borderRadius: '50%',
                                                    background: '#00D4FF',
                                                    boxShadow: '0 0 8px #00D4FF',
                                                }}
                                            />
                                        )}
                                    </motion.div>
                                ))}
                            </Box>
                        </motion.div>
                    )}
                </AnimatePresence>
            </Box>
        </ClickAwayListener>
    );
}
