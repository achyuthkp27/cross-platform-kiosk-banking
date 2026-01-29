import React, { useState } from 'react';
import { Box, Typography, Button, MenuItem, Grid, CircularProgress, Card, CardContent } from '@mui/material';
import KioskTextField from '../../src/components/KioskTextField';
import { useRouter } from 'expo-router';
import { motion, AnimatePresence } from 'framer-motion';
import SuccessState from '../../src/components/SuccessState';
import { ElectricBolt, WaterDrop, Smartphone, Wifi, LocalGasStation } from '@mui/icons-material';
import KioskPage from '../../src/components/KioskPage';
import WizardStepper from '../../src/components/WizardStepper';
import ActionButtons from '../../src/components/ActionButtons';

const CATEGORIES = [
    { id: 'electricity', name: 'Electricity', icon: <ElectricBolt fontSize="large" /> },
    { id: 'water', name: 'Water', icon: <WaterDrop fontSize="large" /> },
    { id: 'mobile', name: 'Mobile', icon: <Smartphone fontSize="large" /> },
    { id: 'internet', name: 'Internet', icon: <Wifi fontSize="large" /> },
    { id: 'gas', name: 'Gas', icon: <LocalGasStation fontSize="large" /> },
];

const BILLERS = {
    electricity: ['Adani Electricity', 'Tata Power', 'BESCOM'],
    water: ['BWSSB', 'Delhi Jal Board'],
    mobile: ['Jio Postpaid', 'Airtel Postpaid', 'Vi Postpaid'],
    internet: ['ACT Fibernet', 'JioFiber', 'Airtel Xstream'],
    gas: ['MGL', 'IGL'],
};

