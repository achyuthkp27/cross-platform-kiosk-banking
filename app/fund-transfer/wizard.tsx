import React, { useState } from 'react';
import { Box, Typography, Button, MenuItem, Grid, CircularProgress, Stack, useTheme } from '@mui/material';
import KioskTextField from '../../src/components/KioskTextField';
import { useRouter } from 'expo-router';
import { motion, AnimatePresence } from 'framer-motion';
import SuccessState from '../../src/components/SuccessState';
import KioskPage from '../../src/components/KioskPage';
import WizardStepper from '../../src/components/WizardStepper';
import ActionButtons from '../../src/components/ActionButtons';
import { useThemeContext } from '../../src/context/ThemeContext';

const MOCK_ACCOUNTS = [
    { id: '1', number: 'xxxx1234', type: 'Savings', balance: 50000 },
    { id: '2', number: 'xxxx5678', type: 'Current', balance: 125000 },
];

const MOCK_BENEFICIARIES = [
    { id: '1', name: 'Alice Smith', account: '9876543210', ifsc: 'HDFC0001234' },
    { id: '2', name: 'Bob Jones', account: '1122334455', ifsc: 'SBIN0006789' },
];

interface FormState {
    fromAccount: string;
    beneficiaryId: string;
    amount: string;
    remarks: string;
    newBeneficiary: { name: string; account: string; confirmAccount: string; ifsc: string };
}

