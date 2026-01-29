import React, { useState } from 'react';
import { Box, Typography, Button, Paper, TextField, MenuItem, Stack, Grid, CircularProgress, Card, CardContent } from '@mui/material';
import { useRouter } from 'expo-router';
import { motion, AnimatePresence } from 'framer-motion';
import SuccessState from '../../src/components/SuccessState';
import { ElectricBolt, WaterDrop, Smartphone, Wifi, LocalGasStation } from '@mui/icons-material';

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
            <Box sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', bgcolor: '#f5f5f5' }}>
                <SuccessState
                    message="Bill Payment Successful!"
                    subMessage={`Transaction ID: ${mockTxnId}`}
                    onHome={() => router.push('/dashboard')}
                />
            </Box>
        );
    }

    return (
        <Box sx={{ minHeight: '100vh', bgcolor: '#f5f5f5', p: 3 }}>
            <Paper elevation={0} sx={{ p: 4, borderRadius: 4, maxWidth: 900, mx: 'auto' }}>
                <Typography variant="h4" color="primary" gutterBottom sx={{ fontWeight: 'bold' }}>
                    Bill Payments
                </Typography>

                {/* Stepper */}
                <Stack direction="row" spacing={2} sx={{ mb: 4 }}>
                    {[1, 2, 3].map((s) => (
                        <Box key={s} sx={{
                            flex: 1,
                            height: 4,
                            bgcolor: s <= step ? 'primary.main' : '#e0e0e0',
                            borderRadius: 2
                        }} />
                    ))}
                </Stack>

                <AnimatePresence mode="wait">
                    {step === 1 && (
                        <motion.div key="step1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                            <Typography variant="h6" gutterBottom>Select Category</Typography>
                            <Grid container spacing={3}>
                                {CATEGORIES.map((cat) => (
                                    <Grid item xs={6} md={4} key={cat.id}>
                                        <Card
                                            sx={{
                                                cursor: 'pointer',
                                                textAlign: 'center',
                                                p: 2,
                                                '&:hover': { bgcolor: 'action.hover', transform: 'scale(1.02)' },
                                                transition: 'all 0.2s'
                                            }}
                                            onClick={() => handleCategorySelect(cat.id)}
                                        >
                                            <CardContent>
                                                <Box sx={{ color: 'primary.main', mb: 1 }}>{cat.icon}</Box>
                                                <Typography variant="h6">{cat.name}</Typography>
                                            </CardContent>
                                        </Card>
                                    </Grid>
                                ))}
                            </Grid>
                        </motion.div>
                    )}

                    {step === 2 && (
                        <motion.div key="step2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                            <Typography variant="h6" gutterBottom>Enter Bill Details</Typography>

                            <TextField
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
                            </TextField>

                            <TextField
                                fullWidth
                                label="Consumer Number / ID"
                                value={consumerNo}
                                onChange={(e) => { setConsumerNo(e.target.value); setError(''); }}
                                error={!!error}
                                helperText={error}
                                sx={{ mb: 4 }}
                            />

                            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                <Button onClick={() => setStep(1)} variant="outlined">Back</Button>
                                <Button
                                    variant="contained"
                                    onClick={fetchBill}
                                    disabled={loading || !biller || !consumerNo}
                                >
                                    {loading ? <CircularProgress size={24} color="inherit" /> : 'Fetch Bill'}
                                </Button>
                            </Box>
                        </motion.div>
                    )}

                    {step === 3 && billDetails && (
                        <motion.div key="step3" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                            <Typography variant="h6" gutterBottom>Confirm Payment</Typography>

                            <Card sx={{ bgcolor: '#f0f7ff', mb: 4, border: '1px solid #cce5ff' }}>
                                <CardContent>
                                    <Grid container spacing={2}>
                                        <Grid item xs={6}>
                                            <Typography variant="caption" color="text.secondary">Biller</Typography>
                                            <Typography variant="body1" fontWeight="bold">{biller}</Typography>
                                        </Grid>
                                        <Grid item xs={6}>
                                            <Typography variant="caption" color="text.secondary">Consumer No</Typography>
                                            <Typography variant="body1" fontWeight="bold">{consumerNo}</Typography>
                                        </Grid>
                                        <Grid item xs={6}>
                                            <Typography variant="caption" color="text.secondary">Customer Name</Typography>
                                            <Typography variant="body1" fontWeight="bold">{billDetails.name}</Typography>
                                        </Grid>
                                        <Grid item xs={6}>
                                            <Typography variant="caption" color="text.secondary">Due Date</Typography>
                                            <Typography variant="body1" fontWeight="bold">{billDetails.dueDate}</Typography>
                                        </Grid>
                                        <Grid item xs={12}>
                                            <Typography variant="caption" color="text.secondary">Bill Amount</Typography>
                                            <Typography variant="h3" color="primary.main" fontWeight="bold">₹{billDetails.amount}</Typography>
                                        </Grid>
                                    </Grid>
                                </CardContent>
                            </Card>

                            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                <Button onClick={() => setStep(2)} variant="outlined">Back</Button>
                                <Button
                                    variant="contained"
                                    color="success"
                                    size="large"
                                    onClick={handleConfirm}
                                    disabled={loading}
                                >
                                    {loading ? <CircularProgress size={24} color="inherit" /> : 'Pay Now'}
                                </Button>
                            </Box>
                        </motion.div>
                    )}
                </AnimatePresence>
            </Paper>
        </Box>
    );
}
