import React, { useState } from 'react';
import { Box, Typography, Button, TextField, FormControl, FormLabel } from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';
import OTPFieldGroup from '../OTPFieldGroup';
import SuccessState from '../SuccessState';

interface PinChangeFormProps {
    onCancel: () => void;
    onComplete: (newPin: string) => void;
    loading?: boolean;
}

const STEPS = {
    OTP: 0,
    NEW_PIN: 1,
    CONFIRM_PIN: 2,
    SUCCESS: 3
};

const PinChangeForm: React.FC<PinChangeFormProps> = ({ onCancel, onComplete, loading }) => {
    const [step, setStep] = useState(STEPS.OTP);
    const [otp, setOtp] = useState<string[]>(Array(6).fill(''));
    const [newPin, setNewPin] = useState('');
    const [confirmPin, setConfirmPin] = useState('');
    const [error, setError] = useState('');

    const handleOtpChange = (newOtp: string[]) => {
        setOtp(newOtp);
    };

    const handleOtpComplete = (code: string) => {
        // Simulate OTP verification
        setTimeout(() => setStep(STEPS.NEW_PIN), 1000);
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
                            Enter the 6-digit code sent to your mobile number ending in **88
                        </Typography>

                        <OTPFieldGroup
                            length={6}
                            value={otp}
                            onChange={handleOtpChange}
                            onComplete={handleOtpComplete}
                        />

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
