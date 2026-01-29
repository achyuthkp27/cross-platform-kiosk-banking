import React, { useState } from 'react';
import { Box, Typography, Button, TextField, Paper, Fade } from '@mui/material';
import { useRouter } from 'expo-router';

export default function ChequeBookAuth() {
    const router = useRouter();
    const [userId, setUserId] = useState('');
    const [error, setError] = useState('');

    const handleNext = () => {
        if (!userId.trim()) {
            setError('User ID is required');
            return;
        }
        // Redirect to OTP with userId param
        router.push({ pathname: '/cheque-book/otp', params: { userId } });
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
                        Security Check
                    </Typography>
                    <Typography variant="body1" sx={{ mb: 4, color: 'text.secondary' }}>
                        To order a cheque book, please re-confirm your identity.
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
                        InputProps={{
                            style: { fontSize: '1.2rem' }
                        }}
                        sx={{ mb: 4 }}
                    />

                    <Box sx={{ display: 'flex', gap: 2 }}>
                        <Button
                            fullWidth
                            variant="outlined"
                            size="large"
                            onClick={() => router.back()}
                            sx={{ height: 56, borderRadius: 2 }}
                        >
                            Cancel
                        </Button>
                        <Button
                            fullWidth
                            variant="contained"
                            size="large"
                            onClick={handleNext}
                            disabled={!userId.trim()}
                            sx={{ height: 56, borderRadius: 2 }}
                        >
                            Verify
                        </Button>
                    </Box>
                </Paper>
            </Fade>
        </Box>
    );
}
