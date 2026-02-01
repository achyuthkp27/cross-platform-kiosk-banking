import React from 'react';
import { Modal, Box, Typography, Button, CircularProgress, useTheme } from '@mui/material';
import { motion } from 'framer-motion';
import LogoutIcon from '@mui/icons-material/Logout';
import { useSession } from '../context/SessionContext';
import { useState } from 'react';

export const SessionTimeoutModal = () => {
    const theme = useTheme();
    const { showWarning, timeLeft, resetSession, endSession } = useSession();
    const [isRefreshing, setIsRefreshing] = useState(false);

    const handleContinue = async () => {
        setIsRefreshing(true);
        await resetSession();
        setIsRefreshing(false);
    };

    if (!showWarning) return null;

    return (
        <Modal
            open={showWarning}
            onClose={() => { }} // Force user to choose
            sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                backdropFilter: 'blur(8px)',
                zIndex: 9999, // Ensure it's on top of everything
            }}
        >
            <Box
                component={motion.div}
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                sx={{
                    bgcolor: theme.palette.background.paper,
                    borderRadius: 4,
                    p: 4,
                    width: '90%',
                    maxWidth: 400,
                    outline: 'none',
                    textAlign: 'center',
                    boxShadow: 24,
                    border: `1px solid ${theme.palette.divider}`,
                }}
            >
                <Box sx={{ position: 'relative', display: 'inline-flex', mb: 3 }}>
                    <CircularProgress
                        variant="determinate"
                        value={(timeLeft / 30) * 100}
                        color="warning"
                        size={80}
                        thickness={4}
                    />
                    <Box
                        sx={{
                            top: 0,
                            left: 0,
                            bottom: 0,
                            right: 0,
                            position: 'absolute',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                        }}
                    >
                        <Typography variant="h5" fontWeight="bold" color="warning.main">
                            {timeLeft}s
                        </Typography>
                    </Box>
                </Box>

                <Typography variant="h5" fontWeight={700} gutterBottom>
                    Session Expiring
                </Typography>
                <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
                    Your secure session is about to end due to inactivity. Do you need more time?
                </Typography>

                <Box sx={{ display: 'flex', gap: 2 }}>
                    <Button
                        fullWidth
                        variant="outlined"
                        color="error"
                        startIcon={<LogoutIcon />}
                        onClick={endSession}
                        sx={{ borderRadius: 3, py: 1.5 }}
                    >
                        Logout Now
                    </Button>
                    <Button
                        fullWidth
                        variant="contained"
                        onClick={handleContinue}
                        disabled={isRefreshing}
                        sx={{ borderRadius: 3, py: 1.5, fontWeight: 700 }}
                    >
                        {isRefreshing ? 'Extending...' : 'Continue Session'}
                    </Button>
                </Box>
            </Box>
        </Modal>
    );
};
