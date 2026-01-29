import React, { useEffect } from 'react';
import { Stack, useRouter, useRootNavigationState, usePathname } from 'expo-router';
import { ThemeProvider, CssBaseline } from '@mui/material';
import theme from '../src/theme/Theme';

export default function RootLayout() {
    const router = useRouter();
    const rootNavigationState = useRootNavigationState();
    const pathname = usePathname();

    useEffect(() => {
        // Ensure navigation is ready before redirecting
        if (rootNavigationState?.key) {
            // Check if we are already at root to avoid unnecessary replaces/loops
            // But user wants "refresh -> landing", so even if we are deep, we go to root.
            // If we are ALREADY at root, do nothing?
            // Actually, "refresh" on / means we are at /.
            // "refresh" on /dashboard means we are at /dashboard.
            // So logic: if (pathname !== '/') router.replace('/');

            // Adding a small timeout to ensure hydration/mounting is complete
            const timer = setTimeout(() => {
                if (pathname !== '/') {
                    router.replace('/');
                }
            }, 50);
            return () => clearTimeout(timer);
        }
    }, [rootNavigationState?.key]);

    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />
            <Stack screenOptions={{ headerShown: false }}>
                <Stack.Screen name="index" />
            </Stack>
        </ThemeProvider>
    );
}
