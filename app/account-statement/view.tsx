import React, { useState, useEffect } from 'react';
import { Box, Typography, Paper, Grid, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Button, Chip, CircularProgress, alpha, useTheme, IconButton, Modal, Stack, Divider } from '@mui/material';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { motion } from 'framer-motion';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import TrendingDownIcon from '@mui/icons-material/TrendingDown';
import PrintIcon from '@mui/icons-material/Print';
import CloseIcon from '@mui/icons-material/Close';
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong';
import { useThemeContext } from '../../src/context/ThemeContext';
import { useToast } from '../../src/context/ToastContext';
import { accountService } from '../../src/services';
import { Account, AccountStatement } from '../../src/types/services';
import SkeletonLoader from '../../src/components/SkeletonLoader';

const CATEGORIES = ['All', 'Shopping', 'Income', 'Cash', 'Entertainment', 'Investment', 'Transport', 'Utilities', 'Food', 'Interest', 'Others'];

const deriveCategory = (desc: string): string => {
    const d = desc.toLowerCase();
    if (d.includes('salary') || d.includes('credit')) return 'Income';
    if (d.includes('mart') || d.includes('store') || d.includes('amazon')) return 'Shopping';
    if (d.includes('atm') || d.includes('cash')) return 'Cash';
    if (d.includes('netflix') || d.includes('movie')) return 'Entertainment';
    if (d.includes('uber') || d.includes('fuel')) return 'Transport';
    if (d.includes('bill') || d.includes('bescom')) return 'Utilities';
    if (d.includes('food') || d.includes('restaurant')) return 'Food';
    return 'Others';
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
        <Box component="span">{count.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</Box>
    );
};

