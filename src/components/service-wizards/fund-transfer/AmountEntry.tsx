import React from 'react';
import { Typography } from '@mui/material';
import { motion } from 'framer-motion';
import KioskTextField from '../../KioskTextField';

interface AmountEntryProps {
    form: any;
    setForm: (form: any) => void;
    errors: Record<string, string>;
}

export const AmountEntry: React.FC<AmountEntryProps> = ({ form, setForm, errors }) => {
    return (
        <motion.div key="step2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
            <Typography variant="h6" gutterBottom align="left">Enter Amount</Typography>

            <KioskTextField
                fullWidth
                label="Amount ($)"
                value={form.amount}
                keyboardType="numeric"
                onChange={(e) => setForm({ ...form, amount: e.target.value })}
                error={!!errors.amount}
                helperText={errors.amount}
                sx={{ mb: 3 }}
                InputProps={{ style: { fontSize: 32, fontWeight: 'bold', textAlign: 'center' } }}
            />

            <KioskTextField
                fullWidth
                label="Remarks (Optional)"
                value={form.remarks}
                onChange={(e) => setForm({ ...form, remarks: e.target.value })}
                multiline
                rows={2}
            />
        </motion.div>
    );
};
