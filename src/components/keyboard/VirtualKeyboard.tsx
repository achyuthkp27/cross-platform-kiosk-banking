import React, { useEffect, useState, useMemo } from 'react';
import { Box, Paper, Typography, useTheme, alpha } from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';
import { useKeyboard } from '../../context/KeyboardContext';
import { useLanguage } from '../../context/LanguageContext';
import BackspaceIcon from '@mui/icons-material/Backspace';
import CheckIcon from '@mui/icons-material/Check';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';

/**
 * Premium virtual keyboard key with tactile feedback.
 */
const Key = React.memo(({ label, value, onClick, isSpecial = false, width = 1, isActive = false }: any) => {
    const theme = useTheme();

    return (
        <motion.div
            whileTap={{ scale: 0.94 }}
            animate={isActive ? { scale: 0.94 } : { scale: 1 }}
            onMouseDown={(e) => e.preventDefault()}
            style={{
                flex: width,
                padding: 3,
                height: '100%'
            }}
        >
            <Paper
                elevation={isActive ? 0 : 2}
                onClick={(e) => {
                    e.preventDefault();
                    onClick(value || label);
                }}
                sx={{
                    height: 64,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    bgcolor: isActive
                        ? 'primary.main'
                        : isSpecial
                            ? (theme.palette.mode === 'dark' ? alpha(theme.palette.primary.main, 0.15) : '#E8ECF0')
                            : (theme.palette.mode === 'dark' ? alpha(theme.palette.background.paper, 0.6) : 'background.paper'),
                    color: isActive
                        ? theme.palette.primary.contrastText
                        : isSpecial
                            ? 'text.primary'
                            : 'text.primary',
                    borderRadius: 3,
                    userSelect: 'none',
                    fontWeight: 500,
                    fontSize: '1.25rem',
                    letterSpacing: 0,
                    transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                    boxShadow: isActive
                        ? 'none'
                        : (theme.palette.mode === 'dark' ? '0 4px 12px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.05)' : '0 2px 4px rgba(0,0,0,0.08), 0 1px 2px rgba(0,0,0,0.04)'),
                    border: isActive
                        ? 'none'
                        : (theme.palette.mode === 'dark' ? '1px solid rgba(255,255,255,0.08)' : '1px solid rgba(0,0,0,0.04)'),
                    '&:hover': {
                        bgcolor: isActive
                            ? 'primary.main'
                            : isSpecial
                                ? (theme.palette.mode === 'dark' ? alpha(theme.palette.primary.main, 0.25) : '#DDE2E8')
                                : (theme.palette.mode === 'dark' ? alpha(theme.palette.primary.main, 0.1) : '#F8FAFC'),
                        transform: isActive ? 'none' : 'translateY(-2px)',
                        boxShadow: isActive
                            ? 'none'
                            : (theme.palette.mode === 'dark' ? '0 6px 16px rgba(0,0,0,0.4)' : '0 4px 8px rgba(0,0,0,0.1), 0 2px 4px rgba(0,0,0,0.06)'),
                    },
                    '&:active': {
                        transform: 'translateY(1px)',
                        boxShadow: 'none',
                    }
                }}
            >
                {label}
            </Paper>
        </motion.div>
    );
});

