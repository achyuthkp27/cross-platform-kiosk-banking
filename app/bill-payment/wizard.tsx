import React from 'react';
import { Typography } from '@mui/material';
import { useRouter } from 'expo-router';
import { AnimatePresence } from 'framer-motion';
import SuccessState from '../../src/components/SuccessState';
import KioskPage from '../../src/components/KioskPage';
import WizardStepper from '../../src/components/WizardStepper';
import { useThemeContext } from '../../src/context/ThemeContext';
import { useToast } from '../../src/context/ToastContext';
import { useBillPayment } from '../../src/hooks/service-wizards/useBillPayment';
import { CategorySelection } from '../../src/components/service-wizards/bill-payment/CategorySelection';
import { BillDetailsForm } from '../../src/components/service-wizards/bill-payment/BillDetailsForm';
import { BillReview } from '../../src/components/service-wizards/bill-payment/BillReview';

export default function BillPaymentWizard() {
    const router = useRouter();
    const { mode } = useThemeContext();
    const { showSuccess } = useToast();
    const isDark = mode === 'dark';

    const {
        step, setStep, loading, setLoading, category, handleCategorySelect,
        biller, setBiller, consumerNo, setConsumerNo, billDetails,
        error, setError, mockTxnId, setMockTxnId, fetchBill
    } = useBillPayment();

    const handleConfirm = () => {
        setLoading(true);
        setTimeout(() => {
            setLoading(false);
            const txnId = `BP${Date.now()}99`;
            setMockTxnId(txnId);
            showSuccess(`Bill paid successfully! Txn: ${txnId}`);
            setStep(4);
        }, 2000);
    };

    if (step === 4) {
        return (
            <KioskPage maxWidth={900}>
                <SuccessState
                    message="Bill Payment Successful!"
                    subMessage={`Transaction ID: ${mockTxnId}`}
                    onHome={() => router.push('/dashboard')}
                />
            </KioskPage>
        );
    }

    return (
        <KioskPage maxWidth={900}>
            <Typography variant="h4" color="primary" gutterBottom sx={{ fontWeight: 'bold' }}>
                Bill Payments
            </Typography>

            {/* Stepper */}
            <WizardStepper steps={3} currentStep={step} />

            <AnimatePresence mode="wait">
                {step === 1 && (
                    <CategorySelection
                        handleCategorySelect={handleCategorySelect}
                        onCancel={() => router.push('/dashboard')}
                        isDark={isDark}
                    />
                )}

                {step === 2 && (
                    <BillDetailsForm
                        category={category}
                        biller={biller}
                        setBiller={setBiller}
                        consumerNo={consumerNo}
                        setConsumerNo={setConsumerNo}
                        error={error}
                        setError={setError}
                        fetchBill={fetchBill}
                        loading={loading}
                        onBack={() => setStep(1)}
                    />
                )}

                {step === 3 && billDetails && (
                    <BillReview
                        biller={biller}
                        consumerNo={consumerNo}
                        billDetails={billDetails}
                        isDark={isDark}
                        onBack={() => setStep(2)}
                        onConfirm={handleConfirm}
                        loading={loading}
                    />
                )}
            </AnimatePresence>
        </KioskPage>
    );
}
