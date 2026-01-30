import React from 'react';
import { Box, Typography, Stack } from '@mui/material';
import { motion } from 'framer-motion';
import { MOCK_ACCOUNTS, FormState } from '../../../hooks/service-wizards/useFundTransfer';

interface TransferReviewProps {
    form: FormState;
    getBeneficiaryDetails: () => string;
    isDark: boolean;
}

export const TransferReview: React.FC<TransferReviewProps> = ({ form, getBeneficiaryDetails, isDark }) => {
    return (
        <motion.div key="step3" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
            <Typography variant="h6" gutterBottom align="left">Review & Confirm</Typography>

            <Stack spacing={2} sx={{ mb: 4, p: 3, bgcolor: isDark ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.02)', borderRadius: 3, textAlign: 'left', border: isDark ? '1px solid rgba(255,255,255,0.06)' : 'none' }}>
                <Box>
                    <Typography variant="caption" color="text.secondary">From Account</Typography>
                    <Typography variant="body1" fontWeight="bold">
                        {MOCK_ACCOUNTS.find(a => a.id === form.fromAccount)?.number}
                    </Typography>
                </Box>
                <Box>
                    <Typography variant="caption" color="text.secondary">To Beneficiary</Typography>
                    <Typography variant="body1" fontWeight="bold">{getBeneficiaryDetails()}</Typography>
                </Box>
                <Box>
                    <Typography variant="caption" color="text.secondary">Amount</Typography>
                    <Typography variant="h3" color="primary" fontWeight="bold">${form.amount}</Typography>
                </Box>
                {form.remarks && (
                    <Box>
                        <Typography variant="caption" color="text.secondary">Remarks</Typography>
                        <Typography variant="body1">{form.remarks}</Typography>
                    </Box>
                )}
            </Stack>
        </motion.div>
    );
};
