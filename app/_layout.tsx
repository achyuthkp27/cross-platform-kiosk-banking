import React, { useEffect } from 'react';
import { Stack, useRouter, useRootNavigationState, usePathname } from 'expo-router';
import { ThemeProvider } from '../src/context/ThemeContext';
import { KeyboardProvider } from '../src/context/KeyboardContext';
import VirtualKeyboard from '../src/components/keyboard/VirtualKeyboard';
import { LanguageProvider } from '../src/context/LanguageContext';
import { SessionProvider } from '../src/context/SessionContext';
import { ToastProvider } from '../src/context/ToastContext';

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
            // Force title update for Web
            document.title = "Kiosk Banking";

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
                                    <Stack screenOptions={{ headerShown: false, title: 'Kiosk Banking' }}>
                                        <Stack.Screen name="index" options={{ title: 'Kiosk Banking - Welcome' }} />
                                        <Stack.Screen name="login" options={{ title: 'Kiosk Banking - Login' }} />
                                        <Stack.Screen name="otp" options={{ title: 'Kiosk Banking - OTP Verification' }} />
                                        <Stack.Screen name="dashboard" options={{ title: 'Kiosk Banking - Dashboard' }} />
                                        
                                        {/* Service Routes */}
                                        <Stack.Screen name="fund-transfer" options={{ title: 'Kiosk Banking - Fund Transfer' }} />
                                        <Stack.Screen name="bill-payment" options={{ title: 'Kiosk Banking - Bill Payment' }} />
                                        <Stack.Screen name="card-services" options={{ title: 'Kiosk Banking - Card Services' }} />
                                        <Stack.Screen name="cheque-book" options={{ title: 'Kiosk Banking - Cheque Book' }} />
                                        <Stack.Screen name="account-statement" options={{ title: 'Kiosk Banking - Account Statement' }} />
                                        <Stack.Screen name="admin" options={{ title: 'Kiosk Banking - Admin' }} />
                                    </Stack>
                                    <VirtualKeyboard />

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
