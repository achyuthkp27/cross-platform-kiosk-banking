import React, { useState } from 'react';
import { Box, Typography, AppBar, Toolbar, Button, Chip, useTheme, useMediaQuery, IconButton, Menu, MenuItem, Tooltip } from '@mui/material';
import LogoutIcon from '@mui/icons-material/Logout';
import LightModeIcon from '@mui/icons-material/LightMode';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import { useThemeContext } from '../../context/ThemeContext';
import { useLanguage } from '../../context/LanguageContext';
import { Language } from '../../i18n/translations';

interface DashboardHeaderProps {
    isDark: boolean;
    userName: string;
    timeLeft: number;
    formatTime: (seconds: number) => string;
    onLogout: () => void;
}

export const DashboardHeader: React.FC<DashboardHeaderProps> = ({
    isDark,
    userName,
    timeLeft,
    formatTime,
    onLogout
}) => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
    const { toggleTheme } = useThemeContext();
    const { language, setLanguage } = useLanguage();
    
    // Language menu
    const [langAnchor, setLangAnchor] = useState<null | HTMLElement>(null);

    const getFlag = (lang: Language) => {
        switch (lang) {
            case 'en': return '🇺🇸';
            case 'es': return '🇪🇸';
            case 'nl': return '🇳🇱';
            default: return '🌐';
        }
    };

    const controlButtonStyle = {
        width: 40,
        height: 40,
        borderRadius: 2,
        bgcolor: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.04)',
        '&:hover': {
            bgcolor: isDark ? 'rgba(255,255,255,0.15)' : 'rgba(0,0,0,0.08)',
        }
    };

    return (
        <AppBar
            position="static"
            color="transparent"
            elevation={0}
            sx={{
                bgcolor: isDark ? 'rgba(15, 23, 42, 0.8)' : 'rgba(255, 255, 255, 0.8)',
                backdropFilter: 'blur(12px)',
                borderBottom: `1px solid ${isDark ? 'rgba(255, 255, 255, 0.06)' : 'rgba(0, 0, 0, 0.06)'}`,
                transition: 'all 0.4s ease',
            }}
        >
            <Toolbar sx={{ py: 1, px: { xs: 1, sm: 2, md: 3 }, gap: { xs: 1, sm: 2 } }}>
                {/* Logo & User */}
                <Box sx={{ flexGrow: 1, minWidth: 0 }}>
                    <Typography 
                        variant={isMobile ? 'h6' : 'h5'} 
                        color="primary" 
                        sx={{ fontWeight: 700, letterSpacing: '-0.01em' }}
                    >
                        Kiosk Banking
                    </Typography>
                    {!isMobile && (
                        <Typography 
                            variant="body2" 
                            color="text.secondary" 
                            sx={{ mt: 0.5, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}
                        >
                            {userName}
                        </Typography>
                    )}
                </Box>

                {/* Theme Toggle */}
                <Tooltip title={isDark ? 'Light mode' : 'Dark mode'}>
                    <IconButton
                        onClick={toggleTheme}
                        aria-label={isDark ? 'Switch to light theme' : 'Switch to dark theme'}
                        sx={{ ...controlButtonStyle, color: isDark ? '#38BDF8' : '#F59E0B' }}
                    >
                        {isDark ? <DarkModeIcon /> : <LightModeIcon />}
                    </IconButton>
                </Tooltip>

                {/* Language Selector */}
                <IconButton
                    onClick={(e) => setLangAnchor(e.currentTarget)}
                    aria-label="Change language"
                    sx={{ ...controlButtonStyle, fontSize: 20 }}
                >
                    {getFlag(language)}
                </IconButton>
                <Menu
                    anchorEl={langAnchor}
                    open={Boolean(langAnchor)}
                    onClose={() => setLangAnchor(null)}
                    PaperProps={{
                        sx: { mt: 1, borderRadius: 2, minWidth: 130 }
                    }}
                >
                    {(['en', 'es', 'nl'] as Language[]).map((lang) => (
                        <MenuItem
                            key={lang}
                            selected={language === lang}
                            onClick={() => { setLanguage(lang); setLangAnchor(null); }}
                            sx={{ gap: 1 }}
                        >
                            {getFlag(lang)} {lang === 'en' ? 'English' : lang === 'es' ? 'Español' : 'Nederlands'}
                        </MenuItem>
                    ))}
                </Menu>

                {/* Session Timer */}
                <Chip
                    label={isMobile ? formatTime(timeLeft) : `Session: ${formatTime(timeLeft)}`}
                    color={timeLeft < 60 ? 'error' : 'default'}
                    variant={timeLeft < 60 ? 'filled' : 'outlined'}
                    size={isMobile ? 'small' : 'medium'}
                    sx={{
                        fontWeight: 600,
                        fontSize: isMobile ? '0.75rem' : '0.875rem',
                        fontFamily: '"SF Mono", monospace',
                        flexShrink: 0,
                    }}
                />

                {/* Logout */}
                {isMobile ? (
                    <IconButton color="error" onClick={onLogout} aria-label="Logout" sx={{ flexShrink: 0 }}>
                        <LogoutIcon />
                    </IconButton>
                ) : (
                    <Button
                        variant="outlined"
                        color="error"
                        startIcon={<LogoutIcon />}
                        onClick={onLogout}
                        sx={{ borderRadius: 2, borderWidth: 2, flexShrink: 0, '&:hover': { borderWidth: 2 } }}
                    >
                        Logout
                    </Button>
                )}
            </Toolbar>
        </AppBar>
    );
};

