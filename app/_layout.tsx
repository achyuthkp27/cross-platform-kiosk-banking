import React, { useEffect } from 'react';
import { Stack, useRouter, useRootNavigationState, usePathname } from 'expo-router';
import { ThemeProvider } from '../src/context/ThemeContext';
import { KeyboardProvider } from '../src/context/KeyboardContext';
import VirtualKeyboard from '../src/components/keyboard/VirtualKeyboard';
import { LanguageProvider } from '../src/context/LanguageContext';
import { SessionProvider } from '../src/context/SessionContext';
import { ToastProvider } from '../src/context/ToastContext';
import FloatingLanguageSwitcher from '../src/components/language/FloatingLanguageSwitcher';
import ThemeToggle from '../src/components/theme/ThemeToggle';
import ErrorBoundary from '../src/components/ErrorBoundary';
import { SessionTimeoutModal } from '../src/components/SessionTimeoutModal';
import { AuditProvider } from '../src/context/AuditContext';

export default function RootLayout() {
    const router = useRouter();
    const rootNavigationState = useRootNavigationState();
    const pathname = usePathname();

    useEffect(() => {
        // Logic disabled: Was preventing navigation to /login.
        // Previously redirected to '/' if path was not '/' or '/admin'.
        // if (rootNavigationState?.key) {
        //     const timer = setTimeout(() => {
        //         if (pathname !== '/' && !pathname.startsWith('/admin')) {
        //             router.replace('/');
        //         }
        //     }, 50);
        //     return () => clearTimeout(timer);
        // }
    }, [rootNavigationState?.key, pathname, router]);

    return (
        <ErrorBoundary>
            <ThemeProvider>
                <LanguageProvider>
                    <ToastProvider>
                        <KeyboardProvider>
                            <SessionProvider>
                                <AuditProvider>
                                    <Stack screenOptions={{ headerShown: false }}>
                                        <Stack.Screen name="index" />
                                    </Stack>
                                    {pathname !== '/' && <ThemeToggle />}
                                    <VirtualKeyboard />
                                    <FloatingLanguageSwitcher />
                                    <SessionTimeoutModal />
                                </AuditProvider>
                            </SessionProvider>
                        </KeyboardProvider>
                    </ToastProvider>
                </LanguageProvider>
            </ThemeProvider>
        </ErrorBoundary>
    );
}