export default function AccountStatementView() {
    const router = useRouter();
    const { userId } = useLocalSearchParams();
    const theme = useTheme();
    const { mode } = useThemeContext();
    const { showInfo, showError } = useToast();
    const isDark = mode === 'dark';
    
    const [loading, setLoading] = useState(true);
    const [account, setAccount] = useState<Account | null>(null);
    const [transactions, setTransactions] = useState<any[]>([]); // Using any for mapped UI data
    const [selectedCategory, setSelectedCategory] = useState('All');
    const [selectedTransaction, setSelectedTransaction] = useState<any | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            if (!userId) {
                showError('User ID missing. Redirecting...');
                setTimeout(() => router.replace('/account-statement'), 2000);
                return;
            }

            try {
                // 1. Fetch Accounts
                const accResponse = await accountService.getAccounts(userId as string);
                if (!accResponse.success || !accResponse.data || accResponse.data.length === 0) {
                    throw new Error(accResponse.message || 'No accounts found');
                }

                const primaryAccount = accResponse.data[0];
                setAccount(primaryAccount);

                // 2. Fetch Statement for primary account
                const stmtResponse = await accountService.getStatement(primaryAccount.id);
                if (stmtResponse.success && stmtResponse.data) {
                    // Map API data to UI format
                    const mappedData = stmtResponse.data.map((txn: AccountStatement) => ({
                        id: txn.id,
                        date: txn.txnDate, // Assuming format matches or use moment/date-fns locally
                        desc: txn.description,
                        category: deriveCategory(txn.description),
                        type: txn.txnType,
                        amount: txn.amount,
                        txnId: txn.referenceId
                    }));
                    setTransactions(mappedData);
                }
            } catch (error) {
                console.error('Failed to fetch data', error);
                showError('Failed to load statement data. Please try again.');
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [userId]);

    // Filter transactions based on category
    const filteredTransactions = selectedCategory === 'All'
        ? transactions
        : transactions.filter(t => t.category === selectedCategory);

    const handlePrint = () => {
        window.print();
        showInfo('Print dialog opened');
    };

    if (loading) {
        return (
            <Box sx={{
                minHeight: '100vh',
                p: { xs: 2, md: 4 },
                background: isDark
                    ? 'linear-gradient(135deg, #020617 0%, #0F172A 100%)'
                    : 'linear-gradient(135deg, #F8FAFC 0%, #E2E8F0 100%)',
            }}>
                {/* Header Skeleton */}
                <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between' }}>
                    <SkeletonLoader variant="form" />
                </Box>

                <Grid container spacing={4}>
                    {/* Account Details Skeleton */}
                    <Grid size={{ xs: 12, md: 4 }}>
                        <SkeletonLoader variant="card" />
                    </Grid>

                    {/* Transactions List Skeleton */}
                    <Grid size={{ xs: 12, md: 8 }}>
                        <SkeletonLoader variant="list" count={6} />
                    </Grid>
                </Grid>
            </Box>
        );
    }

    if (!account) {
        return (
            <Box sx={{ p: 4, textAlign: 'center' }}>
                <Typography variant="h5">No Account Details Found</Typography>
                <Button onClick={() => router.back()} sx={{ mt: 2 }}>Go Back</Button>
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
                            User ID: {userId}
                        </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <Button
                            variant="outlined"
                            startIcon={<ArrowBackIcon />}
                            onClick={() => router.replace('/dashboard')}
                            sx={{
                                borderRadius: 3,
                                borderWidth: 2,
                                fontWeight: 600,
                                mr: 18,
                                '&:hover': { borderWidth: 2 }
                            }}
                        >
                            Dashboard
                        </Button>
                    </Box>
                </Box>
            </motion.div>

            {/* Category Filter Chips */}
            <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.2 }}
            >
                <Box sx={{ mb: 3, display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                    {CATEGORIES.map((cat) => (
                        <Chip
                            key={cat}
                            label={cat}
                            onClick={() => setSelectedCategory(cat)}
                            variant={selectedCategory === cat ? 'filled' : 'outlined'}
                            color={selectedCategory === cat ? 'primary' : 'default'}
                            sx={{
                                fontWeight: 600,
                                transition: 'all 0.2s ease',
                            }}
                        />
                    ))}
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
                                $<CountUp end={account.balance} />
                            </Typography>

                            <Box sx={{ borderTop: '1px solid rgba(255,255,255,0.2)', pt: 3, mt: 'auto' }}>
                                <Typography variant="caption" sx={{ opacity: 0.7, letterSpacing: 1 }}>
                                    ACCOUNT NUMBER
                                </Typography>
                                <Typography variant="h6" sx={{ fontFamily: '"SF Mono", monospace', letterSpacing: 3, mb: 2 }}>
                                    {account.accountNumber}
                                </Typography>
                                <Chip
                                    label={account.type}
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
                                    label={`${filteredTransactions.length} entries`}
                                    size="small"
                                    variant="outlined"
                                    sx={{ fontWeight: 500 }}
                                />
                            </Box>

                            <TableContainer sx={{ maxHeight: 600 }}>
                                <Table stickyHeader>
                                    <TableHead>
                                        <TableRow sx={{
                                            '& th': {
                                                bgcolor: isDark ? 'rgba(15, 23, 42, 1)' : '#F8FAFC',
                                                zIndex: 1
                                            }
                                        }}>
                                            <TableCell sx={{ fontWeight: 600, color: isDark ? '#94A3B8' : 'text.secondary' }}>Date</TableCell>
                                            <TableCell sx={{ fontWeight: 600, color: isDark ? '#94A3B8' : 'text.secondary' }}>Description</TableCell>
                                            <TableCell sx={{ fontWeight: 600, color: isDark ? '#94A3B8' : 'text.secondary' }}>Category</TableCell>
                                            <TableCell sx={{ fontWeight: 600, color: isDark ? '#94A3B8' : 'text.secondary' }}>Type</TableCell>
                                            <TableCell align="right" sx={{ fontWeight: 600, color: isDark ? '#94A3B8' : 'text.secondary' }}>Amount</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {filteredTransactions.map((row, index) => (
                                            <TableRow
                                                component={motion.tr}
                                                key={row.id}
                                                initial={{ opacity: 0, y: 10 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                transition={{ delay: 0.2 + index * 0.05 }}
                                                onClick={() => setSelectedTransaction(row)}
                                                sx={{
                                                    cursor: 'pointer',
                                                    '&:hover': { backgroundColor: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.02)' }
                                                }}
                                            >
                                                <TableCell sx={{
                                                    fontFamily: '"SF Mono", monospace',
                                                    fontSize: '0.875rem',
                                                    color: isDark ? '#94A3B8' : 'text.secondary',
                                                    borderBottomColor: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.04)',
                                                }}>
                                                    {row.date}
                                                </TableCell>
                                                <TableCell sx={{
                                                    fontWeight: 500,
                                                    color: isDark ? '#F8FAFC' : 'text.primary',
                                                    borderBottomColor: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.04)',
                                                }}>
                                                    {row.desc}
                                                </TableCell>
                                                <TableCell sx={{
                                                    color: isDark ? '#94A3B8' : 'text.secondary',
                                                    borderBottomColor: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.04)',
                                                }}>
                                                    <Chip
                                                        label={row.category}
                                                        size="small"
                                                        sx={{
                                                            height: 24,
                                                            bgcolor: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.06)',
                                                            fontSize: '0.75rem',
                                                        }}
                                                    />
                                                </TableCell>
                                                <TableCell sx={{ borderBottomColor: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.04)' }}>
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
                                                        borderBottomColor: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.04)',
                                                    }}
                                                >
                                                    {row.type === 'DEBIT' ? '-' : '+'}${row.amount.toFixed(2)}
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        </Paper>
                    </motion.div>
                </Grid>
            </Grid>

            {/* Transaction Details Modal */}
            <Modal
                open={!!selectedTransaction}
                onClose={() => setSelectedTransaction(null)}
                sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    p: 2,
                }}
            >
                <Box component={motion.div}
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.9, opacity: 0 }}
                    sx={{
                        outline: 'none',
                    }}
                >
                    {selectedTransaction && (
                        <Paper
                            sx={{
                                width: 400,
                                maxWidth: '100%',
                                borderRadius: 4,
                                overflow: 'hidden',
                                bgcolor: isDark ? '#1E293B' : 'white',
                                boxShadow: 24,
                            }}
                        >
                            <Box sx={{
                                p: 3,
                                bgcolor: isDark ? '#0F172A' : '#F8FAFC',
                                borderBottom: `1px solid ${isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'}`,
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                            }}>
                                <Typography variant="h6" fontWeight={700}>
                                    Transaction Details
                                </Typography>
                                <IconButton
                                    onClick={() => setSelectedTransaction(null)}
                                    size="small"
                                    sx={{ bgcolor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)' }}
                                >
                                    <CloseIcon />
                                </IconButton>
                            </Box>

                            <Box sx={{ p: 4, textAlign: 'center' }}>
                                <Box sx={{
                                    display: 'inline-flex',
                                    p: 2,
                                    borderRadius: '50%',
                                    bgcolor: selectedTransaction.type === 'CREDIT'
                                        ? alpha(theme.palette.success.main, 0.1)
                                        : alpha(theme.palette.text.secondary, 0.1),
                                    mb: 2,
                                }}>
                                    {selectedTransaction.type === 'CREDIT'
                                        ? <TrendingUpIcon sx={{ fontSize: 40, color: 'success.main' }} />
                                        : <ReceiptLongIcon sx={{ fontSize: 40, color: 'text.secondary' }} />
                                    }
                                </Box>

                                <Typography variant="h4" fontWeight={700} sx={{ mb: 1, fontFamily: '"SF Mono", monospace' }}>
                                    {selectedTransaction.type === 'DEBIT' ? '-' : '+'}${selectedTransaction.amount.toFixed(2)}
                                </Typography>
                                <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
                                    {selectedTransaction.desc}
                                </Typography>

                                <Stack spacing={2}>
                                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                        <Typography variant="body2" color="text.secondary">Date</Typography>
                                        <Typography variant="body2" fontWeight={600}>{selectedTransaction.date}</Typography>
                                    </Box>
                                    <Divider />
                                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                        <Typography variant="body2" color="text.secondary">Category</Typography>
                                        <Chip label={selectedTransaction.category} size="small" />
                                    </Box>
                                    <Divider />
                                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                        <Typography variant="body2" color="text.secondary">Type</Typography>
                                        <Typography variant="body2" fontWeight={600} color={selectedTransaction.type === 'CREDIT' ? 'success.main' : 'text.primary'}>
                                            {selectedTransaction.type}
                                        </Typography>
                                    </Box>
                                    <Divider />
                                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                        <Typography variant="body2" color="text.secondary">Transaction ID</Typography>
                                        <Typography variant="body2" fontFamily="'SF Mono', monospace">{selectedTransaction.txnId ? `TXN${selectedTransaction.txnId}` : `TXN${selectedTransaction.id}`}</Typography>
                                    </Box>
                                </Stack>

                                <Button
                                    fullWidth
                                    variant="contained"
                                    startIcon={<PrintIcon />}
                                    sx={{ mt: 4, borderRadius: 3, py: 1.5 }}
                                    onClick={handlePrint}
                                >
                                    Print Receipt
                                </Button>
                            </Box>
                        </Paper>
                    )}
                </Box>
            </Modal>
        </Box>
    );
}