export default function BillPaymentWizard() {
    const router = useRouter();
    const [step, setStep] = useState(1);
    const [loading, setLoading] = useState(false);
    const [category, setCategory] = useState('');
    const [biller, setBiller] = useState('');
    const [consumerNo, setConsumerNo] = useState('');
    const [billDetails, setBillDetails] = useState<any>(null);
    const [error, setError] = useState('');
    const [mockTxnId, setMockTxnId] = useState('');

    const handleCategorySelect = (catId: string) => {
        setCategory(catId);
        setStep(2);
    };

    const fetchBill = () => {
        if (!biller || !consumerNo) {
            setError('Please fill in all fields');
            return;
        }
        setLoading(true);
        setTimeout(() => {
            setLoading(false);
            setBillDetails({
                amount: Math.floor(Math.random() * 5000) + 500,
                dueDate: '15/02/2026',
                name: 'John Doe',
                billNo: `B-${Date.now()}`
            });
            setStep(3);
        }, 1500);
    };

    const handleConfirm = () => {
        setLoading(true);
        setTimeout(() => {
            setLoading(false);
            setMockTxnId(`BP${Date.now()}99`);
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
                    <motion.div key="step1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                        <Typography variant="h6" gutterBottom align="left">Select Category</Typography>
                        <Grid container spacing={3}>
                            {CATEGORIES.map((cat) => (
                                <Grid size={{ xs: 6, md: 4 }} key={cat.id}>
                                    <Card
                                        sx={{
                                            cursor: 'pointer',
                                            textAlign: 'center',
                                            p: 2,
                                            borderRadius: 3,
                                            border: '2px solid transparent',
                                            '&:hover': {
                                                bgcolor: 'rgba(0,0,0,0.02)',
                                                transform: 'translateY(-4px)',
                                                borderColor: 'primary.main'
                                            },
                                            transition: 'all 0.3s ease'
                                        }}
                                        onClick={() => handleCategorySelect(cat.id)}
                                    >
                                        <CardContent>
                                            <Box sx={{ color: 'primary.main', mb: 2 }}>{cat.icon}</Box>
                                            <Typography variant="h6" fontWeight="bold">{cat.name}</Typography>
                                        </CardContent>
                                    </Card>
                                </Grid>
                            ))}
                        </Grid>

                        <Box sx={{ mt: 4, display: 'flex', justifyContent: 'center' }}>
                            <Button
                                variant="outlined"
                                onClick={() => router.push('/dashboard')}
                                size="large"
                                sx={{ height: 56, minWidth: 200, borderRadius: 2 }}
                            >
                                Cancel
                            </Button>
                        </Box>
                    </motion.div>
                )}

                {step === 2 && (
                    <motion.div key="step2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                        <Typography variant="h6" gutterBottom align="left">Enter Bill Details</Typography>

                        <KioskTextField
                            select
                            fullWidth
                            label="Select Biller"
                            value={biller}
                            onChange={(e) => { setBiller(e.target.value); setError(''); }}
                            sx={{ mb: 3 }}
                        >
                            {BILLERS[category as keyof typeof BILLERS]?.map((b) => (
                                <MenuItem key={b} value={b}>{b}</MenuItem>
                            ))}
                        </KioskTextField>

                        <KioskTextField
                            fullWidth
                            label="Consumer Number / ID"
                            value={consumerNo}
                            onChange={(e) => { setConsumerNo(e.target.value); setError(''); }}
                            error={!!error}
                            helperText={error}
                            sx={{ mb: 4 }}
                        />

                        <Box sx={{ display: 'flex', justifyContent: 'space-between', gap: 2 }}>
                            <Button
                                onClick={() => setStep(1)}
                                variant="outlined"
                                size="large"
                                sx={{ height: 56, flex: 1, borderRadius: 2 }}
                            >
                                Back
                            </Button>
                            <Button
                                variant="contained"
                                onClick={fetchBill}
                                disabled={loading || !biller || !consumerNo}
                                size="large"
                                sx={{ height: 56, flex: 2, borderRadius: 2 }}
                            >
                                {loading ? <CircularProgress size={24} color="inherit" /> : 'Fetch Bill'}
                            </Button>
                        </Box>
                    </motion.div>
                )}

                {step === 3 && billDetails && (
                    <motion.div key="step3" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                        <Typography variant="h6" gutterBottom align="left">Confirm Payment</Typography>

                        <Card sx={{ bgcolor: 'rgba(25, 118, 210, 0.04)', mb: 4, borderRadius: 3, border: '1px solid rgba(25, 118, 210, 0.1)' }}>
                            <CardContent sx={{ textAlign: 'left' }}>
                                <Grid container spacing={3}>
                                    <Grid size={6}>
                                        <Typography variant="caption" color="text.secondary">Biller</Typography>
                                        <Typography variant="body1" fontWeight="bold">{biller}</Typography>
                                    </Grid>
                                    <Grid size={6}>
                                        <Typography variant="caption" color="text.secondary">Consumer No</Typography>
                                        <Typography variant="body1" fontWeight="bold">{consumerNo}</Typography>
                                    </Grid>
                                    <Grid size={6}>
                                        <Typography variant="caption" color="text.secondary">Customer Name</Typography>
                                        <Typography variant="body1" fontWeight="bold">{billDetails.name}</Typography>
                                    </Grid>
                                    <Grid size={6}>
                                        <Typography variant="caption" color="text.secondary">Due Date</Typography>
                                        <Typography variant="body1" fontWeight="bold">{billDetails.dueDate}</Typography>
                                    </Grid>
                                    <Grid size={12}>
                                        <Typography variant="caption" color="text.secondary">Bill Amount</Typography>
                                        <Typography variant="h3" color="primary" fontWeight="bold" sx={{ mt: 1 }}>₹{billDetails.amount}</Typography>
                                    </Grid>
                                </Grid>
                            </CardContent>
                        </Card>

                        <Box sx={{ display: 'flex', justifyContent: 'space-between', gap: 2 }}>
                            <Button
                                onClick={() => setStep(2)}
                                variant="outlined"
                                size="large"
                                sx={{ height: 56, flex: 1, borderRadius: 2 }}
                            >
                                Back
                            </Button>
                            <Button
                                variant="contained"
                                color="success"
                                size="large"
                                onClick={handleConfirm}
                                disabled={loading}
                                sx={{ height: 56, flex: 2, borderRadius: 2 }}
                            >
                                {loading ? <CircularProgress size={24} color="inherit" /> : 'Pay Now'}
                            </Button>
                        </Box>
                    </motion.div>
                )}
            </AnimatePresence>
        </KioskPage>
    );
}
