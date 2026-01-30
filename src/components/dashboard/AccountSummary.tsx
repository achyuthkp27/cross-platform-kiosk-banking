import React from 'react';
import { Box, Typography, Grid, Paper } from '@mui/material';
import { motion, Variants } from 'framer-motion';

interface Account {
    id: number;
    type: string;
    number: string;
    balance: number;
    color: string;
}

interface AccountSummaryProps {
    accounts: Account[];
    totalBalance: number;
    isDark: boolean;
    itemVariants: Variants;
}

export const AccountSummary: React.FC<AccountSummaryProps> = ({
    accounts,
    totalBalance,
    isDark,
    itemVariants
}) => {
    return (
        <Box sx={{ mb: 5 }}>
            <Typography variant="h6" sx={{ mb: 2, color: 'text.secondary', fontWeight: 500 }}>
                Account Summary
            </Typography>
            <Grid container spacing={3}>
                {/* Total Balance Card */}
                <Grid size={{ xs: 12, md: 4 }}>
                    <motion.div variants={itemVariants}>
                        <Paper
                            elevation={0}
                            sx={{
                                p: 3,
                                borderRadius: 4,
                                background: isDark
                                    ? 'linear-gradient(135deg, rgba(59, 130, 246, 0.15) 0%, rgba(139, 92, 246, 0.15) 100%)'
                                    : 'linear-gradient(135deg, #3B82F6 0%, #8B5CF6 100%)',
                                border: `1px solid ${isDark ? 'rgba(255, 255, 255, 0.08)' : 'transparent'}`,
                                color: isDark ? 'white' : 'white',
                            }}
                        >
                            <Typography variant="body2" sx={{ opacity: 0.8, mb: 1 }}>
                                Total Balance
                            </Typography>
                            <Typography variant="h4" sx={{ fontWeight: 700, fontFamily: '"SF Mono", monospace' }}>
                                ${totalBalance.toLocaleString()}
                            </Typography>
                        </Paper>
                    </motion.div>
                </Grid>

                {/* Individual Account Cards */}
                {accounts.map((account) => (
                    <Grid size={{ xs: 12, sm: 6, md: 4 }} key={account.id}>
                        <motion.div variants={itemVariants}>
                            <Paper
                                elevation={0}
                                sx={{
                                    p: 3,
                                    borderRadius: 4,
                                    bgcolor: isDark ? 'rgba(15, 23, 42, 0.6)' : 'white',
                                    border: `1px solid ${isDark ? 'rgba(255, 255, 255, 0.06)' : 'rgba(0, 0, 0, 0.04)'}`,
                                }}
                            >
                                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                                    <Box
                                        sx={{
                                            width: 10,
                                            height: 10,
                                            borderRadius: '50%',
                                            bgcolor: account.color,
                                            mr: 1,
                                        }}
                                    />
                                    <Typography variant="body2" color="text.secondary">
                                        {account.type} • {account.number}
                                    </Typography>
                                </Box>
                                <Typography variant="h5" sx={{ fontWeight: 600, fontFamily: '"SF Mono", monospace' }}>
                                    ${account.balance.toLocaleString()}
                                </Typography>
                            </Paper>
                        </motion.div>
                    </Grid>
                ))}
            </Grid>
        </Box>
    );
};
