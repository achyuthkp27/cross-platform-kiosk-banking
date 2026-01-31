import React, { useEffect } from 'react';
import { useRouter } from 'expo-router';
import { Box, CircularProgress, Typography } from '@mui/material';

/**
 * Account Statement Entry - No longer needs re-authentication
 * User is already logged in, so we get userId from session and redirect directly to view.
 * NOTE: userId is NOT passed in URL for security - view page reads from sessionStorage
 */
export default function AccountStatementAuth() {
    const router = useRouter();

    useEffect(() => {
        // User is already authenticated, check session
        const userId = sessionStorage.getItem('kiosk_userId');
        
        if (userId) {
            // Redirect directly to statement view - NO userId in URL for security
            router.replace('/account-statement/view');
        } else {
            // No session - redirect to login
            router.replace('/login');
        }
    }, []);

    // Show loading while redirecting
    return (
        <Box sx={{ 
            height: '100vh', 
            display: 'flex', 
            flexDirection: 'column',
            justifyContent: 'center', 
            alignItems: 'center',
            bgcolor: '#020617'
        }}>
            <CircularProgress size={48} />
            <Typography color="text.secondary" sx={{ mt: 2 }}>
                Loading your statement...
            </Typography>
        </Box>
    );
}
