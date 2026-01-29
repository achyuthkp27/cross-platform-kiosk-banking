import React from 'react';
import { Box, Typography, Button } from '@mui/material';
import { useRouter } from 'expo-router';

export default function LandingScreen() {
    const router = useRouter();

    return (
        <Box
            sx={{
                height: '100vh',
                width: '100vw',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                backgroundImage: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
                position: 'relative',
                overflow: 'hidden',
            }}
        >
            {/* Abstract Background Element */}
            <Box
                sx={{
                    position: 'absolute',
                    top: '-20%',
                    left: '-10%',
                    width: '600px',
                    height: '600px',
                    background: 'rgba(10, 37, 64, 0.05)',
                    borderRadius: '50%',
                    zIndex: 0,
                }}
            />

            <Box sx={{ position: 'absolute', top: 40, right: 40 }}>
                <Button variant="outlined" sx={{ borderRadius: 20 }}>
                    Language: English
                </Button>
            </Box>

            <Box sx={{ zIndex: 1, textAlign: 'center' }}>
                <Box sx={{ mb: 4, display: 'flex', justifyContent: 'center' }}>
                    {/* Logo Placeholder */}
                    <Box sx={{ width: 80, height: 80, bgcolor: 'primary.main', borderRadius: 2 }}></Box>
                </Box>
                <Typography variant="h2" color="primary" sx={{ mb: 2 }}>
                    Welcome to Kiosk Banking
                </Typography>
                <Typography variant="h5" color="text.secondary" sx={{ mb: 6 }}>
                    Experience the future of banking.
                </Typography>

                <Button
                    variant="contained"
                    size="large"
                    onClick={() => router.push('/login')}
                    sx={{
                        fontSize: '1.5rem',
                        padding: '16px 64px',
                        borderRadius: 50,
                    }}
                >
                    START
                </Button>
            </Box>
        </Box>
    );
}
