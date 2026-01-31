import React from 'react';
import { Box, Typography, Button, MenuItem, Grid, CircularProgress } from '@mui/material';
import { motion } from 'framer-motion';
import KioskTextField from '../../KioskTextField';
import { FormState, Beneficiary } from '../../../hooks/service-wizards/useFundTransfer';
import { Account } from '../../../types/services';

interface RecipientSelectionProps {
    form: FormState;
    setForm: (form: FormState) => void;
    errors: Record<string, string>;
    isNewBeneficiary: boolean;
    setIsNewBeneficiary: (value: boolean) => void;
    addBeneficiaryStep: 1 | 2 | 3;
    setAddBeneficiaryStep: (step: 1 | 2 | 3) => void;
    isDark: boolean;
    accounts: Account[];
    beneficiaries: Beneficiary[];
    dataLoading?: boolean;
}

export const RecipientSelection: React.FC<RecipientSelectionProps> = ({
    form, setForm, errors, isNewBeneficiary, setIsNewBeneficiary, addBeneficiaryStep, setAddBeneficiaryStep, isDark, accounts, beneficiaries, dataLoading
}) => {
    if (dataLoading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
                <CircularProgress />
            </Box>
        );
    }

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
                {accounts.map((acc) => (
                    <MenuItem key={acc.id} value={acc.accountNumber}>
                        {acc.type} - {acc.accountNumber} (Balance: ${acc.balance.toLocaleString()})
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
                        disabled={beneficiaries.length === 0}
                    >
                        {beneficiaries.length === 0 ? (
                            <MenuItem value="" disabled>No saved beneficiaries</MenuItem>
                        ) : (
                            beneficiaries.map((ben) => (
                                <MenuItem key={ben.id} value={ben.id}>
                                    {ben.name} - {ben.accountNumber}
                                </MenuItem>
                            ))
                        )}
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
                    <Typography variant="subtitle1" gutterBottom fontWeight="bold">
                        {addBeneficiaryStep === 1 ? 'New Beneficiary Details' : 
                         addBeneficiaryStep === 2 ? 'Confirm Beneficiary Details' : 'Beneficiary Added'}
                    </Typography>

                    {addBeneficiaryStep === 1 && (
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
                    )}

                    {addBeneficiaryStep === 2 && (
                        <Box sx={{ mt: 2 }}>
                            <Grid container spacing={2}>
                                <Grid size={12}>
                                    <Typography variant="body2" color="text.secondary">Beneficiary Name</Typography>
                                    <Typography variant="h6">{form.newBeneficiary.name}</Typography>
                                </Grid>
                                <Grid size={6}>
                                    <Typography variant="body2" color="text.secondary">Account Number</Typography>
                                    <Typography variant="h6">{form.newBeneficiary.account}</Typography>
                                </Grid>
                                <Grid size={6}>
                                    <Typography variant="body2" color="text.secondary">IFSC Code</Typography>
                                    <Typography variant="h6">{form.newBeneficiary.ifsc}</Typography>
                                </Grid>
                            </Grid>
                        </Box>
                    )}

                    {addBeneficiaryStep === 3 && (
                        <Box sx={{ textAlign: 'center', py: 3 }}>
                            <Typography variant="h5" color="success.main" gutterBottom sx={{ fontWeight: 'bold' }}>
                                ✓ Beneficiary Added
                            </Typography>
                            <Typography variant="body1">
                                {form.newBeneficiary.name} has been successfully added to your beneficiaries.
                            </Typography>
                        </Box>
                    )}

                    {addBeneficiaryStep !== 3 && (
                         <Button sx={{ mt: 2 }} color="error" onClick={() => setIsNewBeneficiary(false)}>Cancel</Button>
                    )}
                </Box>
            )}
        </motion.div>
    );
};
