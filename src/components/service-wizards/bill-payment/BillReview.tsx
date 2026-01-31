import React from 'react';
import { Box, Typography, Button, Grid, Card, CardContent, CircularProgress, MenuItem, TextField } from '@mui/material';
import { motion } from 'framer-motion';
import { BillDetails } from '../../../hooks/service-wizards/useBillPayment';
import { Account } from '../../../types/services';

interface BillReviewProps {
    biller: string;
    consumerNo: string;
    billDetails: BillDetails;
    isDark: boolean;
    onBack: () => void;
    onConfirm: () => void;
    loading: boolean;
    fromAccount: string;
    setFromAccount: (acc: string) => void;
    accounts: Account[];
}

export const BillReview: React.FC<BillReviewProps> = ({
    biller, consumerNo, billDetails, isDark, onBack, onConfirm, loading, fromAccount, setFromAccount, accounts
}) => {
    return (
        <motion.div key="step3" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
            <Typography variant="h6" gutterBottom align="left">Confirm Payment</Typography>

            <Card sx={{ bgcolor: isDark ? 'rgba(56, 189, 248, 0.08)' : 'rgba(25, 118, 210, 0.04)', mb: 4, borderRadius: 3, border: isDark ? '1px solid rgba(56, 189, 248, 0.2)' : '1px solid rgba(25, 118, 210, 0.1)' }}>
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
                            <Typography variant="h3" color="primary" fontWeight="bold" sx={{ mt: 1 }}>${billDetails.amount}</Typography>
                        </Grid>
                        
                        <Grid size={12}>
                            <TextField
                                select
                                label="Pay From Account"
                                value={fromAccount}
                                onChange={(e) => setFromAccount(e.target.value)}
                                fullWidth
                                sx={{ 
                                    mt: 2,
                                    bgcolor: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.02)'
                                }}
                            >
                                {accounts.map((acc) => (
                                    <MenuItem key={acc.accountNumber} value={acc.accountNumber}>
                                        {acc.type} - {acc.accountNumber} (${acc.balance})
                                    </MenuItem>
                                ))}
                            </TextField>
                        </Grid>
                    </Grid>
                </CardContent>
            </Card>

            <Box sx={{ display: 'flex', justifyContent: 'space-between', gap: 2 }}>
                <Button
                    onClick={onBack}
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
                    onClick={onConfirm}
                    disabled={loading}
                    sx={{ height: 56, flex: 2, borderRadius: 2 }}
                >
                    {loading ? <CircularProgress size={24} color="inherit" /> : 'Pay Now'}
                </Button>
            </Box>
        </motion.div>
    );
};