export default function VirtualKeyboard() {
    const theme = useTheme();
    const { isVisible, hideKeyboard, handleKeyPress, layout: currentLayoutType, inputValue, setLayout, label } = useKeyboard();
    const { t } = useLanguage();
    const [activeKey, setActiveKey] = useState<string | null>(null);

    const layouts = useMemo(() => ({
        default: [
            ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0'],
            ['q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p'],
            ['a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l'],
            ['SHIFT', 'z', 'x', 'c', 'v', 'b', 'n', 'm', 'BACKSPACE'],
            ['123', 'SPACE', 'DONE']
        ],
        shift: [
            ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0'],
            ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'],
            ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L'],
            ['SHIFT', 'Z', 'X', 'C', 'V', 'B', 'N', 'M', 'BACKSPACE'],
            ['123', 'SPACE', 'DONE']
        ],
        symbol: [
            ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0'],
            ['@', '#', '$', '%', '&', '*', '-', '+', '(', ')'],
            ['!', '"', "'", ':', ';', '/', '?', ',', '.'],
            ['ABC', 'SPACE', 'BACKSPACE']
        ],
        numeric: [
            ['1', '2', '3'],
            ['4', '5', '6'],
            ['7', '8', '9'],
            ['CLEAR', '0', 'BACKSPACE'],
            ['ABC', 'DONE']
        ]
    }), []);

    const currentKeys = layouts[currentLayoutType === 'symbol' ? 'default' : currentLayoutType] || layouts.default;
    const isNumeric = currentLayoutType === 'numeric';

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (!e.key) return;

            let key = e.key;
            if (key === 'Backspace') key = 'BACKSPACE';
            if (key === 'Enter') key = 'DONE';
            if (key === ' ') key = 'SPACE';
            if (key === 'Escape') key = 'DONE';

            const isVirtualKey = currentKeys.some(row =>
                row.some(k => {
                    if (!k || !key) return false;
                    return k.toUpperCase() === key.toUpperCase() || k === key;
                })
            );

            const isNumericKey = isNumeric && /^[0-9]$/.test(key);

            if (isVirtualKey || isNumericKey || key === 'BACKSPACE' || key === 'SPACE' || key === 'DONE') {
                e.preventDefault();
                setActiveKey(key.length === 1 ? key.toLowerCase() : key);
                handleKeyClick(key);
            }
        };

        const handleKeyUp = () => {
            setActiveKey(null);
        };

        if (isVisible) {
            window.addEventListener('keydown', handleKeyDown);
            window.addEventListener('keyup', handleKeyUp);
        }

        return () => {
            window.removeEventListener('keydown', handleKeyDown);
            window.removeEventListener('keyup', handleKeyUp);
        };
    }, [currentKeys, isNumeric, handleKeyPress, hideKeyboard, setLayout, currentLayoutType, isVisible]);

    const handleKeyClick = (key: string) => {
        if (key === '123') {
            setLayout('numeric');
        } else if (key === 'ABC') {
            setLayout('default');
        } else if (key === 'SHIFT') {
            setLayout(currentLayoutType === 'default' ? 'shift' : 'default');
        } else if (key === 'DONE') {
            hideKeyboard();
        } else {
            handleKeyPress(key);
        }
    };

    if (!isVisible) return null;

    return (
        <AnimatePresence>
            {isVisible && (
                <motion.div
                    initial={{ y: '100%', opacity: 0.8 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: '100%', opacity: 0 }}
                    transition={{
                        type: 'spring',
                        damping: 28,
                        stiffness: 350,
                        mass: 0.8
                    }}
                    style={{
                        position: 'fixed',
                        bottom: 0,
                        left: 0,
                        right: 0,
                        zIndex: 1300,
                        pointerEvents: 'none',
                        display: 'flex',
                        justifyContent: 'center',
                        paddingLeft: 16,
                        paddingRight: 16,
                        paddingBottom: 0,
                    }}
                >
                    <Paper
                        elevation={0}
                        sx={{
                            p: 2.5,
                            pt: 2,
                            borderRadius: '24px 24px 0 0',
                            background: theme.palette.mode === 'dark'
                                ? alpha(theme.palette.background.default, 0.85)
                                : alpha('#F1F5F9', 0.85),
                            backdropFilter: 'blur(30px)',
                            pointerEvents: 'auto',
                            maxWidth: '1000px',
                            width: '100%',
                            boxShadow: theme.palette.mode === 'dark'
                                ? '0 -20px 60px rgba(0, 0, 0, 0.6), inset 0 1px 0 rgba(255, 255, 255, 0.1)'
                                : '0 -20px 60px rgba(0, 0, 0, 0.15), inset 0 1px 0 rgba(255, 255, 255, 0.8)',
                            border: theme.palette.mode === 'dark'
                                ? '1px solid rgba(255, 255, 255, 0.05)'
                                : '1px solid rgba(255, 255, 255, 0.4)',
                            borderBottom: 'none',
                            transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                        }}
                    >
                        {/* Input Preview Header */}
                        <Box sx={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            mb: 2,
                            px: 2,
                            py: 1.5,
                            bgcolor: theme.palette.mode === 'dark' ? 'rgba(15, 23, 42, 0.8)' : 'white',
                            borderRadius: 3,
                            boxShadow: theme.palette.mode === 'dark'
                                ? 'inset 0 1px 3px rgba(0,0,0,0.3)'
                                : 'inset 0 1px 3px rgba(0,0,0,0.06)',
                            border: theme.palette.mode === 'dark'
                                ? '1px solid rgba(255,255,255,0.1)'
                                : '1px solid rgba(0,0,0,0.04)',
                            maxWidth: isNumeric ? 400 : '100%',
                            mx: 'auto'
                        }}>
                            <Typography
                                variant="caption"
                                sx={{
                                    color: theme.palette.mode === 'dark' ? '#94A3B8' : 'text.secondary',
                                    fontWeight: 500,
                                    letterSpacing: 0.5,
                                    textTransform: 'uppercase',
                                    fontSize: '0.65rem'
                                }}
                            >
                                {label || 'Input'}
                            </Typography>
                            <Typography
                                variant="h6"
                                sx={{
                                    fontWeight: 500,
                                    letterSpacing: 1,
                                    fontFamily: '"SF Mono", "Monaco", monospace',
                                    color: inputValue
                                        ? (theme.palette.mode === 'dark' ? '#F8FAFC' : 'text.primary')
                                        : (theme.palette.mode === 'dark' ? '#64748B' : 'text.disabled'),
                                    minWidth: 100,
                                    textAlign: 'right'
                                }}
                            >
                                {inputValue || '—'}
                            </Typography>
                        </Box>

                        {/* Keyboard Grid */}
                        <Box sx={{
                            display: 'flex',
                            flexDirection: 'column',
                            gap: 0.5,
                            maxWidth: isNumeric ? 320 : 900,
                            mx: 'auto'
                        }}>
                            {currentKeys.map((row, rowIndex) => (
                                <Box
                                    key={rowIndex}
                                    sx={{
                                        display: 'flex',
                                        gap: 0.5,
                                        justifyContent: 'center'
                                    }}
                                >
                                    {row.map((key, keyIndex) => {
                                        let keyLabel: React.ReactNode = key;
                                        let width = 1;
                                        let isSpecial = false;

                                        if (key === 'SPACE') {
                                            keyLabel = <Typography sx={{ fontSize: '0.875rem', fontWeight: 500, letterSpacing: 1 }}>SPACE</Typography>;
                                            width = 4;
                                        } else if (key === 'BACKSPACE') {
                                            keyLabel = <BackspaceIcon sx={{ fontSize: 24 }} />;
                                            isSpecial = true;
                                            width = 1.5;
                                        } else if (key === 'SHIFT') {
                                            keyLabel = <KeyboardArrowUpIcon sx={{ fontSize: 26 }} />;
                                            isSpecial = true;
                                            width = 1.5;
                                        } else if (key === 'DONE') {
                                            keyLabel = <CheckIcon sx={{ fontSize: 26, color: 'primary.main' }} />;
                                            isSpecial = true;
                                            width = 1.5;
                                        } else if (key === 'CLEAR') {
                                            keyLabel = <Typography sx={{ fontSize: '0.75rem', fontWeight: 600 }}>CLEAR</Typography>;
                                            isSpecial = true;
                                        } else if (key === '123' || key === 'ABC') {
                                            keyLabel = <Typography sx={{ fontSize: '0.875rem', fontWeight: 600 }}>{key}</Typography>;
                                            isSpecial = true;
                                            width = 1.5;
                                        }

                                        const isActive = activeKey === key.toLowerCase() ||
                                            (key === 'SPACE' && activeKey === 'SPACE') ||
                                            (key === 'BACKSPACE' && activeKey === 'BACKSPACE') ||
                                            (key === 'DONE' && activeKey === 'DONE');

                                        return (
                                            <Key
                                                key={keyIndex}
                                                label={keyLabel}
                                                value={key}
                                                width={width}
                                                isSpecial={isSpecial}
                                                isActive={isActive}
                                                onClick={handleKeyClick}
                                            />
                                        );
                                    })}
                                </Box>
                            ))}
                        </Box>
                    </Paper>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
