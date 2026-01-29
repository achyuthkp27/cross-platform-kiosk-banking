import React, { useEffect } from 'react';
import { Stack, useRouter, useRootNavigationState, usePathname } from 'expo-router';
import { ThemeProvider } from '../src/context/ThemeContext';
import { KeyboardProvider } from '../src/context/KeyboardContext';
import VirtualKeyboard from '../src/components/keyboard/VirtualKeyboard';
import { LanguageProvider } from '../src/context/LanguageContext';
import { SessionProvider } from '../src/context/SessionContext';
import FloatingLanguageSwitcher from '../src/components/language/FloatingLanguageSwitcher';
import ThemeToggle from '../src/components/theme/ThemeToggle';
import ErrorBoundary from '../src/components/ErrorBoundary';

export default function RootLayout() {
    const router = useRouter();
    const rootNavigationState = useRootNavigationState();
    const pathname = usePathname();

    useEffect(() => {
        // Ensure navigation is ready before redirecting
        if (rootNavigationState?.key) {
            const timer = setTimeout(() => {
                if (pathname !== '/') {
                    router.replace('/');
                }
            }, 50);
            return () => clearTimeout(timer);
        }
    }, [rootNavigationState?.key]);

    return (
        <ErrorBoundary>
            <ThemeProvider>
                <LanguageProvider>
                    <KeyboardProvider>
                        <SessionProvider>
                            <Stack screenOptions={{ headerShown: false }}>
                                <Stack.Screen name="index" />
                            </Stack>
                            {pathname !== '/' && <ThemeToggle />}
                            <VirtualKeyboard />
                            <FloatingLanguageSwitcher />
                        </SessionProvider>
                    </KeyboardProvider>
                </LanguageProvider>
            </ThemeProvider>
        </ErrorBoundary>
    );
}
