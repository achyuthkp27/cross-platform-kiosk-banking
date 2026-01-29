import React, { useState } from 'react';
import { Box, Typography, Button, Paper, Grid, Stepper, Step, StepLabel, Card, CardContent, Divider, Checkbox, FormControlLabel, Fade } from '@mui/material';
import KioskTextField from '../../src/components/KioskTextField';
import { useRouter } from 'expo-router';
import { motion, AnimatePresence } from 'framer-motion';
import SuccessState from '../../src/components/SuccessState';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import RadioButtonUncheckedIcon from '@mui/icons-material/RadioButtonUnchecked';

const steps = ['Select Account', 'Cheque Leaves', 'Delivery Address', 'Review'];

export default function ChequeBookOrder() {
    const router = useRouter();
    const [activeStep, setActiveStep] = useState(0);
    const [selectedAccount, setSelectedAccount] = useState<string | null>(null);
    const [selectedLeaves, setSelectedLeaves] = useState<number | null>(null);
    const [confirmed, setConfirmed] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);

    // Mock Data
    const accounts = [
        { id: '1', type: 'Savings Account', number: 'XXXX-XXXX-1234', balance: '$12,450.00' },
        { id: '2', type: 'Current Account', number: 'XXXX-XXXX-5678', balance: '$45,200.50' }
    ];

    const leafOptions = [25, 50, 100];
    const [deliveryAddress, setDeliveryAddress] = useState({
        line1: '123, Highland Park',
        line2: 'Financial District',
        city: 'Metropolis',
        pin: '500081'
    });
    const [isEditingAddress, setIsEditingAddress] = useState(false);

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

    const handleSubmit = () => {
        setIsSuccess(true);
    };

    const isStepValid = () => {
        if (activeStep === 0) return !!selectedAccount;
        if (activeStep === 1) return !!selectedLeaves;
        if (activeStep === 2) return true; // Address is pre-filled
        if (activeStep === 3) return confirmed;
        return false;
    };

    if (isSuccess) {
        return (
            <Box sx={{ height: '100vh', bgcolor: '#F0F2F5', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Paper elevation={3} sx={{ p: 6, borderRadius: 4, width: '100%', maxWidth: 600 }}>
                    <SuccessState
                        message="Order Placed Successfully"
                        subMessage={`Ref No: CB${Math.floor(Math.random() * 1000000)}\nExpected Delivery: 3-5 Business Days`}
                    />
                    <Box sx={{ mt: 4, display: 'flex', gap: 2 }}>
                        <Button fullWidth variant="outlined" size="large" onClick={() => { }}>Print Receipt</Button>
                        <Button fullWidth variant="contained" size="large" onClick={() => router.push('/dashboard')}>Dashboard</Button>
                    </Box>
                </Paper>
            </Box>
        );
    }

    return (
        <Box sx={{ minHeight: '100vh', bgcolor: '#F0F2F5', display: 'flex', flexDirection: 'column' }}>
            {/* Header */}
            <Paper elevation={1} sx={{ p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="h6" color="primary" sx={{ fontWeight: 'bold' }}>Request Cheque Book</Typography>
                <Button color="error" onClick={() => router.push('/dashboard')} sx={{ mr: 10 }}>Cancel</Button>
            </Paper>

            <Box sx={{ flexGrow: 1, p: 4, display: 'flex', justifyContent: 'center' }}>
                <Paper elevation={0} sx={{ width: '100%', maxWidth: 900, p: 4, borderRadius: 4, bgcolor: 'white' }}>

                    <Stepper activeStep={activeStep} alternativeLabel sx={{ mb: 6 }}>
                        {steps.map((label) => (
                            <Step key={label}>
                                <StepLabel>{label}</StepLabel>
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
                                                    borderColor: selectedAccount === acc.id ? 'primary.main' : '#e0e0e0',
                                                    bgcolor: selectedAccount === acc.id ? 'primary.50' : 'white',
                                                    transition: 'all 0.2s'
                                                }}
                                            >
                                                <CardContent>
                                                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                                        <Typography variant="subtitle1" fontWeight="bold">{acc.type}</Typography>
                                                        {selectedAccount === acc.id && <CheckCircleIcon color="primary" />}
                                                    </Box>
                                                    <Typography variant="h5" sx={{ my: 1 }}>{acc.number}</Typography>
                                                    <Typography variant="body2" color="text.secondary">Balance: {acc.balance}</Typography>
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
                                                    borderColor: selectedLeaves === leaves ? 'primary.main' : '#e0e0e0',
                                                    bgcolor: selectedLeaves === leaves ? 'primary.50' : 'white'
                                                }}
                                            >
                                                <CardContent>
                                                    <Typography variant="h3" color="primary" fontWeight="bold">{leaves}</Typography>
                                                    <Typography variant="body1">Leaves</Typography>
                                                </CardContent>
                                            </Card>
                                        </Grid>
                                    ))}
                                </Grid>
                            )}

                            {/* Step 2: Address */}
                            {activeStep === 2 && (
                                <Box sx={{ maxWidth: 500, mx: 'auto' }}>
                                    <Typography variant="h6" gutterBottom>Delivery Address</Typography>
                                    <Paper variant="outlined" sx={{ p: 3, bgcolor: '#fafafa' }}>
                                        <Typography variant="body1" fontWeight="bold" sx={{ mb: 2 }}>Registered Address:</Typography>

                                        {isEditingAddress ? (
                                            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                                                <KioskTextField
                                                    label="Line 1"
                                                    value={deliveryAddress.line1}
                                                    onChange={(e) => setDeliveryAddress({ ...deliveryAddress, line1: e.target.value })}
                                                    fullWidth
                                                    size="small"
                                                    sx={{ bgcolor: 'white' }}
                                                />
                                                <KioskTextField
                                                    label="Line 2"
                                                    value={deliveryAddress.line2}
                                                    onChange={(e) => setDeliveryAddress({ ...deliveryAddress, line2: e.target.value })}
                                                    fullWidth
                                                    size="small"
                                                    sx={{ bgcolor: 'white' }}
                                                />
                                                <Box sx={{ display: 'flex', gap: 2 }}>
                                                    <KioskTextField
                                                        label="City"
                                                        value={deliveryAddress.city}
                                                        onChange={(e) => setDeliveryAddress({ ...deliveryAddress, city: e.target.value })}
                                                        fullWidth
                                                        size="small"
                                                        sx={{ bgcolor: 'white' }}
                                                    />
                                                    <KioskTextField
                                                        label="PIN"
                                                        value={deliveryAddress.pin}
                                                        keyboardType="numeric"
                                                        onChange={(e) => setDeliveryAddress({ ...deliveryAddress, pin: e.target.value })}
                                                        fullWidth
                                                        size="small"
                                                        sx={{ bgcolor: 'white' }}
                                                    />
                                                </Box>
                                            </Box>
                                        ) : (
                                            <Box>
                                                <Typography variant="body1">{deliveryAddress.line1}</Typography>
                                                <Typography variant="body1">{deliveryAddress.line2}</Typography>
                                                <Typography variant="body1">{deliveryAddress.city} - {deliveryAddress.pin}</Typography>
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
                                    <Typography variant="h6" gutterBottom>Review Order</Typography>
                                    <Paper variant="outlined" sx={{ p: 3 }}>
                                        <Grid container spacing={2}>
                                            <Grid size={6}><Typography color="text.secondary">Account</Typography></Grid>
                                            <Grid size={6}><Typography fontWeight="bold">{accounts.find(a => a.id === selectedAccount)?.number}</Typography></Grid>

                                            <Grid size={6}><Typography color="text.secondary">Cheque Book Size</Typography></Grid>
                                            <Grid size={6}><Typography fontWeight="bold">{selectedLeaves} Leaves</Typography></Grid>

                                            <Grid size={6}><Typography color="text.secondary">Delivery To</Typography></Grid>
                                            <Grid size={6}><Typography fontWeight="bold">{deliveryAddress.pin}</Typography></Grid>

                                            <Grid size={12}><Divider sx={{ my: 1 }} /></Grid>

                                            <Grid size={6}><Typography variant="h6">Total Charges</Typography></Grid>
                                            <Grid size={6}><Typography variant="h6" color="primary">Free</Typography></Grid>
                                        </Grid>
                                    </Paper>
                                    <Box sx={{ mt: 3 }}>
                                        <FormControlLabel
                                            control={<Checkbox checked={confirmed} onChange={(e) => setConfirmed(e.target.checked)} />}
                                            label="I confirm the above details are correct."
                                        />
                                    </Box>
                                </Box>
                            )}
                        </motion.div>
                    </AnimatePresence>

                    {/* Actions */}
                    <Box sx={{ mt: 6, display: 'flex', justifyContent: 'space-between' }}>
                        <Button
                            disabled={activeStep === 0}
                            onClick={handleBack}
                            variant="outlined"
                            size="large"
                            sx={{ minWidth: 120, borderRadius: 2 }}
                        >
                            Back
                        </Button>
                        <Button
                            variant="contained"
                            onClick={handleNext}
                            disabled={!isStepValid()}
                            size="large"
                            sx={{ minWidth: 120, borderRadius: 2 }}
                        >
                            {activeStep === steps.length - 1 ? 'Confirm Order' : 'Next'}
                        </Button>
                    </Box>

                </Paper>
            </Box>
        </Box>
    );
}
