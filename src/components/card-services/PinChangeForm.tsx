import React, { useState, useEffect } from 'react';
import { Box, Typography, Button, TextField, FormControl, FormLabel } from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';
import { useToast } from '../../context/ToastContext';
import { useLanguage } from '../../context/LanguageContext';
import { otpService } from '../../services';
import OTPFieldGroup from '../OTPFieldGroup';
import SuccessState from '../SuccessState';

const STEPS = {
    CARD_DETAILS: 0,
    OTP: 1,
    NEW_PIN: 2,
    CONFIRM_PIN: 3,
    SUCCESS: 4
};

interface PinChangeFormProps {
    onCancel: () => void;
    onComplete: (newPin: string) => void;
    loading?: boolean;
}

const PinChangeForm: React.FC<PinChangeFormProps> = ({ onCancel, onComplete, loading }) => {
    const { t } = useLanguage();
    const { showToast } = useToast();
    const [step, setStep] = useState(STEPS.OTP); // Start at OTP for now as per previous flow
    const [otp, setOtp] = useState<string[]>(Array(6).fill(''));
    const [newPin, setNewPin] = useState('');
    const [confirmPin, setConfirmPin] = useState('');
    const [error, setError] = useState('');
    const [generatingOtp, setGeneratingOtp] = useState(false);
    const [verifyingOtp, setVerifyingOtp] = useState(false);

    // Initial OTP Generation
    useEffect(() => {
        if (step === STEPS.OTP && !generatingOtp) {
            generateOtp();
        }
    }, [step]); // removed generatingOtp from deps to avoid loop if logic changes

    const generateOtp = async () => {
        setGeneratingOtp(true);
        setError('');
        try {
            const response = await otpService.generate({ identifier: 'card-123-user' });
            if (response.success) {
                console.log("OTP generated and sent.");
            } else {
                 setError(response.message || 'Failed to generate OTP');
            }
        } catch (err) {
            setError('Failed to generate OTP. Please try again.');
        } finally {
            setGeneratingOtp(false);
        }
    };

    const handleOtpChange = (newOtp: string[]) => {
        setOtp(newOtp);
        if (error) setError('');
    };

    const handleOtpVerify = async (code: string) => {
        setVerifyingOtp(true);
        setError('');

        try {
            // Validate using the code passed from OTPFieldGroup
            const response = await otpService.validate({ identifier: 'card-123-user', code });

            if (response.success && response.data?.valid) {
                setStep(STEPS.NEW_PIN);
            } else {
                setError(response.data?.message || response.message || t('card.invalid_otp') || 'Invalid OTP');
                setOtp(Array(6).fill(''));
            }
        } catch (err) {
            setError('Failed to verify OTP. Please try again.');
        } finally {
            setVerifyingOtp(false);
        }
    };

    const handleNewPinSubmit = () => {
        if (newPin.length !== 4) {
            setError('PIN must be 4 digits');
            return;
        }
        setError('');
        setStep(STEPS.CONFIRM_PIN);
    };

    const handleConfirmSubmit = () => {
        if (confirmPin !== newPin) {
            setError('PINs do not match');
            return;
        }
        onComplete(newPin);
    };

    return (
        <Box sx={{ maxWidth: 400, mx: 'auto', textAlign: 'center' }}>
            <AnimatePresence mode="wait">
                {step === STEPS.OTP && (
                    <motion.div
                        key="otp"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                    >
                        <Typography variant="h6" gutterBottom>Verify it's you</Typography>
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 4 }}>
                            Enter the 6-digit code sent to your mobile number.
                        </Typography>

                        <OTPFieldGroup
                            length={6}
                            value={otp}
                            onChange={handleOtpChange}
                            onComplete={handleOtpVerify}
                        />

                        {generatingOtp && <Typography variant="caption">Sending OTP...</Typography>}
                        {verifyingOtp && <Typography variant="caption">Verifying...</Typography>}

                        <Button onClick={onCancel} sx={{ mt: 4 }}>Cancel</Button>
                    </motion.div>
                )}

                {step === STEPS.NEW_PIN && (
                    <motion.div
                        key="new-pin"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                    >
                        <Typography variant="h6" gutterBottom>Set New PIN</Typography>
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 4 }}>
                            Enter a new 4-digit PIN for your card
                        </Typography>

                        <TextField
                            type="password"
                            variant="outlined"
                            value={newPin}
                            onChange={(e) => {
                                if (/^\d*$/.test(e.target.value) && e.target.value.length <= 4) {
                                    setNewPin(e.target.value);
                                    setError('');
                                }
                            }}
                            fullWidth
                            label="New PIN"
                            inputProps={{ maxLength: 4, style: { textAlign: 'center', letterSpacing: '1em' } }}
                            error={!!error}
                            helperText={error}
                            sx={{ mb: 3 }}
                        />

                        <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center' }}>
                            <Button onClick={() => setStep(STEPS.OTP)} variant="outlined" color="inherit">Back</Button>
                            <Button
                                onClick={handleNewPinSubmit}
                                variant="contained"
                                disabled={newPin.length !== 4}
                            >
                                Next
                            </Button>
                        </Box>
                    </motion.div>
                )}

                {step === STEPS.CONFIRM_PIN && (
                    <motion.div
                        key="confirm-pin"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                    >
                        <Typography variant="h6" gutterBottom>Confirm New PIN</Typography>
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 4 }}>
                            Re-enter your new 4-digit PIN
                        </Typography>

                        <TextField
                            type="password"
                            variant="outlined"
                            value={confirmPin}
                            onChange={(e) => {
                                if (/^\d*$/.test(e.target.value) && e.target.value.length <= 4) {
                                    setConfirmPin(e.target.value);
                                    setError('');
                                }
                            }}
                            fullWidth
                            label="Confirm PIN"
                            inputProps={{ maxLength: 4, style: { textAlign: 'center', letterSpacing: '1em' } }}
                            error={!!error}
                            helperText={error}
                            sx={{ mb: 3 }}
                        />

                        <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center' }}>
                            <Button onClick={() => setStep(STEPS.NEW_PIN)} variant="outlined" color="inherit">Back</Button>
                            <Button
                                onClick={handleConfirmSubmit}
                                variant="contained"
                                disabled={confirmPin.length !== 4 || loading}
                            >
                                {loading ? 'Updating...' : 'Confirm'}
                            </Button>
                        </Box>
                    </motion.div>
                )}
            </AnimatePresence>
        </Box>
    );
};

export default PinChangeForm;
