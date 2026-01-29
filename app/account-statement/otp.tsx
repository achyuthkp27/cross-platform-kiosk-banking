import React, { useState, useEffect } from 'react';
import { Box, Typography, Button, Paper, Stack } from '@mui/material';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { motion, AnimatePresence } from 'framer-motion';
import SuccessState from '../../src/components/SuccessState';

export default function AccountStatementOTP() {
    const router = useRouter();
    const { userId } = useLocalSearchParams();
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
        if (isNaN(Number(element.value))) return;

        const newOtp = [...otp];
        newOtp[index] = element.value;
        setOtp(newOtp);

        // Focus next input
        if (element.nextSibling && element.value !== '') {
            (element.nextSibling as HTMLInputElement).focus();
        }
    };

    const handleVerify = () => {
        if (otp.join('').length === 6) {
            setIsSuccess(true);
            setTimeout(() => {
                router.replace('/account-statement/view');
            }, 1000);
        }
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
            <Paper elevation={3} sx={{ padding: 6, width: '100%', maxWidth: 600, textAlign: 'center', borderRadius: 4 }}>
                <AnimatePresence mode="wait">
                    {!isSuccess ? (
                        <motion.div
                            key="otp-form"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                        >
                            <Typography variant="h4" gutterBottom color="primary" sx={{ fontWeight: 'bold' }}>
                                Verify Identity
                            </Typography>
                            <Typography variant="body1" sx={{ mb: 4, color: 'text.secondary' }}>
                                Enter the OTP sent to your registered mobile for User ID: <strong>{userId}</strong>
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
                                            width: '56px',
                                            height: '64px',
                                            textAlign: 'center',
                                            fontSize: '28px',
                                            border: '1px solid #ccc',
                                            borderRadius: '12px',
                                            outline: 'none',
                                            fontFamily: 'inherit',
                                            transition: 'border-color 0.2s'
                                        }}
                                        onFocus={(e) => e.target.style.borderColor = '#1976d2'}
                                        onBlur={(e) => e.target.style.borderColor = '#ccc'}
                                    />
                                ))}
                            </Stack>

                            <Typography variant="body2" sx={{ mb: 4, color: timer > 0 ? 'text.secondary' : 'primary.main', cursor: timer > 0 ? 'default' : 'pointer' }}>
                                {timer > 0 ? `Resend OTP in ${timer}s` : 'Resend OTP'}
                            </Typography>

                            <Box sx={{ display: 'flex', gap: 2 }}>
                                <Button fullWidth variant="outlined" size="large" onClick={() => router.back()} sx={{ height: 56, borderRadius: 2 }}>
                                    Back
                                </Button>
                                <Button fullWidth variant="contained" size="large" onClick={handleVerify} disabled={otp.join('').length !== 6} sx={{ height: 56, borderRadius: 2 }}>
                                    Verify
                                </Button>
                            </Box>
                        </motion.div>
                    ) : (
                        <SuccessState message="Access Granted" subMessage="Retrieving your secure statement..." />
                    )}
                </AnimatePresence>
            </Paper>
        </Box>
    );
}
