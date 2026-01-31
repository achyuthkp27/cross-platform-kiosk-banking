import React, { useState, useEffect } from 'react';
import { Box, Typography, Button, Paper, Grid, Stepper, Step, StepLabel, Card, CardContent, Divider, Checkbox, FormControlLabel, CircularProgress } from '@mui/material';
import KioskTextField from '../../src/components/KioskTextField';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { motion, AnimatePresence } from 'framer-motion';
import SuccessState from '../../src/components/SuccessState';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { useThemeContext } from '../../src/context/ThemeContext';
import { useToast } from '../../src/context/ToastContext';
import { accountService, chequeBookService } from '../../src/services';
import { Account } from '../../src/types/services';

const steps = ['Select Account', 'Cheque Leaves', 'Delivery Address', 'Review'];

export default function ChequeBookOrder() {
    const router = useRouter();
    const params = useLocalSearchParams();
    // Assuming userId is passed or we can get it from context/params. 
    // If not passed, we might need to rely on a user context or session. 
    // For now, let's assume it's passed or we redirect if missing (similar to Account Statement).
    const userId = params.userId as string || 'USER001'; // Fallback for dev if not strict

    const { mode } = useThemeContext();
    const { showSuccess, showError } = useToast();
    const isDark = mode === 'dark';
    
    const [activeStep, setActiveStep] = useState(0);
    const [accounts, setAccounts] = useState<Account[]>([]);
    const [loadingAccounts, setLoadingAccounts] = useState(true);
    const [selectedAccount, setSelectedAccount] = useState<number | null>(null); // Account ID is number
    const [selectedLeaves, setSelectedLeaves] = useState<number | null>(null);
    const [confirmed, setConfirmed] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [successData, setSuccessData] = useState<{ refNo: string; estimate: string } | null>(null);

    const leafOptions = [25, 50, 100];
    const [deliveryAddress, setDeliveryAddress] = useState({
        line1: '123, Highland Park',
        line2: 'Financial District',
        city: 'Metropolis',
        pin: '500081'
    });
    const [isEditingAddress, setIsEditingAddress] = useState(false);

    useEffect(() => {
        const fetchAccounts = async () => {
            try {
                const response = await accountService.getAccounts(userId);
                if (response.success && response.data) {
                    setAccounts(response.data);
                } else {
                    showError('Failed to load accounts');
                }
            } catch (error) {
                console.error(error);
                showError('Error loading accounts');
            } finally {
                setLoadingAccounts(false);
            }
        };

        fetchAccounts();
    }, [userId]);

    const handleNext = () => {
        if (activeStep === steps.length - 1) {
            handleSubmit();
        } else {
            setActiveStep((prev) => prev + 1);
        }
    };

    const handleBack = () => {
        setActiveStep((prev) => prev - 1);
    };

    const handleSubmit = async () => {
        if (!selectedAccount || !selectedLeaves) return;

        setSubmitting(true);
        try {
            const response = await chequeBookService.requestChequeBook({
                accountId: selectedAccount.toString(),
                leaves: selectedLeaves,
                deliveryAddress
            });

            if (response.success && response.data) {
                setSuccessData({
                    refNo: response.data.referenceId,
                    estimate: response.data.deliveryEstimate
                });
                setIsSuccess(true);
                showSuccess('Cheque book request submitted successfully!');
            } else {
                showError(response.message || 'Request failed');
            }
        } catch (error) {
            console.error(error);
            showError('An error occurred while submitting the request');
        } finally {
            setSubmitting(false);
        }
    };

    const isStepValid = () => {
        if (activeStep === 0) return !!selectedAccount;
        if (activeStep === 1) return !!selectedLeaves;
        if (activeStep === 2) return !!deliveryAddress.line1 && !!deliveryAddress.pin;
        if (activeStep === 3) return confirmed;
        return false;
    };

    if (loadingAccounts) {
        return (
            <Box sx={{ height: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <CircularProgress />
            </Box>
        );
    }

    if (isSuccess && successData) {
        return (
            <Box sx={{
                height: '100vh',
                bgcolor: isDark ? '#020617' : '#F0F2F5',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'bgcolor 0.4s ease',
            }}>
                <Paper elevation={3} sx={{
                    p: 6,
                    borderRadius: 4,
                    width: '100%',
                    maxWidth: 600,
                    bgcolor: isDark ? 'rgba(15, 23, 42, 0.8)' : 'white',
                    border: isDark ? '1px solid rgba(255,255,255,0.1)' : 'none',
                }}>
                    <SuccessState
                        message="Order Placed Successfully"
                        subMessage={`Ref No: ${successData.refNo}\nExpected Delivery: ${successData.estimate}`}
                    />
                    <Box sx={{ mt: 4, display: 'flex', gap: 2 }}>
                        <Button fullWidth variant="outlined" size="large" onClick={() => { window.print() }}>Print Receipt</Button>
                        <Button fullWidth variant="contained" size="large" onClick={() => router.push('/dashboard')}>Dashboard</Button>
                    </Box>
                </Paper>
            </Box>
        );
    }

    return (
        <Box sx={{
            minHeight: '100vh',
            bgcolor: isDark ? '#020617' : '#F0F2F5',
            display: 'flex',
            flexDirection: 'column',
            transition: 'bgcolor 0.4s ease',
        }}>
            {/* Header */}
            <Paper elevation={1} sx={{
                p: 2,
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                bgcolor: isDark ? 'rgba(15, 23, 42, 0.8)' : 'white',
                borderBottom: isDark ? '1px solid rgba(255,255,255,0.1)' : 'none',
            }}>
                <Typography variant="h6" color="primary" sx={{ fontWeight: 'bold' }}>Request Cheque Book</Typography>
                <Button color="error" onClick={() => router.push('/dashboard')} sx={{ mr: 18 }}>Cancel</Button>
            </Paper>

            <Box sx={{ flexGrow: 1, p: 4, display: 'flex', justifyContent: 'center' }}>
                <Paper elevation={0} sx={{
                    width: '100%',
                    maxWidth: 900,
                    p: 4,
                    borderRadius: 4,
                    bgcolor: isDark ? 'rgba(15, 23, 42, 0.6)' : 'white',
                    border: isDark ? '1px solid rgba(255,255,255,0.1)' : 'none',
                }}>

                    <Stepper activeStep={activeStep} alternativeLabel sx={{ mb: 6 }}>
                        {steps.map((label) => (
                            <Step key={label}>
                                <StepLabel sx={{
                                    '& .MuiStepLabel-label': {
                                        color: isDark ? '#94A3B8' : 'text.secondary',
                                        '&.Mui-active': { color: 'primary.main' },
                                        '&.Mui-completed': { color: isDark ? '#4ADE80' : 'success.main' },
                                    }
                                }}>{label}</StepLabel>
                            </Step>
                        ))}
                    </Stepper>

                    <AnimatePresence mode="wait">
                        <motion.div
                            key={activeStep}
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            transition={{ duration: 0.3 }}
                        >
                            {/* Step 1: Select Account */}
                            {activeStep === 0 && (
                                <Grid container spacing={3}>
                                    {accounts.map((acc) => (
                                        <Grid size={{ xs: 12, md: 6 }} key={acc.id}>
                                            <Card
                                                onClick={() => setSelectedAccount(acc.id)}
                                                sx={{
                                                    cursor: 'pointer',
                                                    border: selectedAccount === acc.id ? '2px solid' : '1px solid',
                                                    borderColor: selectedAccount === acc.id ? 'primary.main' : (isDark ? 'rgba(255,255,255,0.1)' : '#e0e0e0'),
                                                    bgcolor: selectedAccount === acc.id
                                                        ? (isDark ? 'rgba(56, 189, 248, 0.1)' : 'primary.50')
                                                        : (isDark ? 'rgba(15, 23, 42, 0.6)' : 'white'),
                                                    transition: 'all 0.2s'
                                                }}
                                            >
                                                <CardContent>
                                                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                                        <Typography variant="subtitle1" fontWeight="bold" color={isDark ? '#F8FAFC' : 'text.primary'}>{acc.type}</Typography>
                                                        {selectedAccount === acc.id && <CheckCircleIcon color="primary" />}
                                                    </Box>
                                                    <Typography variant="h5" sx={{ my: 1, color: isDark ? '#E2E8F0' : 'text.primary' }}>{acc.accountNumber}</Typography>
                                                    <Typography variant="body2" color={isDark ? '#94A3B8' : 'text.secondary'}>Balance: ${acc.balance.toFixed(2)}</Typography>
                                                </CardContent>
                                            </Card>
                                        </Grid>
                                    ))}
                                </Grid>
                            )}

                            {/* Step 2: Select Leaves */}
                            {activeStep === 1 && (
                                <Grid container spacing={3} justifyContent="center">
                                    {leafOptions.map((leaves) => (
                                        <Grid size={{ xs: 12, md: 4 }} key={leaves}>
                                            <Card
                                                onClick={() => setSelectedLeaves(leaves)}
                                                sx={{
                                                    cursor: 'pointer',
                                                    textAlign: 'center',
                                                    p: 2,
                                                    border: selectedLeaves === leaves ? '2px solid' : '1px solid',
                                                    borderColor: selectedLeaves === leaves ? 'primary.main' : (isDark ? 'rgba(255,255,255,0.1)' : '#e0e0e0'),
                                                    bgcolor: selectedLeaves === leaves
                                                        ? (isDark ? 'rgba(56, 189, 248, 0.1)' : 'primary.50')
                                                        : (isDark ? 'rgba(15, 23, 42, 0.6)' : 'white')
                                                }}
                                            >
                                                <CardContent>
                                                    <Typography variant="h3" color="primary" fontWeight="bold">{leaves}</Typography>
                                                    <Typography variant="body1" color={isDark ? '#94A3B8' : 'text.secondary'}>Leaves</Typography>
                                                </CardContent>
                                            </Card>
                                        </Grid>
                                    ))}
                                </Grid>
                            )}

                            {/* Step 3: Address */}
                            {activeStep === 2 && (
                                <Box sx={{ maxWidth: 500, mx: 'auto' }}>
                                    <Typography variant="h6" gutterBottom color={isDark ? '#F8FAFC' : 'text.primary'}>Delivery Address</Typography>
                                    <Paper variant="outlined" sx={{
                                        p: 3,
                                        bgcolor: isDark ? 'rgba(15, 23, 42, 0.4)' : '#fafafa',
                                        border: isDark ? '1px solid rgba(255,255,255,0.1)' : '1px solid rgba(0,0,0,0.12)',
                                    }}>
                                        <Typography variant="body1" fontWeight="bold" sx={{ mb: 2, color: isDark ? '#F8FAFC' : 'text.primary' }}>Registered Address:</Typography>

                                        {isEditingAddress ? (
                                            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                                                <KioskTextField
                                                    label="Line 1"
                                                    value={deliveryAddress.line1}
                                                    onChange={(e) => setDeliveryAddress({ ...deliveryAddress, line1: e.target.value })}
                                                    fullWidth
                                                    size="small"
                                                />
                                                <KioskTextField
                                                    label="Line 2"
                                                    value={deliveryAddress.line2}
                                                    onChange={(e) => setDeliveryAddress({ ...deliveryAddress, line2: e.target.value })}
                                                    fullWidth
                                                    size="small"
                                                />
                                                <Box sx={{ display: 'flex', gap: 2 }}>
                                                    <KioskTextField
                                                        label="City"
                                                        value={deliveryAddress.city}
                                                        onChange={(e) => setDeliveryAddress({ ...deliveryAddress, city: e.target.value })}
                                                        fullWidth
                                                        size="small"
                                                    />
                                                    <KioskTextField
                                                        label="PIN"
                                                        value={deliveryAddress.pin}
                                                        keyboardType="numeric"
                                                        onChange={(e) => setDeliveryAddress({ ...deliveryAddress, pin: e.target.value })}
                                                        fullWidth
                                                        size="small"
                                                    />
                                                </Box>
                                            </Box>
                                        ) : (
                                            <Box>
                                                <Typography variant="body1" color={isDark ? '#E2E8F0' : 'text.primary'}>{deliveryAddress.line1}</Typography>
                                                <Typography variant="body1" color={isDark ? '#E2E8F0' : 'text.primary'}>{deliveryAddress.line2}</Typography>
                                                <Typography variant="body1" color={isDark ? '#E2E8F0' : 'text.primary'}>{deliveryAddress.city} - {deliveryAddress.pin}</Typography>
                                            </Box>
                                        )}

                                        <Button
                                            variant={isEditingAddress ? "contained" : "text"}
                                            color={isEditingAddress ? "primary" : "primary"}
                                            sx={{ mt: 2 }}
                                            onClick={() => setIsEditingAddress(!isEditingAddress)}
                                        >
                                            {isEditingAddress ? 'Save Address' : 'Edit Address'}
                                        </Button>
                                    </Paper>
                                </Box>
                            )}

                            {/* Step 4: Review */}
                            {activeStep === 3 && (
                                <Box sx={{ maxWidth: 600, mx: 'auto' }}>
                                    <Typography variant="h6" gutterBottom color={isDark ? '#F8FAFC' : 'text.primary'}>Review Order</Typography>
                                    <Paper variant="outlined" sx={{
                                        p: 3,
                                        bgcolor: isDark ? 'rgba(15, 23, 42, 0.4)' : 'white',
                                        border: isDark ? '1px solid rgba(255,255,255,0.1)' : '1px solid rgba(0,0,0,0.12)',
                                    }}>
                                        <Grid container spacing={2}>
                                            <Grid size={6}><Typography color={isDark ? '#94A3B8' : 'text.secondary'}>Account</Typography></Grid>
                                            <Grid size={6}><Typography fontWeight="bold" color={isDark ? '#F8FAFC' : 'text.primary'}>{accounts.find(a => a.id === selectedAccount)?.accountNumber}</Typography></Grid>

                                            <Grid size={6}><Typography color={isDark ? '#94A3B8' : 'text.secondary'}>Cheque Book Size</Typography></Grid>
                                            <Grid size={6}><Typography fontWeight="bold" color={isDark ? '#F8FAFC' : 'text.primary'}>{selectedLeaves} Leaves</Typography></Grid>

                                            <Grid size={6}><Typography color={isDark ? '#94A3B8' : 'text.secondary'}>Delivery To</Typography></Grid>
                                            <Grid size={6}><Typography fontWeight="bold" color={isDark ? '#F8FAFC' : 'text.primary'}>{deliveryAddress.pin}</Typography></Grid>

                                            <Grid size={12}><Divider sx={{ my: 1, borderColor: isDark ? 'rgba(255,255,255,0.1)' : 'divider' }} /></Grid>

                                            <Grid size={6}><Typography variant="h6" color={isDark ? '#F8FAFC' : 'text.primary'}>Total Charges</Typography></Grid>
                                            <Grid size={6}><Typography variant="h6" color="primary">Free</Typography></Grid>
                                        </Grid>
                                    </Paper>
                                    <Box sx={{ mt: 3 }}>
                                        <FormControlLabel
                                            control={<Checkbox checked={confirmed} onChange={(e) => setConfirmed(e.target.checked)} />}
                                            label={<Typography color={isDark ? '#E2E8F0' : 'text.primary'}>I confirm the above details are correct.</Typography>}
                                        />
                                    </Box>
                                </Box>
                            )}
                        </motion.div>
                    </AnimatePresence>

                    {/* Actions */}
                    <Box sx={{ mt: 6, display: 'flex', justifyContent: 'space-between' }}>
                        <Button
                            disabled={activeStep === 0 || submitting}
                            onClick={handleBack}
                            variant="outlined"
                            size="large"
                            sx={{
                                minWidth: 120,
                                borderRadius: 2,
                                borderColor: isDark ? 'rgba(255,255,255,0.2)' : undefined,
                                color: isDark ? '#F8FAFC' : undefined,
                                '&:hover': {
                                    borderColor: isDark ? 'rgba(255,255,255,0.4)' : undefined,
                                },
                                '&:disabled': {
                                    borderColor: isDark ? 'rgba(255,255,255,0.1)' : undefined,
                                    color: isDark ? 'rgba(255,255,255,0.3)' : undefined,
                                }
                            }}
                        >
                            Back
                        </Button>
                        <Button
                            variant="contained"
                            onClick={handleNext}
                            disabled={!isStepValid() || submitting}
                            size="large"
                            sx={{ minWidth: 120, borderRadius: 2 }}
                        >
                            {submitting ? <CircularProgress size={24} color="inherit" /> : activeStep === steps.length - 1 ? 'Confirm Order' : 'Next'}
                        </Button>
                    </Box>

                </Paper>
            </Box>
        </Box>
    );
}
