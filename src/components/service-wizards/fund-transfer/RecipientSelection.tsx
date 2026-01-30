import React from 'react';
import { Box, Typography, Button, MenuItem, Grid } from '@mui/material';
import { motion } from 'framer-motion';
import KioskTextField from '../../KioskTextField';
import { MOCK_ACCOUNTS, MOCK_BENEFICIARIES } from '../../../hooks/service-wizards/useFundTransfer';

interface RecipientSelectionProps {
    form: any;
    setForm: (form: any) => void;
    errors: Record<string, string>;
    isNewBeneficiary: boolean;
    setIsNewBeneficiary: (value: boolean) => void;
    isDark: boolean;
}

export const RecipientSelection: React.FC<RecipientSelectionProps> = ({
    form, setForm, errors, isNewBeneficiary, setIsNewBeneficiary, isDark
}) => {
    return (
        <motion.div key="step1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
            <Typography variant="h6" gutterBottom align="left">Select Account & Beneficiary</Typography>

            <KioskTextField
                select
                fullWidth
                label="From Account"
                value={form.fromAccount}
                onChange={(e) => setForm({ ...form, fromAccount: e.target.value })}
                error={!!errors.fromAccount}
                helperText={errors.fromAccount}
                sx={{ mb: 3 }}
            >
                {MOCK_ACCOUNTS.map((acc) => (
                    <MenuItem key={acc.id} value={acc.id}>
                        {acc.type} - {acc.number} (Balance: ${acc.balance})
                    </MenuItem>
                ))}
            </KioskTextField>

            {!isNewBeneficiary ? (
                <>
                    <KioskTextField
                        select
                        fullWidth
                        label="Select Beneficiary"
                        value={form.beneficiaryId}
                        onChange={(e) => setForm({ ...form, beneficiaryId: e.target.value })}
                        error={!!errors.beneficiaryId}
                        helperText={errors.beneficiaryId}
                        sx={{ mb: 2 }}
                    >
                        {MOCK_BENEFICIARIES.map((ben) => (
                            <MenuItem key={ben.id} value={ben.id}>
                                {ben.name} - {ben.account}
                            </MenuItem>
                        ))}
                    </KioskTextField>
                    <Button
                        onClick={() => setIsNewBeneficiary(true)}
                        sx={{ fontWeight: 'bold', mb: 2 }}
                    >
                        + Add New Beneficiary
                    </Button>
                </>
            ) : (
                <Box sx={{ p: 3, border: `1px solid ${isDark ? 'rgba(255,255,255,0.1)' : '#ddd'}`, borderRadius: 3, textAlign: 'left', mb: 2, bgcolor: isDark ? 'rgba(15, 23, 42, 0.4)' : 'transparent' }}>
                    <Typography variant="subtitle1" gutterBottom fontWeight="bold">New Beneficiary Details</Typography>
                    <Grid container spacing={2}>
                        <Grid size={12}>
                            <KioskTextField
                                fullWidth label="Name"
                                value={form.newBeneficiary.name}
                                onChange={(e) => setForm({ ...form, newBeneficiary: { ...form.newBeneficiary, name: e.target.value } })}
                                error={!!errors.name} helperText={errors.name}
                            />
                        </Grid>
                        <Grid size={6}>
                            <KioskTextField
                                fullWidth label="Account Number"
                                value={form.newBeneficiary.account}
                                keyboardType="numeric"
                                onChange={(e) => setForm({ ...form, newBeneficiary: { ...form.newBeneficiary, account: e.target.value } })}
                                error={!!errors.account} helperText={errors.account}
                            />
                        </Grid>
                        <Grid size={6}>
                            <KioskTextField
                                fullWidth label="Confirm Account"
                                value={form.newBeneficiary.confirmAccount}
                                keyboardType="numeric"
                                onChange={(e) => setForm({ ...form, newBeneficiary: { ...form.newBeneficiary, confirmAccount: e.target.value } })}
                                error={!!errors.confirmAccount} helperText={errors.confirmAccount}
                            />
                        </Grid>
                        <Grid size={12}>
                            <KioskTextField
                                fullWidth label="IFSC Code"
                                value={form.newBeneficiary.ifsc}
                                onChange={(e) => setForm({ ...form, newBeneficiary: { ...form.newBeneficiary, ifsc: e.target.value.toUpperCase() } })}
                                error={!!errors.ifsc} helperText={errors.ifsc}
                            />
                        </Grid>
                    </Grid>
                    <Button sx={{ mt: 2 }} color="error" onClick={() => setIsNewBeneficiary(false)}>Cancel</Button>
                </Box>
            )}
        </motion.div>
    );
};