export default function FundTransferWizard() {
    const router = useRouter();
    const theme = useTheme();
    const { mode } = useThemeContext();
    const isDark = mode === 'dark';
    const [step, setStep] = useState(1);
    const [loading, setLoading] = useState(false);
    const [form, setForm] = useState<FormState>({
        fromAccount: '',
        beneficiaryId: '',
        amount: '',
        remarks: '',
        newBeneficiary: { name: '', account: '', confirmAccount: '', ifsc: '' }
    });
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [isNewBeneficiary, setIsNewBeneficiary] = useState(false);
    const [mockRefNo, setMockRefNo] = useState('');

    const validateStep1 = () => {
        const newErrors: Record<string, string> = {};
        if (!form.fromAccount) newErrors.fromAccount = 'Please select an account';

        if (isNewBeneficiary) {
            if (!form.newBeneficiary.name) newErrors.name = 'Name is required';
            if (!form.newBeneficiary.account) newErrors.account = 'Account Number is required';
            if (form.newBeneficiary.account !== form.newBeneficiary.confirmAccount) {
                newErrors.confirmAccount = 'Account numbers do not match';
            }
            if (!/^[A-Z]{4}0[A-Z0-9]{6}$/.test(form.newBeneficiary.ifsc)) {
                newErrors.ifsc = 'Invalid IFSC Code (e.g., HDFC0001234)';
            }
        } else {
            if (!form.beneficiaryId) newErrors.beneficiaryId = 'Please select a beneficiary';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const validateStep2 = () => {
        const newErrors: Record<string, string> = {};
        const amount = Number(form.amount);
        const selectedAccount = MOCK_ACCOUNTS.find(a => a.id === form.fromAccount);

        if (!form.amount || isNaN(amount) || amount <= 0) {
            newErrors.amount = 'Please enter a valid amount';
        } else if (selectedAccount && amount > selectedAccount.balance) {
            newErrors.amount = 'Insufficient Funds';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleNext = () => {
        let valid = false;
        if (step === 1) valid = validateStep1();
        if (step === 2) valid = validateStep2();

        if (valid) setStep(prev => prev + 1);
    };

    const handleConfirm = () => {
        setLoading(true);
        setTimeout(() => {
            setLoading(false);
            setMockRefNo(`FT${Date.now()}88`);
            setStep(4);
        }, 2000);
    };

    const getBeneficiaryDetails = () => {
        if (isNewBeneficiary) return `${form.newBeneficiary.name} (${form.newBeneficiary.account})`;
        const ben = MOCK_BENEFICIARIES.find(b => b.id === form.beneficiaryId);
        return ben ? `${ben.name} (${ben.account})` : '';
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
                    <motion.div key="step1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                        <Typography variant="h6" gutterBottom align="left">Select Account & Beneficiary</Typography>

                        <KioskTextField
                            select
                            fullWidth
                            label="From Account"
                            value={form.fromAccount}
                            onChange={(e) => setForm({ ...form, fromAccount: e.target.value })}
                            error={!!errors.fromAccount}
                            helperText={errors.fromAccount}
                            sx={{ mb: 3 }}
                        >
                            {MOCK_ACCOUNTS.map((acc) => (
                                <MenuItem key={acc.id} value={acc.id}>
                                    {acc.type} - {acc.number} (Balance: ₹{acc.balance})
                                </MenuItem>
                            ))}
                        </KioskTextField>

                        {!isNewBeneficiary ? (
                            <>
                                <KioskTextField
                                    select
                                    fullWidth
                                    label="Select Beneficiary"
                                    value={form.beneficiaryId}
                                    onChange={(e) => setForm({ ...form, beneficiaryId: e.target.value })}
                                    error={!!errors.beneficiaryId}
                                    helperText={errors.beneficiaryId}
                                    sx={{ mb: 2 }}
                                >
                                    {MOCK_BENEFICIARIES.map((ben) => (
                                        <MenuItem key={ben.id} value={ben.id}>
                                            {ben.name} - {ben.account}
                                        </MenuItem>
                                    ))}
                                </KioskTextField>
                                <Button
                                    onClick={() => setIsNewBeneficiary(true)}
                                    sx={{ fontWeight: 'bold', mb: 2 }}
                                >
                                    + Add New Beneficiary
                                </Button>
                            </>
                        ) : (
                            <Box sx={{ p: 3, border: `1px solid ${isDark ? 'rgba(255,255,255,0.1)' : '#ddd'}`, borderRadius: 3, textAlign: 'left', mb: 2, bgcolor: isDark ? 'rgba(15, 23, 42, 0.4)' : 'transparent' }}>
                                <Typography variant="subtitle1" gutterBottom fontWeight="bold">New Beneficiary Details</Typography>
                                <Grid container spacing={2}>
                                    <Grid size={12}>
                                        <KioskTextField
                                            fullWidth label="Name"
                                            value={form.newBeneficiary.name}
                                            onChange={(e) => setForm({ ...form, newBeneficiary: { ...form.newBeneficiary, name: e.target.value } })}
                                            error={!!errors.name} helperText={errors.name}
                                        />
                                    </Grid>
                                    <Grid size={6}>
                                        <KioskTextField
                                            fullWidth label="Account Number"
                                            value={form.newBeneficiary.account}
                                            keyboardType="numeric"
                                            onChange={(e) => setForm({ ...form, newBeneficiary: { ...form.newBeneficiary, account: e.target.value } })}
                                            error={!!errors.account} helperText={errors.account}
                                        />
                                    </Grid>
                                    <Grid size={6}>
                                        <KioskTextField
                                            fullWidth label="Confirm Account"
                                            value={form.newBeneficiary.confirmAccount}
                                            keyboardType="numeric"
                                            onChange={(e) => setForm({ ...form, newBeneficiary: { ...form.newBeneficiary, confirmAccount: e.target.value } })}
                                            error={!!errors.confirmAccount} helperText={errors.confirmAccount}
                                        />
                                    </Grid>
                                    <Grid size={12}>
                                        <KioskTextField
                                            fullWidth label="IFSC Code"
                                            value={form.newBeneficiary.ifsc}
                                            onChange={(e) => setForm({ ...form, newBeneficiary: { ...form.newBeneficiary, ifsc: e.target.value.toUpperCase() } })}
                                            error={!!errors.ifsc} helperText={errors.ifsc}
                                        />
                                    </Grid>
                                </Grid>
                                <Button sx={{ mt: 2 }} color="error" onClick={() => setIsNewBeneficiary(false)}>Cancel</Button>
                            </Box>
                        )}
                    </motion.div>
                )}

                {step === 2 && (
                    <motion.div key="step2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                        <Typography variant="h6" gutterBottom align="left">Enter Amount</Typography>

                        <KioskTextField
                            fullWidth
                            label="Amount (₹)"
                            value={form.amount}
                            keyboardType="numeric"
                            onChange={(e) => setForm({ ...form, amount: e.target.value })}
                            error={!!errors.amount}
                            helperText={errors.amount}
                            sx={{ mb: 3 }}
                            InputProps={{ style: { fontSize: 32, fontWeight: 'bold', textAlign: 'center' } }}
                        />

                        <KioskTextField
                            fullWidth
                            label="Remarks (Optional)"
                            value={form.remarks}
                            onChange={(e) => setForm({ ...form, remarks: e.target.value })}
                            multiline
                            rows={2}
                        />
                    </motion.div>
                )}

                {step === 3 && (
                    <motion.div key="step3" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                        <Typography variant="h6" gutterBottom align="left">Review & Confirm</Typography>

                        <Stack spacing={2} sx={{ mb: 4, p: 3, bgcolor: isDark ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.02)', borderRadius: 3, textAlign: 'left', border: isDark ? '1px solid rgba(255,255,255,0.06)' : 'none' }}>
                            <Box>
                                <Typography variant="caption" color="text.secondary">From Account</Typography>
                                <Typography variant="body1" fontWeight="bold">
                                    {MOCK_ACCOUNTS.find(a => a.id === form.fromAccount)?.number}
                                </Typography>
                            </Box>
                            <Box>
                                <Typography variant="caption" color="text.secondary">To Beneficiary</Typography>
                                <Typography variant="body1" fontWeight="bold">{getBeneficiaryDetails()}</Typography>
                            </Box>
                            <Box>
                                <Typography variant="caption" color="text.secondary">Amount</Typography>
                                <Typography variant="h3" color="primary" fontWeight="bold">₹{form.amount}</Typography>
                            </Box>
                            {form.remarks && (
                                <Box>
                                    <Typography variant="caption" color="text.secondary">Remarks</Typography>
                                    <Typography variant="body1">{form.remarks}</Typography>
                                </Box>
                            )}
                        </Stack>
                    </motion.div>
                )}
            </AnimatePresence>

            <Box sx={{ mt: 4, display: 'flex', justifyContent: 'space-between', gap: 2 }}>
                <Button
                    disabled={loading}
                    onClick={() => step === 1 ? router.push('/dashboard') : setStep(prev => prev - 1)}
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
