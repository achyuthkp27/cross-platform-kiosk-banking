import React, { createContext, useContext, useEffect, useState, useMemo } from 'react';
import { ThemeProvider as MuiThemeProvider, CssBaseline, GlobalStyles } from '@mui/material';
import { getTheme } from '../theme/Theme';

type ThemeMode = 'light' | 'dark';

interface ThemeContextType {
    mode: ThemeMode;
    toggleTheme: () => void;
    setMode: (mode: ThemeMode) => void;
}

const ThemeContext = createContext<ThemeContextType>({
    mode: 'light',
    toggleTheme: () => { },
    setMode: () => { },
});

export const useThemeContext = () => useContext(ThemeContext);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    // Initialize state from local storage or system preference could be added here
    // For now, default to light as per previous behavior, but we'll add persistence
    const [mode, setModeState] = useState<ThemeMode>('light');

    useEffect(() => {
        // Load persistency
        const loadTheme = async () => {
            try {
                // Check if we are in browser environment
                if (typeof window !== 'undefined' && window.localStorage) {
                    const storedTheme = window.localStorage.getItem('kiosk_theme_preference') as ThemeMode;
                    if (storedTheme === 'light' || storedTheme === 'dark') {
                        setModeState(storedTheme);
                    }

                }
            } catch (error) {
                console.error('Failed to load theme preference', error);
            }
        };
        loadTheme();
    }, []);

    const toggleTheme = () => {
        setModeState((prevMode) => {
            const newMode = prevMode === 'light' ? 'dark' : 'light';
            try {
                if (typeof window !== 'undefined' && window.localStorage) {
                    window.localStorage.setItem('kiosk_theme_preference', newMode);
                }
            } catch (e) {
                console.error('Failed to save theme preference', e);
            }
            return newMode;
        });
    };

    const setMode = (newMode: ThemeMode) => {
        setModeState(newMode);
        try {
            if (typeof window !== 'undefined' && window.localStorage) {
                window.localStorage.setItem('kiosk_theme_preference', newMode);
            }
        } catch (e) {
            console.error('Failed to save theme preference', e);
        }
    }

    const theme = useMemo(() => getTheme(mode), [mode]);

    // Global styles that apply the theme background to the entire page
    const globalStyles = useMemo(() => ({
        '*': {
            boxSizing: 'border-box',
        },
        'html, body': {
            margin: 0,
            padding: 0,
            minHeight: '100%',
            width: '100%',
            backgroundColor: theme.palette.background.default,
            color: theme.palette.text.primary,
            transition: 'background-color 0.4s cubic-bezier(0.4, 0, 0.2, 1), color 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
        },
        '#__next, #root, #main': {
            minHeight: '100%',
            width: '100%',
            backgroundColor: 'inherit',
            color: 'inherit',
        },
    }), [theme]);

    return (
        <ThemeContext.Provider value={{ mode, toggleTheme, setMode }}>
            <MuiThemeProvider theme={theme}>
                <CssBaseline />
                <GlobalStyles styles={globalStyles} />
                {children}
            </MuiThemeProvider>
        </ThemeContext.Provider>
    );
};
