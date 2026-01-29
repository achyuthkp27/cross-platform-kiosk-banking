import React, { useId, useEffect } from 'react';
import { TextField, TextFieldProps, alpha, useTheme } from '@mui/material';
import { useKeyboard } from '../context/KeyboardContext';
import { useThemeContext } from '../context/ThemeContext';

interface KioskTextFieldProps extends Omit<TextFieldProps, 'value' | 'onChange'> {
    value: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    keyboardType?: 'default' | 'numeric';
}

/**
 * Premium text field integrated with virtual keyboard.
 * Features focus glow, smooth transitions, and enhanced styling.
 * Fully theme-aware for dark/light modes.
 */
export default function KioskTextField({
    value,
    onChange,
    keyboardType = 'default',
    label,
    ...props
}: KioskTextFieldProps) {
    const theme = useTheme();
    const { mode } = useThemeContext();
    const isDark = mode === 'dark';
    const fieldId = useId();
    const { showKeyboard, hideKeyboard, setInputValue, isVisible } = useKeyboard();

    const [isFocused, setIsFocused] = React.useState(false);

    // Sync formatted value back to keyboard preview
    // This ensures that when parent applies formatting (e.g., DD/MM/YYYY for DOB),
    // the keyboard preview shows the formatted value instead of raw input
    useEffect(() => {
        if (isVisible && isFocused) {
            setInputValue(value);
        }
    }, [value, isVisible, setInputValue, isFocused]);

    const handleFocus = () => {
        setIsFocused(true);
        const labelStr = typeof label === 'string' ? label : 'Input';
        showKeyboard(
            keyboardType,
            value,
            (newValue: string) => {
                onChange({ target: { value: newValue } } as any);
            },
            undefined,
            labelStr,
            fieldId
        );
    };

    const handleBlur = () => {
        setIsFocused(false);
        hideKeyboard(fieldId);
    };

    return (
        <TextField
            value={value}
            onChange={onChange}
            onFocus={handleFocus}
            onBlur={handleBlur}
            label={label}
            variant="outlined"
            inputProps={{
                inputMode: 'none',
                ...props.inputProps,
            }}
            sx={{
                '& .MuiOutlinedInput-root': {
                    borderRadius: 3,
                    fontSize: '1.125rem',
                    bgcolor: isDark ? 'rgba(15, 23, 42, 0.6)' : 'white',
                    transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                    '& fieldset': {
                        borderWidth: 2,
                        borderColor: isDark ? 'rgba(255, 255, 255, 0.15)' : theme.palette.divider,
                        transition: 'all 0.2s ease',
                    },
                    '&:hover fieldset': {
                        borderColor: theme.palette.primary.light,
                    },
                    '&.Mui-focused': {
                        boxShadow: `0 0 0 4px ${alpha(theme.palette.primary.main, isDark ? 0.2 : 0.1)}`,
                    },
                    '&.Mui-focused fieldset': {
                        borderColor: theme.palette.primary.main,
                        borderWidth: 2,
                    },
                    '&.Mui-error fieldset': {
                        borderColor: theme.palette.error.main,
                    },
                    '&.Mui-error.Mui-focused': {
                        boxShadow: `0 0 0 4px ${alpha(theme.palette.error.main, 0.1)}`,
                    },
                },
                '& .MuiInputBase-input': {
                    padding: '16px 18px',
                    fontSize: '1.125rem',
                    fontWeight: 500,
                    color: isDark ? '#F8FAFC' : '#0F172A',
                    '&::placeholder': {
                        color: isDark ? 'rgba(148, 163, 184, 0.6)' : 'rgba(100, 116, 139, 0.6)',
                        opacity: 1,
                    },
                },
                '& .MuiInputLabel-root': {
                    fontSize: '1rem',
                    fontWeight: 500,
                    color: isDark ? 'rgba(148, 163, 184, 0.8)' : undefined,
                    '&.Mui-focused': {
                        color: theme.palette.primary.main,
                        fontWeight: 600,
                    },
                },
                '& .MuiFormHelperText-root': {
                    fontSize: '0.875rem',
                    fontWeight: 500,
                    marginLeft: 1,
                    marginTop: 1,
                },
                ...props.sx,
            }}
            {...props}
        />
    );
}
