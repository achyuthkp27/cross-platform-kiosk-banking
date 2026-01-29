import React, { useState, useEffect } from 'react';
import { Box, Typography, Paper, Grid, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Button, Chip, CircularProgress, alpha, useTheme } from '@mui/material';
import { useRouter } from 'expo-router';
import { motion } from 'framer-motion';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import TrendingDownIcon from '@mui/icons-material/TrendingDown';
import { useThemeContext } from '../../src/context/ThemeContext';

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
    const theme = useTheme();
    const { mode } = useThemeContext();
    const isDark = mode === 'dark';
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => {
            setLoading(false);
        }, 1500);
        return () => clearTimeout(timer);
    }, []);

    if (loading) {
        return (
            <Box sx={{
                height: '100vh',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: isDark
                    ? 'linear-gradient(135deg, #020617 0%, #0F172A 100%)'
                    : 'linear-gradient(135deg, #F8FAFC 0%, #E2E8F0 100%)',
                transition: 'background 0.4s ease',
            }}>
                <CircularProgress size={60} thickness={4} />
            </Box>
        );
    }

    return (
        <Box sx={{
            minHeight: '100vh',
            background: isDark
                ? 'linear-gradient(135deg, #020617 0%, #0F172A 50%, #020617 100%)'
                : 'linear-gradient(135deg, #F8FAFC 0%, #E2E8F0 50%, #F1F5F9 100%)',
            p: { xs: 2, md: 4 },
            display: 'flex',
            flexDirection: 'column',
            transition: 'background 0.4s ease',
        }}>
            {/* Header */}
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
            >
                <Box sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    mb: 4,
                    p: 3,
                    bgcolor: isDark ? 'rgba(15, 23, 42, 0.8)' : 'rgba(255,255,255,0.8)',
                    backdropFilter: 'blur(12px)',
                    borderRadius: 3,
                    boxShadow: isDark ? '0 2px 8px rgba(0,0,0,0.3)' : '0 2px 8px rgba(0,0,0,0.04)',
                    border: `1px solid ${isDark ? 'rgba(255,255,255,0.06)' : 'transparent'}`,
                    transition: 'all 0.4s ease',
                }}>
                    <Box>
                        <Typography variant="h4" color="primary" sx={{ fontWeight: 700, letterSpacing: '-0.01em' }}>
                            Account Statement
                        </Typography>
                        <Typography variant="body1" color="text.secondary" sx={{ mt: 0.5 }}>
                            Welcome back, {MOCK_DATA.accountName}
                        </Typography>
                    </Box>
                    <Button
                        variant="outlined"
                        startIcon={<ArrowBackIcon />}
                        onClick={() => router.replace('/dashboard')}
                        sx={{
                            borderRadius: 3,
                            mr: 18,
                            borderWidth: 2,
                            fontWeight: 600,
                            '&:hover': { borderWidth: 2 }
                        }}
                    >
                        Dashboard
                    </Button>
                </Box>
            </motion.div>

            <Grid container spacing={4}>
                {/* Account Details Card */}
                <Grid size={{ xs: 12, md: 4 }}>
                    <motion.div
                        initial={{ opacity: 0, x: -30 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5, delay: 0.1 }}
                    >
                        <Paper
                            elevation={0}
                            sx={{
                                p: 4,
                                borderRadius: 4,
                                height: '100%',
                                background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
                                color: 'white',
                                position: 'relative',
                                overflow: 'hidden',
                                boxShadow: `0 20px 40px ${alpha(theme.palette.primary.main, 0.3)}`,
                            }}
                        >
                            {/* Decorative shapes */}
                            <Box sx={{
                                position: 'absolute',
                                top: -50,
                                right: -50,
                                width: 150,
                                height: 150,
                                borderRadius: '50%',
                                bgcolor: 'rgba(255,255,255,0.1)',
                            }} />
                            <Box sx={{
                                position: 'absolute',
                                bottom: -30,
                                left: -30,
                                width: 100,
                                height: 100,
                                borderRadius: '50%',
                                bgcolor: 'rgba(255,255,255,0.05)',
                            }} />

                            <Typography variant="overline" sx={{ opacity: 0.8, letterSpacing: 2 }}>
                                Available Balance
                            </Typography>
                            <Typography variant="h2" sx={{ fontWeight: 800, mb: 4, letterSpacing: '-0.02em' }}>
                                $<CountUp end={MOCK_DATA.balance} />
                            </Typography>

                            <Box sx={{ borderTop: '1px solid rgba(255,255,255,0.2)', pt: 3, mt: 'auto' }}>
                                <Typography variant="caption" sx={{ opacity: 0.7, letterSpacing: 1 }}>
                                    ACCOUNT NUMBER
                                </Typography>
                                <Typography variant="h6" sx={{ fontFamily: '"SF Mono", monospace', letterSpacing: 3, mb: 2 }}>
                                    {MOCK_DATA.accountNumber}
                                </Typography>
                                <Chip
                                    label={MOCK_DATA.accountType}
                                    size="small"
                                    sx={{
                                        bgcolor: 'rgba(255,255,255,0.15)',
                                        color: 'white',
                                        fontWeight: 600,
                                    }}
                                />
                            </Box>
                        </Paper>
                    </motion.div>
                </Grid>

                {/* Transactions List */}
                <Grid size={{ xs: 12, md: 8 }}>
                    <motion.div
                        initial={{ opacity: 0, x: 30 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                    >
                        <Paper
                            elevation={0}
                            sx={{
                                borderRadius: 4,
                                overflow: 'hidden',
                                border: `1px solid ${isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.04)'}`,
                                bgcolor: isDark ? 'rgba(15, 23, 42, 0.6)' : 'white',
                                transition: 'all 0.4s ease',
                            }}
                        >
                            <Box sx={{
                                p: 3,
                                borderBottom: '1px solid',
                                borderColor: isDark ? 'rgba(255,255,255,0.1)' : 'divider',
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                            }}>
                                <Typography variant="h6" sx={{ fontWeight: 700, color: isDark ? '#F8FAFC' : 'text.primary' }}>
                                    Recent Transactions
                                </Typography>
                                <Chip
                                    label={`${MOCK_DATA.transactions.length} entries`}
                                    size="small"
                                    variant="outlined"
                                    sx={{ fontWeight: 500 }}
                                />
                            </Box>

                            <TableContainer>
                                <Table>
                                    <TableHead>
                                        <TableRow sx={{ bgcolor: isDark ? 'rgba(15, 23, 42, 0.8)' : '#F8FAFC' }}>
                                            <TableCell sx={{ fontWeight: 600, color: isDark ? '#94A3B8' : 'text.secondary' }}>Date</TableCell>
                                            <TableCell sx={{ fontWeight: 600, color: isDark ? '#94A3B8' : 'text.secondary' }}>Description</TableCell>
                                            <TableCell sx={{ fontWeight: 600, color: isDark ? '#94A3B8' : 'text.secondary' }}>Type</TableCell>
                                            <TableCell align="right" sx={{ fontWeight: 600, color: isDark ? '#94A3B8' : 'text.secondary' }}>Amount</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {MOCK_DATA.transactions.map((row, index) => (
                                            <motion.tr
                                                key={row.id}
                                                initial={{ opacity: 0, y: 10 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                transition={{ delay: 0.3 + index * 0.05 }}
                                                style={{
                                                    display: 'table-row',
                                                }}
                                            >
                                                <TableCell sx={{
                                                    fontFamily: '"SF Mono", monospace',
                                                    fontSize: '0.875rem',
                                                    color: isDark ? '#94A3B8' : 'text.secondary',
                                                    bgcolor: isDark ? 'rgba(15, 23, 42, 0.4)' : 'white',
                                                }}>
                                                    {row.date}
                                                </TableCell>
                                                <TableCell sx={{
                                                    fontWeight: 500,
                                                    color: isDark ? '#F8FAFC' : 'text.primary',
                                                    bgcolor: isDark ? 'rgba(15, 23, 42, 0.4)' : 'white',
                                                }}>
                                                    {row.desc}
                                                </TableCell>
                                                <TableCell sx={{ bgcolor: isDark ? 'rgba(15, 23, 42, 0.4)' : 'white' }}>
                                                    <Chip
                                                        icon={row.type === 'CREDIT'
                                                            ? <TrendingUpIcon sx={{ fontSize: 16 }} />
                                                            : <TrendingDownIcon sx={{ fontSize: 16 }} />
                                                        }
                                                        label={row.type}
                                                        size="small"
                                                        sx={{
                                                            bgcolor: row.type === 'CREDIT'
                                                                ? alpha(theme.palette.success.main, isDark ? 0.2 : 0.1)
                                                                : alpha(isDark ? '#94A3B8' : theme.palette.text.secondary, 0.1),
                                                            color: row.type === 'CREDIT'
                                                                ? isDark ? '#4ADE80' : theme.palette.success.dark
                                                                : isDark ? '#94A3B8' : theme.palette.text.secondary,
                                                            fontWeight: 600,
                                                            fontSize: '0.7rem',
                                                            '& .MuiChip-icon': {
                                                                color: 'inherit'
                                                            }
                                                        }}
                                                    />
                                                </TableCell>
                                                <TableCell
                                                    align="right"
                                                    sx={{
                                                        color: row.type === 'CREDIT'
                                                            ? isDark ? '#4ADE80' : theme.palette.success.main
                                                            : isDark ? '#F8FAFC' : theme.palette.text.primary,
                                                        fontWeight: 700,
                                                        fontFamily: '"SF Mono", monospace',
                                                        fontSize: '0.95rem',
                                                        bgcolor: isDark ? 'rgba(15, 23, 42, 0.4)' : 'white',
                                                    }}
                                                >
                                                    {row.type === 'DEBIT' ? '-' : '+'}${row.amount.toFixed(2)}
                                                </TableCell>
                                            </motion.tr>
                                        ))}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        </Paper>
                    </motion.div>
                </Grid>
            </Grid>
        </Box>
    );
}
