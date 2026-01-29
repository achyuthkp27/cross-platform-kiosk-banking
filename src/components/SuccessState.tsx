import React from 'react';
import { Box, Typography, Button } from '@mui/material';
import { motion } from 'framer-motion';

interface SuccessStateProps {
    message: string;
    subMessage?: string;
    onHome?: () => void;
}

export default function SuccessState({ message, subMessage, onHome }: SuccessStateProps) {
    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', py: 4 }}>
            <motion.div
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: 'spring', stiffness: 300, damping: 20 }}
            >
                <Box sx={{
                    width: 100,
                    height: 100,
                    borderRadius: '50%',
                    bgcolor: 'success.light',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    mb: 3,
                    color: 'success.main'
                }}>
                    <svg width="60" height="60" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                        <motion.path
                            d="M20 6L9 17l-5-5"
                            initial={{ pathLength: 0 }}
                            animate={{ pathLength: 1 }}
                            transition={{ duration: 0.5, delay: 0.2, ease: "easeInOut" }}
                        />
                    </svg>
                </Box>
            </motion.div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.5 }}
            >
                <Typography variant="h4" color="success.main" sx={{ fontWeight: 'bold', mb: 1, textAlign: 'center' }}>
                    {message}
                </Typography>
                {subMessage && (
                    <Typography variant="body1" color="text.secondary" sx={{ textAlign: 'center', mb: 3 }}>
                        {subMessage}
                    </Typography>
                )}
                {onHome && (
                    <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                        <Button variant="contained" onClick={onHome} size="large">
                            Back to Dashboard
                        </Button>
                    </Box>
                )}
            </motion.div>
        </Box>
    );
}
