import React, { useState, useEffect } from 'react';
import { Typography, Button, Box } from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from '../context/LanguageContext';
import { useKeyboard } from '../context/KeyboardContext';
import { useToast } from '../context/ToastContext';
import KioskPage from './KioskPage';
import OTPFieldGroup from './OTPFieldGroup';
import SuccessState from './SuccessState';
import ActionButtons from './ActionButtons';

export interface OTPVerificationScreenProps {
    /** Main title displayed at the top */
    title?: string;
    /** Subtitle/description text */
    subtitle?: string;
    /** User ID to display in subtitle (optional) */
    userId?: string;
    /** Message shown on successful verification */
    successMessage?: string;
    /** Sub-message shown on successful verification */
    successSubMessage?: string;
    /** Called when OTP is submitted - receives the 6-digit OTP string */
    onVerify: (otp: string) => void;
    /** Called when back button is pressed */
    onBack?: () => void;
    /** Called when resend OTP is clicked */
    onResend?: () => void;
    /** Whether to show the back button */
    showBackButton?: boolean;
    /** Initial timer value in seconds */
    initialTimer?: number;
    /** Max width for the page */
    maxWidth?: number;
    /** Text for verify button */
    verifyButtonText?: string;
    /** Text for back button */
    backButtonText?: string;
    /** Demo mode hint (e.g., "Use 123456 for demo") */
    demoHint?: string;
}

/**
 * A unified OTP verification screen component.
 * Handles OTP entry, timer countdown, resend functionality, and success state.
 * Use this component to ensure consistent OTP handling across all flows.
 */
export default function OTPVerificationScreen({
    title,
    subtitle,
    userId,
    successMessage,
    successSubMessage,
    onVerify,
    onBack,
    onResend,
    showBackButton = true,
    initialTimer = 60,
    maxWidth = 600,
    verifyButtonText,
    backButtonText,
    demoHint
}: OTPVerificationScreenProps) {
    const { t } = useLanguage();
    const { showSuccess, showInfo } = useToast();
    const [otp, setOtp] = useState(['', '', '', '', '', '']);
    const [timer, setTimer] = useState(initialTimer);
    const [isSuccess, setIsSuccess] = useState(false);

    // Timer countdown effect
    useEffect(() => {
        if (timer > 0) {
            const interval = setInterval(() => setTimer(t => t - 1), 1000);
            return () => clearInterval(interval);
        }
    }, [timer]);

    const { hideKeyboard } = useKeyboard();

    const handleVerify = (otpValue?: string) => {
        const finalOtp = otpValue || otp.join('');
        if (finalOtp.length === 6) {
            hideKeyboard();
            setIsSuccess(true);
            showSuccess(t('otp.verified') || 'OTP Verified!');
            // Call the onVerify callback after showing success animation briefly
            setTimeout(() => {
                onVerify(finalOtp);
            }, 1500);
        }
    };

    const handleResend = () => {
        setTimer(initialTimer);
        setOtp(['', '', '', '', '', '']);
        showInfo(t('otp.resent') || 'OTP has been resent');
        if (onResend) {
            onResend();
        }
    };

    // Resolved text values with translations
    const resolvedTitle = title || t('otp.title') || 'Enter OTP';
    const resolvedSubtitle = subtitle ||
        (userId
            ? `${t('otp.subtitle_with_user') || 'Enter the OTP sent to your registered mobile for User ID:'} ${userId}`
            : t('otp.subtitle') || 'We have sent a verification code to your registered mobile.'
        );
    const resolvedSuccessMessage = successMessage || t('common.success') || 'Verified Successfully';
    const resolvedSuccessSubMessage = successSubMessage || t('common.loading') || 'Please wait...';
    const resolvedVerifyText = verifyButtonText || t('common.verify') || 'Verify';
    const resolvedBackText = backButtonText || t('common.back') || 'Back';

    return (
        <KioskPage maxWidth={maxWidth}>
            <AnimatePresence mode="wait">
                {!isSuccess ? (
                    <motion.div
                        key="otp-form"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                    >
                        <Typography variant="h4" gutterBottom color="primary" sx={{ fontWeight: 'bold' }}>
                            {resolvedTitle}
                        </Typography>
                        <Typography variant="body1" sx={{ mb: 4, color: 'text.secondary' }}>
                            {userId ? (
                                <>
                                    {t('otp.subtitle_with_user') || 'Enter the OTP sent to your registered mobile for User ID:'}{' '}
                                    <strong>{userId}</strong>
                                </>
                            ) : (
                                resolvedSubtitle
                            )}
                        </Typography>

                        <OTPFieldGroup
                            value={otp}
                            onChange={setOtp}
                            onComplete={handleVerify}
                        />

                        <Box sx={{ mb: 4 }}>
                            {timer > 0 ? (
                                <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 'bold' }}>
                                    {t('otp.resend_in') || 'Resend OTP in'} {timer}s
                                </Typography>
                            ) : (
                                <Button
                                    onClick={handleResend}
                                    variant="text"
                                    sx={{ fontWeight: 'bold' }}
                                >
                                    {t('otp.resend') || 'Resend OTP'}
                                </Button>
                            )}
                        </Box>

                        <ActionButtons
                            onPrimary={() => handleVerify()}
                            onSecondary={showBackButton ? onBack : undefined}
                            primaryText={resolvedVerifyText}
                            secondaryText={resolvedBackText}
                            primaryDisabled={otp.join('').length !== 6}
                        />

                        {demoHint && (
                            <Typography variant="caption" display="block" sx={{ mt: 3, color: 'text.disabled' }}>
                                ({demoHint})
                            </Typography>
                        )}
                    </motion.div>
                ) : (
                    <SuccessState
                        message={resolvedSuccessMessage}
                        subMessage={resolvedSuccessSubMessage}
                    />
                )}
            </AnimatePresence>
        </KioskPage>
    );
}
