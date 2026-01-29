import React from 'react';
import { TextField, TextFieldProps } from '@mui/material';
import { useKeyboard } from '../context/KeyboardContext';

type KioskTextFieldProps = TextFieldProps & {
    keyboardType?: 'default' | 'numeric';
};

export default function KioskTextField(props: KioskTextFieldProps) {
    const { keyboardType = 'default', onFocus, onChange, value, ...other } = props;
    const { showKeyboard, hideKeyboard, setInputValue } = useKeyboard();
    const [isFocused, setIsFocused] = React.useState(false);
    const fieldId = React.useRef(Math.random().toString(36).substring(2, 9)).current;

    // Sync external value changes to the virtual keyboard internal state when focused
    React.useEffect(() => {
        if (isFocused) {
            setInputValue(String(value || ''));
        }
    }, [value, isFocused, setInputValue]);

    const handleFocus = (event: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setIsFocused(true);
        // Don't show keyboard for select fields
        if (props.select) {
            if (onFocus) onFocus(event);
            return;
        }

        // Check for maxLength in inputProps or slotProps
        const maxLength = props.inputProps?.maxLength || (props.slotProps?.htmlInput as any)?.maxLength;

        showKeyboard(
            keyboardType === 'numeric' ? 'numeric' : 'default',
            String(value || ''),
            (newValue) => {
                if (props.onChange) {
                    // Create a synthetic event
                    const syntheticEvent = {
                        target: { value: newValue },
                        currentTarget: { value: newValue }
                    } as React.ChangeEvent<HTMLInputElement>;
                    props.onChange(syntheticEvent);
                }
            },
            maxLength as number | undefined,
            (props.label as string) || props.placeholder,
            fieldId
        );

        if (onFocus) {
            onFocus(event);
        }
    };

    const handleBlur = (event: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setIsFocused(false);
        if (!props.select) {
            hideKeyboard(fieldId);
        }
        if (other.onBlur) {
            other.onBlur(event);
        }
    };

    return (
        <TextField
            {...other}
            value={value}
            onFocus={handleFocus}
            onBlur={handleBlur}
            InputLabelProps={{
                shrink: isFocused || (typeof value === 'string' && value.length > 0) || !!other.InputLabelProps?.shrink,
                ...other.InputLabelProps,
            }}
            slotProps={{
                htmlInput: {
                    inputMode: 'none', // vital for suppressing native keyboard
                    ...props.slotProps?.htmlInput
                }
            }}
        />
    );
}
