import React, { useRef, useEffect, useState, useId } from 'react';
import { Stack, TextField, alpha, Box, useTheme } from '@mui/material';
import { motion } from 'framer-motion';
import { useKeyboard } from '../context/KeyboardContext';
import { useThemeContext } from '../context/ThemeContext';

interface OTPFieldGroupProps {
    length?: number;
    value: string[];
    onChange: (value: string[]) => void;
    onComplete?: (otp: string) => void;
    disabled?: boolean;
    autoFocus?: boolean;
}

/**
 * Premium OTP input field group with focus glow and completion states.
 */
export default function OTPFieldGroup({
    length = 6,
    value,
    onChange,
    onComplete,
    disabled = false,
    autoFocus = true
}: OTPFieldGroupProps) {
    const theme = useTheme();
    const { mode } = useThemeContext();
    const isDark = mode === 'dark';
    const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
    const [activeIndex, setActiveIndex] = useState<number | null>(null);
    const { showKeyboard, hideKeyboard } = useKeyboard();
    const [isComplete, setIsComplete] = useState(false);
    const fieldId = useId();

    // Check if OTP is complete
    useEffect(() => {
        const complete = value.every(v => v.length === 1) && value.length === length;
        setIsComplete(complete);
    }, [value, length]);

    // Auto-focus first field
    useEffect(() => {
        if (autoFocus && inputRefs.current[0]) {
            setTimeout(() => {
                inputRefs.current[0]?.focus();
            }, 500);
        }
    }, [autoFocus]);

    const handleChange = (newValue: string, index: number) => {
        if (!/^\d*$/.test(newValue)) return;

        const newOtp = [...value];
        newOtp[index] = newValue.slice(-1);
        onChange(newOtp);

        // Move to next field
        if (newValue && index < length - 1) {
            setTimeout(() => {
                inputRefs.current[index + 1]?.focus();
            }, 50);
        }

        // Check completion
        if (newValue && index === length - 1) {
            const finalOtp = newOtp.join('');
            if (finalOtp.length === length && onComplete) {
                onComplete(finalOtp);
            }
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent, index: number) => {
        if (e.key === 'Backspace') {
            e.preventDefault();
            const newOtp = [...value];

            if (value[index]) {
                newOtp[index] = '';
                onChange(newOtp);
            } else if (index > 0) {
                newOtp[index - 1] = '';
                onChange(newOtp);
                setTimeout(() => {
                    inputRefs.current[index - 1]?.focus();
                }, 30);
            }
        } else if (e.key === 'ArrowLeft' && index > 0) {
            e.preventDefault();
            inputRefs.current[index - 1]?.focus();
        } else if (e.key === 'ArrowRight' && index < length - 1) {
            e.preventDefault();
            inputRefs.current[index + 1]?.focus();
        }
    };

    const handleFocus = (index: number) => {
        setActiveIndex(index);

        // Show numeric keyboard with callback for this specific field
        showKeyboard(
            'numeric',
            value[index] || '',
            (newValue: string) => {
                // Handle keyboard input
                const key = newValue.slice(-1);
                if (key && /^\d$/.test(key)) {
                    handleChange(key, index);
                } else if (newValue === '') {
                    // Backspace was pressed
                    handleKeyDown({ key: 'Backspace', preventDefault: () => { } } as React.KeyboardEvent, index);
                }
            },
            1, // maxLength of 1 for OTP digits
            `OTP Digit ${index + 1}`,
            `${fieldId}-${index}`
        );
    };

    const handleBlur = (index: number) => {
        setActiveIndex(null);
        setTimeout(() => {
            const isAnyFieldFocused = inputRefs.current.some(
                ref => ref === document.activeElement
            );
            if (!isAnyFieldFocused) {
                hideKeyboard(`${fieldId}-${index}`);
            }
        }, 100);
    };

    return (
        <Stack
            direction="row"
            spacing={1.5}
            justifyContent="center"
            role="group"
            aria-label="OTP input fields"
            sx={{ mb: 4, mt: 2 }}
        >
            {Array.from({ length }).map((_, index) => {
                const isFilled = value[index]?.length === 1;
                const isActive = activeIndex === index;

                return (
                    <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05, duration: 0.3 }}
                    >
                        <Box
                            sx={{
                                position: 'relative',
                                // Glow effect
                                '&::before': isActive ? {
                                    content: '""',
                                    position: 'absolute',
                                    top: -4,
                                    left: -4,
                                    right: -4,
                                    bottom: -4,
                                    borderRadius: 3,
                                    background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.15)}, ${alpha(theme.palette.secondary.main, 0.1)})`,
                                    filter: 'blur(8px)',
                                    zIndex: -1,
                                } : {},
                            }}
                        >
                            <TextField
                                inputRef={(el) => (inputRefs.current[index] = el)}
                                value={value[index] || ''}
                                onChange={(e) => handleChange(e.target.value, index)}
                                onKeyDown={(e) => handleKeyDown(e, index)}
                                onFocus={() => handleFocus(index)}
                                onBlur={() => handleBlur(index)}
                                disabled={disabled}
                                inputProps={{
                                    maxLength: 1,
                                    style: {
                                        textAlign: 'center',
                                        fontSize: '2rem',
                                        fontWeight: 700,
                                        padding: '16px 0',
                                        caretColor: 'transparent',
                                        fontFamily: '"SF Mono", Monaco, monospace',
                                    },
                                    inputMode: 'none',
                                }}
                                sx={{
                                    width: 64,
                                    '& .MuiOutlinedInput-root': {
                                        borderRadius: 3,
                                        bgcolor: isFilled
                                            ? alpha(theme.palette.primary.main, 0.04)
                                            : (isDark ? 'rgba(15, 23, 42, 0.6)' : 'white'),
                                        transition: 'all 0.2s ease',
                                        '& fieldset': {
                                            borderWidth: 2,
                                            borderColor: isComplete
                                                ? theme.palette.success.main
                                                : isFilled
                                                    ? theme.palette.primary.main
                                                    : theme.palette.divider,
                                        },
                                        '&:hover fieldset': {
                                            borderColor: isComplete
                                                ? theme.palette.success.main
                                                : theme.palette.primary.light,
                                        },
                                        '&.Mui-focused': {
                                            boxShadow: `0 0 0 4px ${alpha(theme.palette.primary.main, 0.1)}`,
                                        },
                                        '&.Mui-focused fieldset': {
                                            borderColor: theme.palette.primary.main,
                                            borderWidth: 2,
                                        },
                                    },
                                    '& .MuiInputBase-input': {
                                        color: isComplete ? theme.palette.success.dark : theme.palette.text.primary,
                                    }
                                }}
                            />
                        </Box>
                    </motion.div>
                );
            })}
        </Stack>
    );
}
