import React, { useEffect } from 'react';
import { useRouter } from 'expo-router';
import { Box, CircularProgress, Typography } from '@mui/material';

/**
 * Fund Transfer Entry - User already authenticated via login
 * Skip re-auth and go directly to wizard
 */
export default function FundTransferIndex() {
    const router = useRouter();

    useEffect(() => {
        const userId = sessionStorage.getItem('kiosk_userId');
        if (userId) {
            router.replace('/fund-transfer/wizard');
        } else {
            router.replace('/login');
        }
    }, []);

    return (
        <Box sx={{ height: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', bgcolor: '#020617' }}>
            <CircularProgress size={48} />
            <Typography color="text.secondary" sx={{ mt: 2 }}>Loading...</Typography>
        </Box>
    );
}
