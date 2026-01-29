import React from 'react';
import { Select, MenuItem, FormControl, SelectChangeEvent, Box, Typography } from '@mui/material';
import { useLanguage } from '../../context/LanguageContext';
import { Language } from '../../i18n/translations';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';

export default function LanguageSelector() {
    const { language, setLanguage } = useLanguage();

    const handleChange = (event: SelectChangeEvent) => {
        setLanguage(event.target.value as Language);
    };

    return (
        <FormControl sx={{ minWidth: 150 }}>
            <Select
                value={language}
                onChange={handleChange}
                displayEmpty
                IconComponent={KeyboardArrowDownIcon}
                sx={{
                    borderRadius: '50px',
                    bgcolor: 'rgba(255, 255, 255, 0.9)',
                    backdropFilter: 'blur(10px)',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                    '& .MuiSelect-select': {
                        py: 1.5,
                        px: 3,
                        display: 'flex',
                        alignItems: 'center',
                        fontWeight: 600,
                    },
                    '& fieldset': { border: 'none' }, // Remove default border
                    '&:hover': {
                        bgcolor: 'white',
                    }
                }}
                MenuProps={{
                    PaperProps: {
                        sx: {
                            mt: 1,
                            borderRadius: 3,
                            boxShadow: '0 8px 24px rgba(0,0,0,0.15)',
                            '& .MuiMenuItem-root': {
                                py: 1.5,
                                px: 2,
                                mx: 1,
                                my: 0.5,
                                borderRadius: 2,
                            }
                        }
                    }
                }}
            >
                <MenuItem value="en">
                    <Typography component="span" sx={{ mr: 1.5 }}>🇺🇸</Typography> English
                </MenuItem>
                <MenuItem value="es">
                    <Typography component="span" sx={{ mr: 1.5 }}>🇪🇸</Typography> Español
                </MenuItem>
                <MenuItem value="nl">
                    <Typography component="span" sx={{ mr: 1.5 }}>🇳🇱</Typography> Nederlands
                </MenuItem>
            </Select>
        </FormControl>
    );
}
