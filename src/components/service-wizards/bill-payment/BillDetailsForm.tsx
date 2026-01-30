import React from 'react';
import { Box, Typography, Button, MenuItem, CircularProgress } from '@mui/material';
import { motion } from 'framer-motion';
import KioskTextField from '../../KioskTextField';
import { BILLERS } from '../../../hooks/service-wizards/useBillPayment';

interface BillDetailsFormProps {
    category: string;
    biller: string;
    setBiller: (value: string) => void;
    consumerNo: string;
    setConsumerNo: (value: string) => void;
    error: string;
    setError: (error: string) => void;
    fetchBill: () => void;
    loading: boolean;
    onBack: () => void;
}

export const BillDetailsForm: React.FC<BillDetailsFormProps> = ({
    category, biller, setBiller, consumerNo, setConsumerNo,
    error, setError, fetchBill, loading, onBack
}) => {
    return (
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
                    onClick={onBack}
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
    );
};
