import React, { useState, useEffect } from 'react';
import { useRouter } from 'expo-router';
import { Typography, Alert, Box, Button } from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from '../src/context/LanguageContext';
import { useAudit } from '../src/context/AuditContext';
import { useToast } from '../src/context/ToastContext';
import { useKeyboard } from '../src/context/KeyboardContext';
import { otpService } from '../src/services';
import KioskPage from '../src/components/KioskPage';
import OTPFieldGroup from '../src/components/OTPFieldGroup';
import SuccessState from '../src/components/SuccessState';
import ActionButtons from '../src/components/ActionButtons';

/**
 * Main login OTP screen - uses backend OTP validation.
 */
export default function OTPScreen() {
    const router = useRouter();
    const { t } = useLanguage();
    const { addLog } = useAudit();
    const { showSuccess, showError, showInfo } = useToast();
    const { hideKeyboard } = useKeyboard();
    
    const [otp, setOtp] = useState(['', '', '', '', '', '']);
    const [timer, setTimer] = useState(60);
    const [isSuccess, setIsSuccess] = useState(false);
    const [error, setError] = useState('');
    const [isVerifying, setIsVerifying] = useState(false);
    const [userId, setUserId] = useState('');

    // Get userId from sessionStorage
    useEffect(() => {
        const pendingUserId = sessionStorage.getItem('pendingUserId');
        if (pendingUserId) {
            setUserId(pendingUserId);
        } else {
            // No pending login, redirect back
            router.replace('/login');
        }
    }, []);

    // Timer countdown
    useEffect(() => {
        if (timer > 0) {
            const interval = setInterval(() => setTimer(t => t - 1), 1000);
            return () => clearInterval(interval);
        }
    }, [timer]);

    const handleVerify = async (otpValue?: string) => {
        if (isVerifying || isSuccess) return;

        const finalOtp = otpValue || otp.join('');
        if (finalOtp.length !== 6) {
            setError('Please enter a 6-digit OTP');
            return;
        }

        setIsVerifying(true);
        setError('');

        try {
            const response = await otpService.validate({
                identifier: userId,
                code: finalOtp
            });

            if (response.success && response.data?.valid) {
                hideKeyboard();
                setIsSuccess(true);
                showSuccess(t('otp.verified') || 'OTP Verified!');
                addLog('User Login Success', userId, { method: 'OTP' });
                
                // Clear pending data and store user for dashboard, then navigate
                sessionStorage.setItem('kiosk_userId', userId);
                sessionStorage.removeItem('pendingUserId');
                setTimeout(() => {
                    router.push('/dashboard');
                }, 1500);
            } else {
                setError(response.message || 'Invalid OTP. Please try again.');
                showError('Invalid OTP');
                addLog('OTP Verification Failed', userId);
            }
        } catch (err) {
            console.error('OTP verification error:', err);
            setError('Unable to verify OTP. Please try again.');
            showError('Verification failed');
        } finally {
            setIsVerifying(false);
        }
    };

    const handleResend = async () => {
        setTimer(60);
        setOtp(['', '', '', '', '', '']);
        setError('');
        
        try {
            await otpService.generate({ identifier: userId, purpose: 'LOGIN' });
            showInfo(t('otp.resent') || 'OTP has been resent');
        } catch (err) {
            console.error('Resend error:', err);
        }
    };

    return (
        <KioskPage maxWidth={600}>
            <AnimatePresence mode="wait">
                {!isSuccess ? (
                    <motion.div
                        key="otp-form"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                    >
                        <Typography variant="h4" gutterBottom color="primary" sx={{ fontWeight: 'bold' }}>
                            {t('otp.title')}
                        </Typography>
                        <Typography variant="body1" sx={{ mb: 4, color: 'text.secondary' }}>
                            {t('otp.subtitle_with_user') || 'Enter the OTP sent to your registered mobile for User ID:'}{' '}
                            <strong>{userId}</strong>
                        </Typography>

                        <OTPFieldGroup
                            value={otp}
                            onChange={setOtp}
                            onComplete={handleVerify}
                        />

                        {error && (
                            <Alert severity="error" sx={{ mt: 2, mb: 2 }}>
                                {error}
                            </Alert>
                        )}

                        <Box sx={{ mb: 4 }}>
                            {timer > 0 ? (
                                <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 'bold' }}>
                                    {t('otp.resend_in') || 'Resend OTP in'} {timer}s
                                </Typography>
                            ) : (
                                <Button onClick={handleResend} variant="text" sx={{ fontWeight: 'bold' }}>
                                    {t('otp.resend') || 'Resend OTP'}
                                </Button>
                            )}
                        </Box>

                        <ActionButtons
                            onPrimary={() => handleVerify()}
                            onSecondary={() => router.back()}
                            primaryText={isVerifying ? 'Verifying...' : (t('common.verify') || 'Verify')}
                            secondaryText={t('common.back') || 'Back'}
                            primaryDisabled={otp.join('').length !== 6 || isVerifying}
                        />

                        <Typography variant="caption" display="block" sx={{ mt: 3, color: 'text.disabled' }}>
                            (For demo, check backend console for generated OTP)
                        </Typography>
                    </motion.div>
                ) : (
                    <SuccessState
                        message={t('otp.verified') || 'Verified Successfully'}
                        subMessage={t('common.loading') || 'Please wait...'}
                    />
                )}
            </AnimatePresence>
        </KioskPage>
    );
}

