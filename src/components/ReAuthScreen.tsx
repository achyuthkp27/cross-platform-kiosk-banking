import React, { useState, useEffect } from 'react';
import { Typography, Button, Box } from '@mui/material';
import { AnimatePresence, motion } from 'framer-motion';
import { useRouter } from 'expo-router';
import { useLanguage } from '../context/LanguageContext';
import KioskPage from './KioskPage';
import OTPFieldGroup from './OTPFieldGroup';
import KioskTextField from './KioskTextField';
import ActionButtons from './ActionButtons';
import { otpService } from '../services';

interface ReAuthScreenProps {
    onSuccess: () => void;
    title: string;
}

/**
 * Re-authentication screen combining User ID entry and OTP verification.
 * Used for Bill Payment and Fund Transfer flows.
 * Uses the service abstraction layer for OTP generation/validation.
 */
export default function ReAuthScreen({ onSuccess, title }: ReAuthScreenProps) {
    const router = useRouter();
    const { t } = useLanguage();
    const [step, setStep] = useState<'userid' | 'otp'>('userid');
    const [userId, setUserId] = useState('');
    const [otp, setOtp] = useState(['', '', '', '', '', '']);
    const [timer, setTimer] = useState(60);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        let interval: NodeJS.Timeout;
        if (step === 'otp' && timer > 0) {
            interval = setInterval(() => setTimer((prev) => prev - 1), 1000);
        }
        return () => clearInterval(interval);
    }, [step, timer]);

    const handleUserIdSubmit = async () => {
        if (!userId.trim()) {
            setError(t('auth.user_id_required') || 'User ID is required');
            return;
        }
        setLoading(true);
        setError('');

        try {
            // Generate OTP via service layer (works in both REAL and MOCK modes)
            const response = await otpService.generate({
                identifier: userId,
                purpose: 'TRANSACTION'
            });

            if (response.success) {
                setStep('otp');
                setTimer(60);
            } else {
                setError(response.message || 'Failed to send OTP');
            }
        } catch (err) {
            setError('Failed to send OTP. Please try again.');
            console.error('[ReAuthScreen] OTP generation error:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleVerify = async (otpValue?: string) => {
        const finalOtp = otpValue || otp.join('');
        if (finalOtp.length !== 6) return;

        setLoading(true);
        setError('');

        try {
            // Validate OTP via service layer
            const response = await otpService.validate({
                identifier: userId,
                code: finalOtp
            });

            if (response.success && response.data?.valid) {
                onSuccess();
            } else {
                setError(response.data?.message || response.message || 'Invalid OTP. Please try again.');
                setOtp(['', '', '', '', '', '']);
            }
        } catch (err) {
            setError('Verification failed. Please try again.');
            console.error('[ReAuthScreen] OTP validation error:', err);
            setOtp(['', '', '', '', '', '']);
        } finally {
            setLoading(false);
        }
    };

    const handleResend = async () => {
        setLoading(true);
        setError('');

        try {
            const response = await otpService.generate({
                identifier: userId,
                purpose: 'TRANSACTION'
            });

            if (response.success) {
                setTimer(60);
                setOtp(['', '', '', '', '', '']);
            } else {
                setError(response.message || 'Failed to resend OTP');
            }
        } catch (err) {
            setError('Failed to resend OTP');
            console.error('[ReAuthScreen] OTP resend error:', err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <KioskPage maxWidth={500}>
            <Typography variant="h5" color="text.secondary" gutterBottom sx={{ letterSpacing: 2 }}>
                {t('auth.verify_identity') || 'SECURITY CHECK'}
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
                        <Typography variant="body1" sx={{ mb: 3, color: 'text.secondary' }}>
                            {t('auth.verify_subtitle') || 'Please re-enter your User ID to proceed.'}
                        </Typography>
                        <KioskTextField
                            fullWidth
                            label={t('auth.user_id') || 'User ID'}
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
                        <ActionButtons
                            onPrimary={handleUserIdSubmit}
                            onSecondary={() => router.back()}
                            primaryText={loading ? '' : t('common.next')}
                            secondaryText={t('common.cancel')}
                            primaryDisabled={!userId.trim()}
                            loading={loading}
                        />
                    </motion.div>
                ) : (
                    <motion.div
                        key="otp"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 20 }}
                    >
                        <Typography variant="body1" sx={{ mb: 4, color: 'text.secondary' }}>
                            {t('otp.subtitle') || 'Enter the 6-digit code sent to your mobile.'}
                        </Typography>

                        <OTPFieldGroup
                            value={otp}
                            onChange={setOtp}
                            onComplete={handleVerify}
                            disabled={loading}
                        />

                        {error && (
                            <Typography color="error" sx={{ mb: 2 }}>
                                {error}
                            </Typography>
                        )}

                        <Box sx={{ mb: 4 }}>
                            {timer > 0 ? (
                                <Typography variant="body2" color="text.secondary">
                                    {t('otp.resend_in') || 'Resend OTP in'} {timer}s
                                </Typography>
                            ) : (
                                <Button onClick={handleResend} variant="text" sx={{ fontWeight: 'bold' }} disabled={loading}>
                                    {t('otp.resend') || 'Resend OTP'}
                                </Button>
                            )}
                        </Box>

                        <ActionButtons
                            onPrimary={() => handleVerify()}
                            onSecondary={() => setStep('userid')}
                            primaryText={loading ? '' : t('common.verify')}
                            secondaryText={t('common.back')}
                            primaryDisabled={otp.some(d => !d)}
                            loading={loading}
                        />
                        {!loading && process.env.EXPO_PUBLIC_DATA_MODE !== 'REAL' && (
                            <Typography variant="caption" display="block" sx={{ mt: 3, color: 'text.disabled' }}>
                                (MOCK mode: use 123456)
                            </Typography>
                        )}
                    </motion.div>
                )}
            </AnimatePresence>
        </KioskPage>
    );
}

