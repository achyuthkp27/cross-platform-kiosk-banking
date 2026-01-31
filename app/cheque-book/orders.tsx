import React, { useEffect, useState } from 'react';
import { Box, Typography, Paper, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Chip, CircularProgress, Alert } from '@mui/material';
import { useRouter } from 'expo-router';
import { useThemeContext } from '../../src/context/ThemeContext';
import { chequeBookOrdersApi } from '../../src/services/api/chequeBookApi';
import { useToast } from '../../src/context/ToastContext';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

interface ChequeBookOrder {
    id: number;
    referenceId: string;
    requestDate: string; // Backend sends this now (mapped from orderedAt)
    status: string;
    leaves: number;      // Backend sends 'leaves', not 'leavesCount'
    accountId: number;
    deliveryAddress: string;
}

export default function ChequeBookOrders() {
    const router = useRouter();
    const { mode } = useThemeContext();
    const isDark = mode === 'dark';
    const { showError } = useToast();

    const [orders, setOrders] = useState<ChequeBookOrder[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const response = await chequeBookOrdersApi.getOrders();
                if (response.success && response.data) {
                    setOrders(response.data);
                } else {
                    showError(response.message || 'Failed to fetch orders');
                }
            } catch (error) {
                console.error('Fetch orders error:', error);
                showError('Error loading orders');
            } finally {
                setLoading(false);
            }
        };

        fetchOrders();
    }, []);

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'DELIVERED': return 'success';
            case 'DISPATCHED': return 'info';
            case 'PROCESSED': return 'primary';
            default: return 'default';
        }
    };

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
                alignItems: 'center',
                gap: 2,
                bgcolor: isDark ? 'rgba(15, 23, 42, 0.8)' : 'white',
                borderBottom: isDark ? '1px solid rgba(255,255,255,0.1)' : 'none',
            }}>
                <Button 
                    startIcon={<ArrowBackIcon />} 
                    onClick={() => router.back()}
                    sx={{ color: isDark ? '#F8FAFC' : 'text.primary' }}
                >
                    Back
                </Button>
                <Typography variant="h6" color="primary" sx={{ fontWeight: 'bold' }}>
                    My Cheque Book Orders
                </Typography>
            </Paper>

            <Box sx={{ p: 4, maxWidth: 1000, mx: 'auto', width: '100%' }}>
                {loading ? (
                    <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
                        <CircularProgress />
                    </Box>
                ) : orders.length === 0 ? (
                    <Alert severity="info" sx={{ mt: 2 }}>No cheque book orders found.</Alert>
                ) : (
                    <TableContainer component={Paper} sx={{
                        bgcolor: isDark ? 'rgba(15, 23, 42, 0.6)' : 'white',
                        border: isDark ? '1px solid rgba(255,255,255,0.1)' : 'none',
                        borderRadius: 4
                    }}>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell sx={{ color: isDark ? '#94A3B8' : 'text.secondary' }}>Reference ID</TableCell>
                                    <TableCell sx={{ color: isDark ? '#94A3B8' : 'text.secondary' }}>Date</TableCell>
                                    <TableCell sx={{ color: isDark ? '#94A3B8' : 'text.secondary' }}>Leaves</TableCell>
                                    <TableCell sx={{ color: isDark ? '#94A3B8' : 'text.secondary' }}>Status</TableCell>
                                    <TableCell sx={{ color: isDark ? '#94A3B8' : 'text.secondary' }}>Details</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {orders.map((order) => (
                                    <TableRow key={order.id} hover sx={{
                                        '&:hover': { bgcolor: isDark ? 'rgba(255,255,255,0.05)' : undefined }
                                    }}>
                                        <TableCell sx={{ color: isDark ? '#F8FAFC' : 'text.primary', fontWeight: 'bold' }}>
                                            {order.referenceId}
                                        </TableCell>
                                        <TableCell sx={{ color: isDark ? '#E2E8F0' : 'text.primary' }}>
                                            {new Date(order.requestDate).toLocaleDateString()}
                                        </TableCell>
                                        <TableCell sx={{ color: isDark ? '#E2E8F0' : 'text.primary' }}>
                                            {order.leaves} Leaves
                                        </TableCell>
                                        <TableCell>
                                            <Chip 
                                                label={order.status} 
                                                color={getStatusColor(order.status) as any} 
                                                size="small" 
                                                variant="outlined" 
                                            />
                                        </TableCell>
                                        <TableCell>
                                            <Typography variant="caption" sx={{ color: isDark ? '#94A3B8' : 'text.secondary' }}>
                                                Acc: ...{order.accountId}
                                            </Typography>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                )}
            </Box>
        </Box>
    );
}
