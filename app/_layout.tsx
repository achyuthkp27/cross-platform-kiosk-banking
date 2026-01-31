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
import { DevTools } from '../src/components/dev/DevTools';

export default function RootLayout() {
    const router = useRouter();
    const rootNavigationState = useRootNavigationState();
    const pathname = usePathname();

    // Handle page refresh - redirect to landing page
    useEffect(() => {
        if (typeof window !== 'undefined') {
            // Check if this is a fresh page load (refresh or new tab)
            const hasNavigated = sessionStorage.getItem('kiosk_has_navigated');

            if (!hasNavigated) {
                // First load in this session - mark as navigated and redirect to landing
                sessionStorage.setItem('kiosk_has_navigated', 'true');

                // If not already on landing page, redirect there
                if (pathname !== '/') {
                    console.log('[RootLayout] Page refresh detected, redirecting to landing page');
                    router.replace('/');
                }
            }
        }
    }, [pathname, router]);

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
                                    <FloatingLanguageSwitcher />
                                    <SessionTimeoutModal />
                                    <DevTools />
                                </AuditProvider>
                            </SessionProvider>
                        </KeyboardProvider>
                    </ToastProvider>
                </LanguageProvider>
            </ThemeProvider>
        </ErrorBoundary>
    );
}
