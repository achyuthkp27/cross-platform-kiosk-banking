import React from 'react';
import { Box, Typography, Grid, Paper, alpha, useTheme } from '@mui/material';
import { motion, Variants } from 'framer-motion';
import ParallaxCard from '../ui/ParallaxCard';

import { Account as ServiceAccount } from '../../types/services';

interface Account extends ServiceAccount {
    color: string;
}

interface AccountSummaryProps {
    accounts: Account[];
    totalBalance: number;
    isDark: boolean;
    itemVariants: Variants;
    onAccountClick?: (accountId: string) => void;
}

const CardChip = () => (
    <Box
        sx={{
            width: 40,
            height: 30,
            borderRadius: 1,
            background: 'linear-gradient(135deg, #d4af37 0%, #f9f295 50%, #d4af37 100%)',
            position: 'relative',
            mb: 2,
            boxShadow: 'inset 0 0 10px rgba(0,0,0,0.2)',
            '&::after': {
                content: '""',
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-120%, -50%)',
                width: '1px',
                height: '70%',
                bgcolor: 'rgba(0,0,0,0.1)'
            }
        }}
    />
);

export const AccountSummary: React.FC<AccountSummaryProps> = ({
    accounts,
    totalBalance,
    isDark,
    itemVariants,
    onAccountClick
}) => {
    return (
        <Box sx={{ mb: 6 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', mb: 3 }}>
                <Typography variant="h5" sx={{ fontWeight: 700, letterSpacing: '-0.02em', color: isDark ? 'white' : 'text.primary' }}>
                    Account Summary
                </Typography>
                <Typography variant="body2" sx={{ color: 'text.secondary', fontWeight: 500 }}>
                    Total: <Box component="span" sx={{ color: isDark ? 'primary.light' : 'primary.main', fontWeight: 700 }}>${totalBalance.toLocaleString()}</Box>
                </Typography>
            </Box>
            
            <Box 
                sx={{ 
                    display: 'flex', 
                    gap: { xs: 2, md: 4 }, 
                    overflowX: 'auto', 
                    pb: 4, 
                    px: 1,
                    mx: -1,
                    cursor: 'grab',
                    scrollSnapType: 'x proximity',
                    '&:active': { cursor: 'grabbing' },
                    '::-webkit-scrollbar': {
                        height: '4px',
                    },
                    '::-webkit-scrollbar-track': {
                        background: isDark ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.03)',
                        borderRadius: '10px',
                    },
                    '::-webkit-scrollbar-thumb': {
                        background: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)',
                        borderRadius: '10px',
                    },
                }}
            >
                {/* Total Balance Card - Specialized Design */}
                <Box sx={{ flexShrink: 0, width: { xs: '320px', sm: '380px' }, scrollSnapAlign: 'start' }}>
                    <motion.div variants={itemVariants}>
                        <Paper
                            elevation={10}
                            sx={{
                                p: 4,
                                height: 220,
                                borderRadius: 6,
                                background: isDark
                                    ? 'linear-gradient(225deg, #1e293b 0%, #0f172a 100%)'
                                    : 'linear-gradient(225deg, #3b82f6 0%, #1e3a8a 100%)',
                                border: `1px solid ${isDark ? 'rgba(255, 255, 255, 0.08)' : 'transparent'}`,
                                color: 'white',
                                position: 'relative',
                                overflow: 'hidden',
                                display: 'flex',
                                flexDirection: 'column',
                                justifyContent: 'space-between'
                            }}
                        >
                            {/* Decorative Background Elements */}
                            <Box sx={{ 
                                position: 'absolute', top: -50, right: -50, width: 200, height: 200, 
                                borderRadius: '50%', background: 'rgba(255,255,255,0.03)', pointerEvents: 'none' 
                            }} />
                            
                            <Box>
                                <Typography variant="overline" sx={{ opacity: 0.6, letterSpacing: 2, fontWeight: 600 }}>
                                    Net Liquid Assets
                                </Typography>
                                <Typography variant="h3" sx={{ fontWeight: 800, fontFamily: '"Outfit", sans-serif', mt: 1 }}>
                                    ${totalBalance.toLocaleString()}
                                </Typography>
                            </Box>
                            
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                                <Box>
                                    <Typography variant="caption" sx={{ opacity: 0.6, display: 'block' }}>
                                        PLATINUM MEMBER
                                    </Typography>
                                    <Typography variant="body2" sx={{ fontWeight: 600, letterSpacing: 1 }}>
                                        TOTAL ASSETS
                                    </Typography>
                                </Box>
                                <Box component="span" sx={{ fontSize: '1.2rem', fontWeight: 900, opacity: 0.5 }}>
                                    VISA
                                </Box>
                            </Box>
                        </Paper>
                    </motion.div>
                </Box>

                {/* Individual Account Cards */}
                {accounts.map((account) => (
                    <Box 
                        key={account.id} 
                        sx={{ flexShrink: 0, width: { xs: '300px', sm: '340px' }, scrollSnapAlign: 'start' }}
                    >
                        <motion.div 
                            variants={itemVariants} 
                            onClick={() => onAccountClick && onAccountClick(account.accountNumber)}
                        >
                            <ParallaxCard intensity={15} glare elevation={6} sx={{ cursor: 'pointer', borderRadius: 6 }}>
                                <Box
                                    sx={{
                                        p: 4,
                                        height: 220,
                                        display: 'flex',
                                        flexDirection: 'column',
                                        justifyContent: 'space-between',
                                        position: 'relative',
                                        overflow: 'hidden',
                                        background: isDark ? 'rgba(15, 23, 42, 0.4)' : 'rgba(255, 255, 255, 0.8)',
                                    }}
                                >
                                    <Box>
                                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                            <CardChip />
                                            <Box
                                                sx={{
                                                    px: 1.5,
                                                    py: 0.5,
                                                    borderRadius: 2,
                                                    background: alpha(account.color, 0.1),
                                                    border: `1px solid ${alpha(account.color, 0.2)}`,
                                                }}
                                            >
                                                <Typography variant="caption" sx={{ fontWeight: 700, color: account.color, textTransform: 'uppercase' }}>
                                                    {account.type}
                                                </Typography>
                                            </Box>
                                        </Box>
                                        <Typography variant="body2" sx={{ color: 'text.secondary', letterSpacing: 3, mt: 1 }}>
                                            •••• •••• •••• {account.accountNumber.slice(-4)}
                                        </Typography>
                                    </Box>

                                    <Box>
                                        <Typography variant="h4" sx={{ fontWeight: 700, fontFamily: '"Outfit", sans-serif' }}>
                                            ${account.balance.toLocaleString()}
                                        </Typography>
                                        <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 500 }}>
                                            AVAILABLE BALANCE
                                        </Typography>
                                    </Box>
                                </Box>
                            </ParallaxCard>
                        </motion.div>
                    </Box>
                ))}
            </Box>
        </Box>
    );
};
