import React from 'react';
import { IconButton, Box, useTheme } from '@mui/material';
import { motion } from 'framer-motion';
import { useThemeContext } from '../../context/ThemeContext';
import LightModeIcon from '@mui/icons-material/LightMode';
import DarkModeIcon from '@mui/icons-material/DarkMode';

interface ThemeToggleProps {
    sx?: any;
    inline?: boolean; // When true, uses relative positioning for inline layouts
}

const ThemeToggle = ({ sx, inline = false }: ThemeToggleProps) => {
    const theme = useTheme();
    const { mode, toggleTheme } = useThemeContext();
    const isDark = mode === 'dark';

    const buttonElement = (
        <IconButton
            onClick={toggleTheme}
            sx={{
                width: 56,
                height: 56,
                borderRadius: '50%',
                backgroundColor: isDark ? 'rgba(15, 23, 42, 0.6)' : 'rgba(255, 255, 255, 0.8)',
                backdropFilter: 'blur(20px)',
                border: '1px solid',
                borderColor: isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(255, 255, 255, 0.5)',
                boxShadow: isDark
                    ? '0 0 30px rgba(56, 189, 248, 0.15), inset 0 0 20px rgba(56, 189, 248, 0.05)'
                    : '0 8px 30px rgba(0, 0, 0, 0.08), inset 0 0 20px rgba(255, 255, 255, 0.8)',
                overflow: 'hidden',
                transition: 'all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)',
                '&:hover': {
                    backgroundColor: isDark ? 'rgba(15, 23, 42, 0.8)' : 'rgba(255, 255, 255, 0.95)',
                    transform: 'scale(1.1)',
                    boxShadow: isDark
                        ? '0 0 40px rgba(56, 189, 248, 0.3), inset 0 0 20px rgba(56, 189, 248, 0.1)'
                        : '0 12px 40px rgba(0, 0, 0, 0.12), inset 0 0 20px rgba(255, 255, 255, 0.9)',
                },
                '&:active': {
                    transform: 'scale(0.9)',
                }
            }}
        >
            {/* Moon Icon Container */}
            <motion.div
                animate={{
                    scale: isDark ? 1 : 0.5,
                    rotate: isDark ? 0 : 90,
                    opacity: isDark ? 1 : 0,
                }}
                transition={{ duration: 0.5, ease: [0.34, 1.56, 0.64, 1] }}
                style={{ position: 'absolute', zIndex: 1 }}
            >
                <DarkModeIcon
                    sx={{
                        fontSize: 32,
                        color: '#38BDF8',
                    }}
                />
            </motion.div>

            {/* Sun Icon Container */}
            <motion.div
                animate={{
                    scale: isDark ? 0.5 : 1,
                    rotate: isDark ? -90 : 0,
                    opacity: isDark ? 0 : 1,
                }}
                transition={{ duration: 0.5, ease: [0.34, 1.56, 0.64, 1] }}
                style={{ position: 'absolute', zIndex: 1 }}
            >
                <LightModeIcon
                    sx={{
                        fontSize: 32,
                        color: '#F59E0B',
                    }}
                />
            </motion.div>
        </IconButton>
    );

    // Inline mode for use inside flex containers
    if (inline) {
        return buttonElement;
    }

    // Absolute positioning mode (default)
    return (
        <Box
            sx={{
                position: 'absolute',
                top: 24,
                right: 96, // Language switcher (24 + 56 + 16 gap)
                zIndex: 2000,
                ...sx,
            }}
        >
            {buttonElement}
        </Box>
    );
};

export default ThemeToggle;
