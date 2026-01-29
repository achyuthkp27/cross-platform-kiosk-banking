import React, { useState } from 'react';
import { Fab, Menu, MenuItem, Box, Typography, Fade } from '@mui/material';
import TranslateIcon from '@mui/icons-material/Translate';
import { useLanguage } from '../../context/LanguageContext';
import { Language } from '../../i18n/translations';
import { usePathname } from 'expo-router';

export default function FloatingLanguageSwitcher() {
    const { language, setLanguage } = useLanguage();
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const open = Boolean(anchorEl);
    const pathname = usePathname();

    // Don't show on landing page (it has its own selector)
    if (pathname === '/') return null;

    const handleClick = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleSelect = (lang: Language) => {
        setLanguage(lang);
        handleClose();
    };

    const getFlag = (lang: Language) => {
        switch (lang) {
            case 'en': return '🇺🇸'; // Or GB
            case 'es': return '🇪🇸';
            case 'nl': return '🇳🇱';
            default: return '🌐';
        }
    };

    const getLabel = (lang: Language) => {
        switch (lang) {
            case 'en': return 'EN';
            case 'es': return 'ES';
            case 'nl': return 'NL';
            default: return 'EN';
        }
    };

    return (
        <>
            <Fab
                color="primary"
                aria-label="change language"
                onClick={handleClick}
                sx={{
                    position: 'absolute',
                    top: 24,
                    right: 24, // Use specific positioning to avoid overlap
                    zIndex: 9999, // Ensure it's above everything
                    width: 56,
                    height: 56,
                    boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
                    bgcolor: 'background.paper',
                    color: 'primary.main',
                    border: '1px solid',
                    borderColor: 'divider',
                    '&:hover': {
                        bgcolor: 'background.paper',
                        transform: 'scale(1.05)',
                    },
                    transition: 'all 0.2s',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                }}
            >
                <Typography variant="h5" sx={{ lineHeight: 1, mb: 0.5 }}>
                    {getFlag(language)}
                </Typography>
                <Typography variant="caption" sx={{ fontWeight: 'bold', fontSize: '0.65rem', lineHeight: 1 }}>
                    {getLabel(language)}
                </Typography>
            </Fab>
            <Menu
                id="language-menu"
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}
                TransitionComponent={Fade}
                PaperProps={{
                    elevation: 4,
                    sx: {
                        mt: 1.5,
                        borderRadius: 4,
                        minWidth: 150,
                        '& .MuiMenuItem-root': {
                            px: 2,
                            py: 1.5,
                            borderRadius: 2,
                            mx: 1,
                            my: 0.5,
                        }
                    }
                }}
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'right',
                }}
                transformOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                }}
            >
                <MenuItem onClick={() => handleSelect('en')} selected={language === 'en'}>
                    <Typography sx={{ mr: 2 }}>🇺🇸</Typography> English
                </MenuItem>
                <MenuItem onClick={() => handleSelect('es')} selected={language === 'es'}>
                    <Typography sx={{ mr: 2 }}>🇪🇸</Typography> Español
                </MenuItem>
                <MenuItem onClick={() => handleSelect('nl')} selected={language === 'nl'}>
                    <Typography sx={{ mr: 2 }}>🇳🇱</Typography> Nederlands
                </MenuItem>
            </Menu>
        </>
    );
}
