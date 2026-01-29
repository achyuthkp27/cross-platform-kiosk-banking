import React, { createContext, useContext, useState, useCallback, useRef } from 'react';

type KeyboardLayout = 'default' | 'numeric' | 'shift' | 'symbol';

interface KeyboardContextType {
    isVisible: boolean;
    layout: KeyboardLayout;
    maxLength?: number;
    showKeyboard: (layout?: KeyboardLayout, initialValue?: string, onChange?: (value: string) => void, maxLength?: number, label?: string, fieldId?: string) => void;
    hideKeyboard: (fieldId?: string) => void;
    handleKeyPress: (key: string) => void;
    setLayout: (layout: KeyboardLayout) => void;
    setInputValue: (value: string) => void;
    inputValue: string;
    label: string;
}

const KeyboardContext = createContext<KeyboardContextType | null>(null);

export function useKeyboard() {
    const context = useContext(KeyboardContext);
    if (!context) {
        throw new Error('useKeyboard must be used within a KeyboardProvider');
    }
    return context;
}

export function KeyboardProvider({ children }: { children: React.ReactNode }) {
    const [isVisible, setIsVisible] = useState(false);
    const [layout, setLayout] = useState<KeyboardLayout>('default');
    const [inputValue, setInputValue] = useState('');
    const [label, setLabel] = useState('');
    const [maxLength, setMaxLength] = useState<number | undefined>(undefined);

    // We hold a reference to the onChange handler of the currently focused input
    const onChangeRef = useRef<((value: string) => void) | undefined>(undefined);
    const hideTimeoutRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
    const activeFieldIdRef = useRef<string | null>(null);

    const showKeyboard = useCallback((
        newLayout: KeyboardLayout = 'default',
        initialValue: string = '',
        onChange?: (value: string) => void,
        limit?: number,
        newLabel: string = '',
        fieldId?: string
    ) => {
        if (fieldId) {
            activeFieldIdRef.current = fieldId;
        }
        if (hideTimeoutRef.current) {
            clearTimeout(hideTimeoutRef.current);
            hideTimeoutRef.current = undefined;
        }
        setLayout(newLayout);
        setInputValue(initialValue);
        setMaxLength(limit);
        setLabel(newLabel);
        onChangeRef.current = onChange;
        setIsVisible(true);
    }, []);

    const hideKeyboard = useCallback((fieldId?: string) => {
        hideTimeoutRef.current = setTimeout(() => {
            // If a fieldId was provided for the hide request, check if it's still the active one
            if (fieldId && activeFieldIdRef.current !== fieldId) {
                return;
            }
            setIsVisible(false);
            onChangeRef.current = undefined;
            setMaxLength(undefined);
            setLabel('');
            activeFieldIdRef.current = null;
        }, 100);
    }, []);

    const handleKeyPress = useCallback((key: string) => {
        let newValue = inputValue;

        if (key === 'BACKSPACE') {
            newValue = inputValue.slice(0, -1);
        } else if (key === 'CLEAR') {
            newValue = '';
        } else if (key === 'SPACE') {
            if (!maxLength || inputValue.length < maxLength) {
                newValue = inputValue + ' ';
            }
        } else {
            // Logic for maxLength
            if (maxLength !== undefined) {
                if (maxLength === 1) {
                    // Special case for OTP/PIN: Replace value
                    newValue = key;
                } else if (inputValue.length < maxLength) {
                    newValue = inputValue + key;
                }
                // Else: ignore key press (limit reached)
            } else {
                newValue = inputValue + key;
            }
        }

        setInputValue(newValue);
        if (onChangeRef.current) {
            onChangeRef.current(newValue);
        }
    }, [inputValue, maxLength]);

    return (
        <KeyboardContext.Provider value={{
            isVisible,
            layout,
            maxLength,
            showKeyboard,
            hideKeyboard,
            handleKeyPress,
            setLayout,
            setInputValue,
            inputValue,
            label
        }}>
            {children}
        </KeyboardContext.Provider>
    );
}
