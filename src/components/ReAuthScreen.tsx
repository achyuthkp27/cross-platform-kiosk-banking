import React, { useState, useEffect, useRef } from 'react';
import { Box, Typography, Button, TextField, Paper, Stack, CircularProgress } from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'expo-router';

interface ReAuthScreenProps {
    onSuccess: () => void;
    title: string;
}

export default function ReAuthScreen({ onSuccess, title }: ReAuthScreenProps) {
    const router = useRouter();
    const [step, setStep] = useState<'userid' | 'otp'>('userid');
    const [userId, setUserId] = useState('');
    const [otp, setOtp] = useState(['', '', '', '', '', '']);
    const [timer, setTimer] = useState(60);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const otpInputs = useRef<(HTMLInputElement | null)[]>([]);

    useEffect(() => {
        let interval: NodeJS.Timeout;
        if (step === 'otp' && timer > 0) {
            interval = setInterval(() => setTimer((prev) => prev - 1), 1000);
        }
        return () => clearInterval(interval);
    }, [step, timer]);

    const handleUserIdSubmit = () => {
        if (!userId.trim()) {
            setError('User ID is required');
            return;
        }
        setLoading(true);
        // Mock API call
        setTimeout(() => {
            setLoading(false);
            setStep('otp');
            setError('');
            setTimer(60);
        }, 1000);
    };

    const handleOtpChange = (value: string, index: number) => {
        if (isNaN(Number(value))) return;

        const newOtp = [...otp];
        newOtp[index] = value;
        setOtp(newOtp);

        if (value && index < 5) {
            otpInputs.current[index + 1]?.focus();
        }
    };

    const handleOtpKeyDown = (e: React.KeyboardEvent, index: number) => {
        if (e.key === 'Backspace' && !otp[index] && index > 0) {
            otpInputs.current[index - 1]?.focus();
        }
    };

    const handleVerify = () => {
        if (otp.join('').length !== 6) return;

        setLoading(true);
        // Mock verification
        setTimeout(() => {
            setLoading(false);
            if (otp.join('') === '123456') { // Mock correct OTP
                onSuccess();
            } else {
                setError('Invalid OTP. Please try again.');
                setOtp(['', '', '', '', '', '']);
                otpInputs.current[0]?.focus();
            }
        }, 1500);
    };

    const handleResend = () => {
        setTimer(60);
        setOtp(['', '', '', '', '', '']);
        setError('');
        otpInputs.current[0]?.focus();
    };

    return (
        <Box sx={{
            height: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            bgcolor: 'background.default'
        }}>
            <Paper elevation={3} sx={{ p: 6, width: '100%', maxWidth: 500, textAlign: 'center', borderRadius: 4 }}>
                <Typography variant="h5" color="text.secondary" gutterBottom>
                    SECURITY CHECK
                </Typography>
                <Typography variant="h4" color="primary" sx={{ mb: 4, fontWeight: 'bold' }}>
                    {title}
                </Typography>

                <AnimatePresence mode="wait">
                    {step === 'userid' ? (
                        <motion.div
                            key="userid"
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 20 }}
                        >
                            <Typography variant="body1" sx={{ mb: 3 }}>
                                Please re-enter your User ID to proceed.
                            </Typography>
                            <TextField
                                fullWidth
                                label="User ID"
                                variant="outlined"
                                value={userId}
                                onChange={(e) => {
                                    setUserId(e.target.value);
                                    setError('');
                                }}
                                error={!!error}
                                helperText={error}
                                disabled={loading}
                                sx={{ mb: 4 }}
                            />
                            <Stack direction="row" spacing={2}>
                                <Button
                                    fullWidth
                                    variant="outlined"
                                    size="large"
                                    onClick={() => router.back()}
                                    disabled={loading}
                                >
                                    Cancel
                                </Button>
                                <Button
                                    fullWidth
                                    variant="contained"
                                    size="large"
                                    onClick={handleUserIdSubmit}
                                    disabled={loading || !userId.trim()}
                                >
                                    {loading ? <CircularProgress size={24} color="inherit" /> : 'Next'}
                                </Button>
                            </Stack>
                        </motion.div>
                    ) : (
                        <motion.div
                            key="otp"
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 20 }}
                        >
                            <Typography variant="body1" sx={{ mb: 4 }}>
                                Enter the 6-digit code sent to your mobile.
                            </Typography>

                            <Stack direction="row" spacing={1} justifyContent="center" sx={{ mb: 4 }}>
                                {otp.map((digit, index) => (
                                    <input
                                        key={index}
                                        ref={el => otpInputs.current[index] = el}
                                        type="text"
                                        maxLength={1}
                                        value={digit}
                                        onChange={(e) => handleOtpChange(e.target.value, index)}
                                        onKeyDown={(e) => handleOtpKeyDown(e, index)}
                                        disabled={loading}
                                        style={{
                                            width: '45px',
                                            height: '56px',
                                            textAlign: 'center',
                                            fontSize: '24px',
                                            border: error ? '1px solid #d32f2f' : '1px solid #ccc',
                                            borderRadius: '8px',
                                            backgroundColor: loading ? '#f5f5f5' : 'white',
                                            outline: 'none',
                                        }}
                                    />
                                ))}
                            </Stack>

                            {error && (
                                <Typography color="error" sx={{ mb: 2 }}>
                                    {error}
                                </Typography>
                            )}

                            <Box sx={{ mb: 4 }}>
                                {timer > 0 ? (
                                    <Typography variant="body2" color="text.secondary">
                                        Resend OTP in {timer}s
                                    </Typography>
                                ) : (
                                    <Button onClick={handleResend} variant="text">
                                        Resend OTP
                                    </Button>
                                )}
                            </Box>

                            <Stack direction="row" spacing={2}>
                                <Button
                                    fullWidth
                                    variant="outlined"
                                    size="large"
                                    onClick={() => setStep('userid')}
                                    disabled={loading}
                                >
                                    Back
                                </Button>
                                <Button
                                    fullWidth
                                    variant="contained"
                                    size="large"
                                    onClick={handleVerify}
                                    disabled={loading || otp.some(d => !d)}
                                >
                                    {loading ? <CircularProgress size={24} color="inherit" /> : 'Verify'}
                                </Button>
                            </Stack>
                            <Typography variant="caption" display="block" sx={{ mt: 2, color: 'text.disabled' }}>
                                (Use 123456 for demo)
                            </Typography>
                        </motion.div>
                    )}
                </AnimatePresence>
            </Paper>
        </Box>
    );
}
