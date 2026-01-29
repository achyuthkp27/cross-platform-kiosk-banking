import React, { useRef, useEffect, useCallback } from 'react';
import { Stack } from '@mui/material';
import KioskTextField from './KioskTextField';

interface OTPFieldGroupProps {
    /** Number of OTP digits (default: 6) */
    length?: number;
    /** Current OTP value as array of strings */
    value: string[];
    /** Callback when OTP changes */
    onChange: (newValue: string[]) => void;
    /** Callback when all digits are entered */
    onComplete?: (otp: string) => void;
    /** Whether the inputs are disabled */
    disabled?: boolean;
    /** Whether to auto-focus the first field */
    autoFocus?: boolean;
}

/**
 * A unified OTP input field group component.
 * Handles focus management, character input, and backspace navigation.
 * Works correctly with the virtual keyboard.
 */
export default function OTPFieldGroup({
    length = 6,
    value,
    onChange,
    onComplete,
    disabled = false,
    autoFocus = true
}: OTPFieldGroupProps) {
    const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

    useEffect(() => {
        if (autoFocus && inputRefs.current[0]) {
            inputRefs.current[0].focus();
        }
    }, [autoFocus]);

    const handleChange = useCallback((newValue: string, index: number) => {
        // Only allow single digit numbers
        const digit = newValue.replace(/[^0-9]/g, '').slice(-1);

        const updatedOtp = [...value];
        updatedOtp[index] = digit;
        onChange(updatedOtp);

        // Move to next field if a digit was entered
        if (digit !== '' && index < length - 1) {
            // Small delay to ensure state updates before focus change
            setTimeout(() => {
                inputRefs.current[index + 1]?.focus();
            }, 10);
        }

        // Check completion
        const completedOtp = [...updatedOtp];
        completedOtp[index] = digit;
        if (completedOtp.every(d => d !== '') && onComplete) {
            // Small delay to let the UI update
            setTimeout(() => {
                onComplete(completedOtp.join(''));
            }, 50);
        }
    }, [value, onChange, onComplete, length]);

    const handleKeyDown = useCallback((e: React.KeyboardEvent, index: number) => {
        // Handle backspace to move to previous field
        if (e.key === 'Backspace') {
            if (value[index] === '' && index > 0) {
                // If current field is empty, move to previous and clear it
                const updatedOtp = [...value];
                updatedOtp[index - 1] = '';
                onChange(updatedOtp);
                inputRefs.current[index - 1]?.focus();
                e.preventDefault();
            } else if (value[index] !== '') {
                // Clear current field
                const updatedOtp = [...value];
                updatedOtp[index] = '';
                onChange(updatedOtp);
                e.preventDefault();
            }
        }

        // Handle left arrow to move to previous field
        if (e.key === 'ArrowLeft' && index > 0) {
            inputRefs.current[index - 1]?.focus();
            e.preventDefault();
        }

        // Handle right arrow to move to next field
        if (e.key === 'ArrowRight' && index < length - 1) {
            inputRefs.current[index + 1]?.focus();
            e.preventDefault();
        }
    }, [value, onChange, length]);

    const handleFocus = useCallback((index: number) => {
        // Select the content when focusing
        const input = inputRefs.current[index];
        if (input) {
            input.select();
        }
    }, []);

    return (
        <Stack direction="row" spacing={1.5} justifyContent="center" mb={4}>
            {Array.from({ length }).map((_, index) => (
                <KioskTextField
                    key={index}
                    label=""
                    value={value[index] || ''}
                    keyboardType="numeric"
                    inputRef={(el) => (inputRefs.current[index] = el)}
                    onChange={(e) => handleChange(e.target.value, index)}
                    onKeyDown={(e) => handleKeyDown(e, index)}
                    onFocus={() => handleFocus(index)}
                    disabled={disabled}
                    sx={{
                        width: { xs: 45, sm: 56 },
                        height: { xs: 56, sm: 64 },
                        '& .MuiInputBase-root': {
                            height: '100%',
                            fontSize: { xs: 24, sm: 28 },
                            textAlign: 'center',
                            padding: 0
                        },
                        '& .MuiInputBase-input': {
                            textAlign: 'center',
                            padding: '0 !important',
                            height: '100%',
                            caretColor: 'transparent' // Hide caret for cleaner look
                        },
                        '& .MuiInputLabel-root': {
                            display: 'none'
                        },
                        '& .MuiOutlinedInput-notchedOutline legend': {
                            display: 'none'
                        }
                    }}
                    slotProps={{
                        htmlInput: {
                            maxLength: 1,
                            style: { textAlign: 'center' },
                            inputMode: 'numeric',
                            pattern: '[0-9]*'
                        }
                    }}
                />
            ))}
        </Stack>
    );
}
