import React, { useEffect, useState, useMemo } from 'react';
import { Box, Paper, Typography, useTheme } from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';
import { useKeyboard } from '../../context/KeyboardContext';
import { useLanguage } from '../../context/LanguageContext';
import BackspaceIcon from '@mui/icons-material/Backspace';
import SpaceBarIcon from '@mui/icons-material/SpaceBar';
import CheckIcon from '@mui/icons-material/Check';
import TranslateIcon from '@mui/icons-material/Translate';

const Key = React.memo(({ label, value, onClick, isSpecial = false, width = 1, isActive = false }: any) => {
    return (
        <motion.div
            whileTap={{ scale: 0.95 }}
            animate={isActive ? { scale: 0.95 } : { scale: 1 }}
            onMouseDown={(e) => e.preventDefault()} // Prevent focus loss from the input field
            style={{
                flex: width,
                padding: 4,
                height: '100%'
            }}
        >
            <Paper
                elevation={isActive ? 0 : 1}
                onClick={(e) => {
                    e.preventDefault();
                    onClick(value || label);
                }}
                sx={{
                    height: 56, // Large touch target
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    bgcolor: isActive ? 'primary.light' : (isSpecial ? 'background.default' : 'background.paper'),
                    color: isActive ? 'primary.contrastText' : (isSpecial ? 'text.secondary' : 'text.primary'),
                    borderRadius: 2,
                    userSelect: 'none',
                    transition: 'background-color 0.1s, color 0.1s',
                    '&:hover': {
                        bgcolor: isActive ? 'primary.light' : (isSpecial ? 'action.hover' : 'background.paper')
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
    const [pressedKeys, setPressedKeys] = useState<Set<string>>(new Set());

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

    // Derived state
    const currentKeys = layouts[currentLayoutType === 'symbol' ? 'default' : currentLayoutType] || layouts.default;
    const isNumeric = currentLayoutType === 'numeric';

    const [activeKey, setActiveKey] = useState<string | null>(null);

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            // Skip if key is undefined or null
            if (!e.key) return;

            let key = e.key;
            if (key === 'Backspace') key = 'BACKSPACE';
            if (key === 'Enter') key = 'DONE';
            if (key === ' ') key = 'SPACE';
            if (key === 'Escape') key = 'DONE';

            // Find if this key exists in our virtual keyboard
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
                    initial={{ y: '100%' }}
                    animate={{ y: 0 }}
                    exit={{ y: '100%' }}
                    transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                    style={{
                        position: 'fixed',
                        bottom: 0,
                        left: 0,
                        right: 0,
                        zIndex: 1300,
                        pointerEvents: 'none',
                        display: 'flex',
                        justifyContent: 'center',
                        padding: 20
                    }}
                >
                    <Paper
                        elevation={12}
                        sx={{
                            p: 2,
                            borderRadius: '24px 24px 0 0',
                            bgcolor: '#f5f5f5',
                            pointerEvents: 'auto',
                            maxWidth: '1000px',
                            width: '100%'
                        }}
                    >
                        {/* Input Preview */}
                        <Box sx={{
                            display: 'flex',
                            justifyContent: 'center',
                            mb: 2,
                            p: 1,
                            bgcolor: 'background.default',
                            borderRadius: 2,
                            border: '1px solid',
                            borderColor: 'divider',
                            maxWidth: isNumeric ? 400 : 900,
                            mx: 'auto'
                        }}>
                            <Typography variant="h5" sx={{ fontWeight: 'medium', letterSpacing: 1, minHeight: 32 }}>
                                {inputValue || <span style={{ opacity: 0.3 }}>{label || 'Target Input...'}</span>}
                            </Typography>
                        </Box>

                        <Box sx={{
                            display: 'flex',
                            flexDirection: 'column',
                            gap: 1,
                            maxWidth: isNumeric ? 400 : 900,
                            mx: 'auto'
                        }}>
                            {currentKeys.map((row, rowIndex) => (
                                <Box key={rowIndex} sx={{ display: 'flex', gap: 1, justifyContent: 'center' }}>
                                    {row.map((key, keyIndex) => {
                                        let label: React.ReactNode = key;
                                        let width = 1;
                                        let isSpecial = false;

                                        if (key === 'SPACE') {
                                            label = t('keyboard.space');
                                            width = 4;
                                        } else if (key === 'BACKSPACE') {
                                            label = <BackspaceIcon />;
                                            isSpecial = true;
                                            width = 1.5;
                                        } else if (key === 'SHIFT') {
                                            label = <Typography variant="button">{t('keyboard.shift')}</Typography>;
                                            isSpecial = true;
                                            width = 1.5;
                                        } else if (key === 'DONE') {
                                            label = <CheckIcon color="primary" />;
                                            isSpecial = true;
                                            width = 1.5;
                                        } else if (key === 'CLEAR') {
                                            label = t('keyboard.clear');
                                            isSpecial = true;
                                        } else if (key === '123' || key === 'ABC') {
                                            isSpecial = true;
                                            width = 1.5;
                                        }

                                        const isActive = activeKey === key.toLowerCase() || (key === 'SPACE' && activeKey === 'SPACE') || (key === 'BACKSPACE' && activeKey === 'BACKSPACE') || (key === 'DONE' && activeKey === 'DONE');

                                        return (
                                            <Key
                                                key={keyIndex}
                                                label={label}
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
