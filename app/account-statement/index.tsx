import React, { useState } from 'react';
import { Box, Typography, Button, TextField, Paper, Fade } from '@mui/material';
import { useRouter } from 'expo-router';

export default function AccountStatementLogin() {
    const router = useRouter();
    const [userId, setUserId] = useState('');
    const [error, setError] = useState('');

    const handleNext = () => {
        if (!userId.trim()) {
            setError('User ID is required');
            return;
        }
        // Proceed to OTP
        router.push({ pathname: '/account-statement/otp', params: { userId } });
    };

    return (
        <Box
            sx={{
                height: '100vh',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                bgcolor: '#F0F2F5',
            }}
        >
            <Fade in={true} timeout={800}>
                <Paper elevation={3} sx={{ padding: 6, width: '100%', maxWidth: 500, textAlign: 'center', borderRadius: 4 }}>
                    <Typography variant="h4" gutterBottom color="primary" sx={{ fontWeight: 'bold' }}>
                        Account access
                    </Typography>
                    <Typography variant="body1" sx={{ mb: 4, color: 'text.secondary' }}>
                        Enter your User ID to view your statement.
                    </Typography>

                    <TextField
                        fullWidth
                        label="User ID"
                        variant="outlined"
                        margin="normal"
                        value={userId}
                        onChange={(e) => {
                            setUserId(e.target.value);
                            setError('');
                        }}
                        error={!!error}
                        helperText={error}
                        sx={{ mb: 3 }}
                    />

                    <Box sx={{ display: 'flex', gap: 2 }}>
                        <Button
                            fullWidth
                            variant="outlined"
                            size="large"
                            onClick={() => router.back()}
                            sx={{ borderRadius: 2, height: 56 }}
                        >
                            Back
                        </Button>
                        <Button
                            fullWidth
                            variant="contained"
                            size="large"
                            onClick={handleNext}
                            disabled={!userId}
                            sx={{ borderRadius: 2, height: 56, fontSize: '1.1rem' }}
                        >
                            Next
                        </Button>
                    </Box>
                </Paper>
            </Fade>
        </Box>
    );
}
