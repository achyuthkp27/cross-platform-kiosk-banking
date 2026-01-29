import React, { useState } from 'react';
import { Box, Typography, Button, TextField, Paper, Fade } from '@mui/material';
import { useRouter } from 'expo-router';

export default function LoginScreen() {
    const router = useRouter();
    const [userId, setUserId] = useState('');
    const [dob, setDob] = useState('');
    const [error, setError] = useState('');

    const validateAndProceed = () => {
        if (!userId.trim()) {
            setError('User ID is required');
            return;
        }
        const dobRegex = /^(\d{2})\/(\d{2})\/(\d{4})$/;
        const match = dob.match(dobRegex);
        if (!match) {
            setError('Date of Birth must be in DD/MM/YYYY format');
            return;
        }

        const day = parseInt(match[1], 10);
        const month = parseInt(match[2], 10);
        const year = parseInt(match[3], 10);

        // Basic Age Check (18+)
        const birthDate = new Date(year, month - 1, day);
        const today = new Date();
        let age = today.getFullYear() - birthDate.getFullYear();
        const m = today.getMonth() - birthDate.getMonth();
        if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
            age--;
        }

        if (age < 18) {
            setError('You must be 18+ to use this service');
            return;
        }

        // Success
        router.push('/otp');
    };

    return (
        <Box
            sx={{
                height: '100vh',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                bgcolor: 'background.default',
            }}
        >
            <Fade in={true} style={{ transformOrigin: '0 0 0' }} timeout={1000}>
                <Paper elevation={3} sx={{ padding: 6, width: '100%', maxWidth: 500, textAlign: 'center' }}>
                    <Typography variant="h4" gutterBottom color="primary">
                        Authentication
                    </Typography>
                    <Typography variant="body1" sx={{ mb: 4, color: 'text.secondary' }}>
                        Please enter your details to proceed.
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
                    />
                    <TextField
                        fullWidth
                        label="Date of Birth (DD/MM/YYYY)"
                        variant="outlined"
                        margin="normal"
                        placeholder="DD/MM/YYYY"
                        value={dob}
                        onChange={(e) => {
                            let val = e.target.value.replace(/\D/g, ''); // Remove non-digit chars
                            if (val.length > 8) val = val.slice(0, 8); // Limit to 8 digits

                            let formattedVal = val;
                            if (val.length > 4) {
                                formattedVal = `${val.slice(0, 2)}/${val.slice(2, 4)}/${val.slice(4)}`;
                            } else if (val.length > 2) {
                                formattedVal = `${val.slice(0, 2)}/${val.slice(2)}`;
                            }

                            setDob(formattedVal);
                            setError('');
                        }}
                    />

                    {error && (
                        <Typography color="error" sx={{ mt: 2 }}>
                            {error}
                        </Typography>
                    )}

                    <Box sx={{ mt: 4, display: 'flex', gap: 2 }}>
                        <Button fullWidth variant="outlined" size="large" onClick={() => router.back()}>
                            Back
                        </Button>
                        <Button fullWidth variant="contained" size="large" onClick={validateAndProceed} disabled={!userId || !dob}>
                            Next
                        </Button>
                    </Box>
                </Paper>
            </Fade>
        </Box>
    );
}
