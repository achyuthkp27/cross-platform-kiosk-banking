import React, { useState, useEffect } from 'react';
import { Box, Typography, Paper, Grid, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Button, Chip, Fade, CircularProgress } from '@mui/material';
import { useRouter } from 'expo-router';
// Icons would normally be imported from @mui/icons-material, using text fallbacks or simple svgs if needed.
// Ensuring no external icon dependency issues by using text or generic shapes if needed, 
// but Material UI might need @mui/icons-material installed. 
// Assuming @mui/icons-material is available as per previous files context (though dashboard had comment about it).
// I will use text buttons or check if I can use icons. Dashboard comment said "Icons would normally be imported".
// I'll stick to text/basic shapes to be safe, or minimal SVG.

// Mock Data
const MOCK_DATA = {
    accountName: 'John Doe',
    accountNumber: '**** **** **** 1234',
    accountType: 'Savings Account',
    balance: 12450.75,
    transactions: [
        { id: 1, date: '29/01/2026', desc: 'UPI Transfer - Walmart', type: 'DEBIT', amount: 45.00 },
        { id: 2, date: '28/01/2026', desc: 'Salary Credit', type: 'CREDIT', amount: 5000.00 },
        { id: 3, date: '25/01/2026', desc: 'ATM Withdrawal', type: 'DEBIT', amount: 200.00 },
        { id: 4, date: '22/01/2026', desc: 'Netflix Subscription', type: 'DEBIT', amount: 15.99 },
        { id: 5, date: '20/01/2026', desc: 'Dividends', type: 'CREDIT', amount: 120.50 },
    ]
};

const CountUp = ({ end, duration = 2 }: { end: number, duration?: number }) => {
    const [count, setCount] = useState(0);

    useEffect(() => {
        let start = 0;
        const increment = end / (duration * 60);
        const timer = setInterval(() => {
            start += increment;
            if (start >= end) {
                setCount(end);
                clearInterval(timer);
            } else {
                setCount(start);
            }
        }, 1000 / 60);
        return () => clearInterval(timer);
    }, [end, duration]);

    return (
        <span>{count.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
    );
};

export default function AccountStatementView() {
    const router = useRouter();
    const [loading, setLoading] = useState(true);


    useEffect(() => {
        // Simulate API fetch
        const timer = setTimeout(() => {
            setLoading(false);
        }, 1500);
        return () => clearTimeout(timer);
    }, []);



    if (loading) {
        return (
            <Box sx={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', bgcolor: '#F0F2F5' }}>
                <CircularProgress size={60} thickness={4} />
            </Box>
        );
    }

    return (
        <Box sx={{ minHeight: '100vh', bgcolor: '#F0F2F5', p: 4, display: 'flex', flexDirection: 'column' }}>
            {/* Header */}
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
                <Box>
                    <Typography variant="h4" color="primary" sx={{ fontWeight: 'bold' }}>
                        Account Statement
                    </Typography>
                    <Typography variant="body1" color="text.secondary">
                        Welcome back, {MOCK_DATA.accountName}
                    </Typography>
                </Box>
                <Button variant="outlined" onClick={() => router.replace('/dashboard')} sx={{ borderRadius: 2 }}>
                    Return to Dashboard
                </Button>
            </Box>

            <Grid container spacing={4}>
                {/* Account Details Card */}
                <Grid size={{ xs: 12, md: 4 }}>
                    <Fade in={true} timeout={500}>
                        <Paper elevation={2} sx={{ p: 4, borderRadius: 4, height: '100%', bgcolor: 'primary.main', color: 'white' }}>
                            <Typography variant="subtitle1" sx={{ opacity: 0.8, mb: 1 }}>
                                Available Balance
                            </Typography>
                            <Typography variant="h2" sx={{ fontWeight: 'bold', mb: 4 }}>
                                $<CountUp end={MOCK_DATA.balance} />
                            </Typography>

                            <Box sx={{ borderTop: '1px solid rgba(255,255,255,0.2)', pt: 3, mt: 'auto' }}>
                                <Typography variant="caption" sx={{ opacity: 0.8 }}>
                                    Account Number
                                </Typography>
                                <Typography variant="h6" sx={{ fontFamily: 'monospace', letterSpacing: 2 }}>
                                    {MOCK_DATA.accountNumber}
                                </Typography>
                                <Typography variant="caption" sx={{ opacity: 0.8, display: 'block', mt: 1 }}>
                                    Type
                                </Typography>
                                <Typography variant="body1">
                                    {MOCK_DATA.accountType}
                                </Typography>
                            </Box>
                        </Paper>
                    </Fade>
                </Grid>

                {/* Transactions List */}
                <Grid size={{ xs: 12, md: 8 }}>
                    <Fade in={true} timeout={700}>
                        <Paper elevation={0} sx={{ p: 0, borderRadius: 4, overflow: 'hidden' }}>
                            <Box sx={{ p: 3, borderBottom: '1px solid #eee', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                                    Recent Transactions
                                </Typography>

                            </Box>

                            <TableContainer>
                                <Table>
                                    <TableHead sx={{ bgcolor: '#fafafa' }}>
                                        <TableRow>
                                            <TableCell>Date</TableCell>
                                            <TableCell>Description</TableCell>
                                            <TableCell>Type</TableCell>
                                            <TableCell align="right">Amount</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {MOCK_DATA.transactions.map((row) => (
                                            <TableRow key={row.id} hover>
                                                <TableCell>{row.date}</TableCell>
                                                <TableCell sx={{ fontWeight: 'medium' }}>{row.desc}</TableCell>
                                                <TableCell>
                                                    <Chip
                                                        label={row.type}
                                                        size="small"
                                                        color={row.type === 'CREDIT' ? 'success' : 'default'}
                                                        variant="outlined"
                                                        sx={{ fontSize: '0.7rem', fontWeight: 'bold' }}
                                                    />
                                                </TableCell>
                                                <TableCell align="right" sx={{
                                                    color: row.type === 'CREDIT' ? 'success.main' : 'text.primary',
                                                    fontWeight: 'bold'
                                                }}>
                                                    {row.type === 'DEBIT' ? '-' : '+'}${row.amount.toFixed(2)}
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        </Paper>
                    </Fade>
                </Grid>
            </Grid>


        </Box>
    );
}
