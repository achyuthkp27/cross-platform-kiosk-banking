import React, { useState, useEffect } from 'react';
import { Box, Typography, Button, Paper, Stack } from '@mui/material';
import { useRouter } from 'expo-router';
import { motion, AnimatePresence } from 'framer-motion';
import SuccessState from '../src/components/SuccessState';

export default function OTPScreen() {
    const router = useRouter();
    const [otp, setOtp] = useState(['', '', '', '', '', '']);
    const [timer, setTimer] = useState(60);
    const [isSuccess, setIsSuccess] = useState(false);

    useEffect(() => {
        if (timer > 0) {
            const interval = setInterval(() => setTimer(t => t - 1), 1000);
            return () => clearInterval(interval);
        }
    }, [timer]);

    const handleChange = (element: HTMLInputElement, index: number) => {
        if (isNaN(Number(element.value))) return false;

        setOtp([...otp.map((d, idx) => (idx === index ? element.value : d))]);

        // Focus next input
        if (element.nextSibling && element.value !== '') {
            (element.nextSibling as HTMLInputElement).focus();
        }
    };

    const handleVerify = () => {
        // Mock validation
        if (otp.join('').length === 6) {
            setIsSuccess(true);
            setTimeout(() => {
                router.push('/dashboard');
            }, 1500);
        }
    };

    return (
        <Box
            sx={{
                height: '100vh',
                width: '100vw',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                bgcolor: 'background.default',
            }}
        >
            <Paper elevation={3} sx={{ padding: 6, width: '100%', maxWidth: 600, textAlign: 'center' }}>

                <AnimatePresence mode="wait">
                    {!isSuccess ? (
                        <motion.div
                            key="otp-form"
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 20 }}
                        >
                            <Typography variant="h4" gutterBottom color="primary">
                                Enter OTP
                            </Typography>
                            <Typography variant="body1" sx={{ mb: 4, color: 'text.secondary' }}>
                                We have sent a verification code to your registered mobile.
                            </Typography>

                            <Stack direction="row" spacing={2} justifyContent="center" mb={4}>
                                {otp.map((data, index) => (
                                    <input
                                        key={index}
                                        type="text"
                                        maxLength={1}
                                        value={data}
                                        autoFocus={index === 0}
                                        onChange={e => handleChange(e.target as any, index)}
                                        style={{
                                            width: '48px',
                                            height: '56px',
                                            textAlign: 'center',
                                            fontSize: '24px',
                                            border: '1px solid #ccc',
                                            borderRadius: '8px',
                                            outlineColor: 'primary.main'
                                        }}
                                    />
                                ))}
                            </Stack>

                            <Typography variant="body2" sx={{ mb: 3 }}>
                                Resend OTP in {timer}s
                            </Typography>

                            <Button variant="contained" size="large" fullWidth onClick={handleVerify} disabled={otp.join('').length !== 6}>
                                Verify
                            </Button>
                        </motion.div>
                    ) : (
                        <SuccessState message="Login Successful" subMessage="Redirecting to Dashboard..." />
                    )}
                </AnimatePresence>
            </Paper>
        </Box>
    );
}
