import React from 'react';
import { Box, Typography, Button, CircularProgress } from '@mui/material';
import { useRouter } from 'expo-router';
import { AnimatePresence } from 'framer-motion';
import SuccessState from '../../src/components/SuccessState';
import KioskPage from '../../src/components/KioskPage';
import WizardStepper from '../../src/components/WizardStepper';
import { useThemeContext } from '../../src/context/ThemeContext';
import { useToast } from '../../src/context/ToastContext';
import { useFundTransfer } from '../../src/hooks/service-wizards/useFundTransfer';
import { RecipientSelection } from '../../src/components/service-wizards/fund-transfer/RecipientSelection';
import { AmountEntry } from '../../src/components/service-wizards/fund-transfer/AmountEntry';
import { TransferReview } from '../../src/components/service-wizards/fund-transfer/TransferReview';

export default function FundTransferWizard() {
    const router = useRouter();
    const { mode } = useThemeContext();
    const { showSuccess } = useToast();
    const isDark = mode === 'dark';

    const {
        step, setStep, loading, setLoading, form, setForm, errors,
        isNewBeneficiary, setIsNewBeneficiary, mockRefNo, setMockRefNo,
        handleNext, handleBack, getBeneficiaryDetails, submitTransfer
    } = useFundTransfer();

    const handleConfirm = async () => {
        // useFundTransfer hook's submitTransfer handles loading state, 
        // service call, and step update on success.
        await submitTransfer();
    };

    if (step === 4) {
        return (
            <KioskPage maxWidth={800}>
                <SuccessState
                    message="Transfer Successful!"
                    subMessage={`Ref No: ${mockRefNo}`}
                    onHome={() => router.push('/dashboard')}
                />
            </KioskPage>
        );
    }

    return (
        <KioskPage maxWidth={800}>
            <Typography variant="h4" color="primary" gutterBottom sx={{ fontWeight: 'bold' }}>
                Fund Transfer
            </Typography>

            {/* Stepper */}
            <WizardStepper steps={3} currentStep={step} />

            <AnimatePresence mode="wait">
                {step === 1 && (
                    <RecipientSelection
                        form={form}
                        setForm={setForm}
                        errors={errors}
                        isNewBeneficiary={isNewBeneficiary}
                        setIsNewBeneficiary={setIsNewBeneficiary}
                        isDark={isDark}
                    />
                )}

                {step === 2 && (
                    <AmountEntry
                        form={form}
                        setForm={setForm}
                        errors={errors}
                    />
                )}

                {step === 3 && (
                    <TransferReview
                        form={form}
                        getBeneficiaryDetails={getBeneficiaryDetails}
                        isDark={isDark}
                    />
                )}
            </AnimatePresence>

            <Box sx={{ mt: 4, display: 'flex', justifyContent: 'space-between', gap: 2 }}>
                <Button
                    disabled={loading}
                    onClick={() => step === 1 ? router.push('/dashboard') : handleBack()}
                    variant="outlined"
                    size="large"
                    sx={{ height: 56, flex: 1, borderRadius: 2 }}
                >
                    {step === 1 ? 'Cancel' : 'Back'}
                </Button>

                {step < 3 ? (
                    <Button
                        variant="contained"
                        size="large"
                        onClick={handleNext}
                        sx={{ height: 56, flex: 2, borderRadius: 2 }}
                    >
                        Next
                    </Button>
                ) : (
                    <Button
                        variant="contained"
                        color="success"
                        size="large"
                        onClick={handleConfirm}
                        disabled={loading}
                        sx={{ height: 56, flex: 2, borderRadius: 2 }}
                    >
                        {loading ? <CircularProgress size={24} color="inherit" /> : 'Confirm Transfer'}
                    </Button>
                )}
            </Box>
        </KioskPage>
    );
}
