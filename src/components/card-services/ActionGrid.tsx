import React from 'react';
import { Box, Typography, Grid, Paper } from '@mui/material';
import { motion } from 'framer-motion';
import LockIcon from '@mui/icons-material/Lock';
import LockOpenIcon from '@mui/icons-material/LockOpen';
import VpnKeyIcon from '@mui/icons-material/VpnKey';
import CreditCardIcon from '@mui/icons-material/CreditCard';
import BlockIcon from '@mui/icons-material/Block';
import { Card } from '../../types/card';

export type CardAction = 'BLOCK' | 'UNBLOCK' | 'PIN' | 'REPLACE';

interface ActionGridProps {
    card: Card;
    onAction: (action: CardAction) => void;
    isDark: boolean;
}

const ActionGrid: React.FC<ActionGridProps> = ({ card, onAction, isDark }) => {
    const isBlocked = card.status === 'BLOCKED';

    const actions = [
        {
            id: 'toggle-block',
            label: isBlocked ? 'Unblock Card' : 'Block Card',
            icon: isBlocked ? LockOpenIcon : LockIcon,
            action: isBlocked ? 'UNBLOCK' : 'BLOCK' as CardAction,
            color: isBlocked ? '#4ECDC4' : '#FF6B6B', // Green to unblock, Red to block
            desc: isBlocked ? 'Restore card access' : 'Temporarily disable card'
        },
        {
            id: 'change-pin',
            label: 'Change PIN',
            icon: VpnKeyIcon, 
            action: 'PIN' as CardAction,
            color: '#FFD93D',
            desc: 'Set a new secure PIN'
        },
        {
            id: 'replace-card',
            label: 'Replace Card',
            icon: CreditCardIcon,
            action: 'REPLACE' as CardAction,
            color: '#6C5CE7',
            desc: 'Request a new physical card'
        }
    ];

    return (
        <Grid container spacing={3} sx={{ mt: 2 }}>
            {actions.map((item) => {
                const Icon = item.icon;
                return (
                    <Grid size={{ xs: 12, sm: 4 }} key={item.id}>
                        <motion.div
                            whileHover={{ y: -5, scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                        >
                            <Paper
                                onClick={() => onAction(item.action)}
                                elevation={0}
                                sx={{
                                    p: 3,
                                    height: '100%',
                                    cursor: 'pointer',
                                    borderRadius: 4,
                                    bgcolor: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(255,255,255,0.8)',
                                    border: `1px solid ${isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)'}`,
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignItems: 'center',
                                    textAlign: 'center',
                                    transition: 'all 0.3s ease',
                                    '&:hover': {
                                        boxShadow: `0 10px 30px ${isDark ? 'rgba(0,0,0,0.5)' : 'rgba(0,0,0,0.1)'}`,
                                        borderColor: item.color,
                                        '& .icon-box': {
                                            bgcolor: item.color,
                                            color: '#fff',
                                            transform: 'scale(1.1) rotate(5deg)'
                                        }
                                    }
                                }}
                            >
                                <Box
                                    className="icon-box"
                                    sx={{
                                        width: 60,
                                        height: 60,
                                        borderRadius: '50%',
                                        bgcolor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)',
                                        color: item.color,
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        mb: 2,
                                        transition: 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)'
                                    }}
                                >
                                    <Icon sx={{ fontSize: 30 }} />
                                </Box>
                                <Typography variant="h6" fontWeight="bold" gutterBottom sx={{ color: isDark ? '#fff' : 'text.primary' }}>
                                    {item.label}
                                </Typography>
                                <Typography variant="body2" sx={{ color: 'text.secondary', opacity: 0.8 }}>
                                    {item.desc}
                                </Typography>
                            </Paper>
                        </motion.div>
                    </Grid>
                );
            })}
        </Grid>
    );
};

export default ActionGrid;
