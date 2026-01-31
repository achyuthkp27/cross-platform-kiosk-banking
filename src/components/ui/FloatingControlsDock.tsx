import React from 'react';
import { Box, IconButton, Tooltip, alpha, useTheme, useMediaQuery, Menu, MenuItem, Typography, Fade } from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';
import LightModeIcon from '@mui/icons-material/LightMode';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import { useThemeContext } from '../../context/ThemeContext';
import { useLanguage } from '../../context/LanguageContext';
import { Language } from '../../i18n/translations';
import { usePathname } from 'expo-router';

/**
 * Unified Floating Controls Dock
 * Combines Theme and Language toggles in a responsive, non-overlapping layout.
 */
export default function FloatingControlsDock() {
    const { mode, toggleTheme } = useThemeContext();
    const { language, setLanguage } = useLanguage();
    const theme = useTheme();
    const isDark = mode === 'dark';
    const pathname = usePathname();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

    // Language menu state
    const [langAnchor, setLangAnchor] = React.useState<null | HTMLElement>(null);
    const langMenuOpen = Boolean(langAnchor);

    // Hide on landing page
    if (pathname === '/') return null;

    const getFlag = (lang: Language) => {
        switch (lang) {
            case 'en': return '🇺🇸';
            case 'es': return '🇪🇸';
            case 'nl': return '🇳🇱';
            default: return '🌐';
        }
    };

    const buttonStyle = {
        width: isMobile ? 44 : 48,
        height: isMobile ? 44 : 48,
        borderRadius: '50%',
        backgroundColor: isDark ? alpha('#1E293B', 0.9) : alpha('#FFFFFF', 0.95),
        backdropFilter: 'blur(20px)',
        border: `1px solid ${isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.08)'}`,
        boxShadow: isDark ? '0 4px 20px rgba(0,0,0,0.3)' : '0 4px 20px rgba(0,0,0,0.1)',
        transition: 'all 0.2s ease',
        '&:hover': {
            transform: 'scale(1.1)',
            backgroundColor: isDark ? alpha('#1E293B', 1) : '#FFFFFF',
        },
    };

    return (
        <>
            {/* Top Right Dock - Theme & Language */}
            <Box
                sx={{
                    position: 'fixed',
                    top: isMobile ? 12 : 24,
                    right: isMobile ? 12 : 24,
                    zIndex: 1300,
                    display: 'flex',
                    flexDirection: 'row',
                    gap: isMobile ? 1 : 1.5,
                    alignItems: 'center',
                }}
            >
                {/* Theme Toggle */}
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <Tooltip title={isDark ? 'Light Mode' : 'Dark Mode'} placement="bottom">
                        <IconButton
                            onClick={toggleTheme}
                            aria-label={isDark ? 'Switch to light theme' : 'Switch to dark theme'}
                            sx={{
                                ...buttonStyle,
                                color: isDark ? '#38BDF8' : '#F59E0B',
                            }}
                        >
                            <AnimatePresence mode="wait">
                                {isDark ? (
                                    <motion.div
                                        key="dark"
                                        initial={{ rotate: -90, opacity: 0 }}
                                        animate={{ rotate: 0, opacity: 1 }}
                                        exit={{ rotate: 90, opacity: 0 }}
                                        transition={{ duration: 0.2 }}
                                    >
                                        <DarkModeIcon sx={{ fontSize: isMobile ? 22 : 26 }} />
                                    </motion.div>
                                ) : (
                                    <motion.div
                                        key="light"
                                        initial={{ rotate: 90, opacity: 0 }}
                                        animate={{ rotate: 0, opacity: 1 }}
                                        exit={{ rotate: -90, opacity: 0 }}
                                        transition={{ duration: 0.2 }}
                                    >
                                        <LightModeIcon sx={{ fontSize: isMobile ? 22 : 26 }} />
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </IconButton>
                    </Tooltip>
                </motion.div>

                {/* Language Toggle */}
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <Tooltip title="Change Language" placement="bottom">
                        <IconButton
                            onClick={(e) => setLangAnchor(e.currentTarget)}
                            aria-label="Change language"
                            sx={{
                                ...buttonStyle,
                                color: theme.palette.primary.main,
                            }}
                        >
                            <Typography sx={{ fontSize: isMobile ? 20 : 24, lineHeight: 1 }}>
                                {getFlag(language)}
                            </Typography>
                        </IconButton>
                    </Tooltip>
                </motion.div>
            </Box>

            {/* Language Menu */}
            <Menu
                anchorEl={langAnchor}
                open={langMenuOpen}
                onClose={() => setLangAnchor(null)}
                TransitionComponent={Fade}
                PaperProps={{
                    elevation: 8,
                    sx: {
                        mt: 1,
                        borderRadius: 3,
                        minWidth: 140,
                        backdropFilter: 'blur(20px)',
                        bgcolor: isDark ? alpha('#1E293B', 0.95) : alpha('#FFFFFF', 0.98),
                    },
                }}
            >
                {(['en', 'es', 'nl'] as Language[]).map((lang) => (
                    <MenuItem
                        key={lang}
                        selected={language === lang}
                        onClick={() => { setLanguage(lang); setLangAnchor(null); }}
                        sx={{ gap: 1.5, py: 1 }}
                    >
                        <Typography>{getFlag(lang)}</Typography>
                        <Typography>{lang === 'en' ? 'English' : lang === 'es' ? 'Español' : 'Nederlands'}</Typography>
                    </MenuItem>
                ))}
            </Menu>
        </>
    );
}

