import React from 'react';
import { Box, Typography, Button, Paper, Divider } from '@mui/material';
import HomeIcon from '@mui/icons-material/Home';

interface ReplaceCardFlowProps {
    onCancel: () => void;
    onConfirm: () => void;
    loading?: boolean;
}

const ReplaceCardFlow: React.FC<ReplaceCardFlowProps> = ({ onCancel, onConfirm, loading }) => {
    // Mock user address
    const address = {
        line1: '123, Highland Park',
        line2: 'Financial District',
        city: 'Metropolis',
        zip: '500081'
    };

    return (
        <Box sx={{ maxWidth: 450, mx: 'auto', textAlign: 'center' }}>
            <Typography variant="h6" gutterBottom>Request Replacement</Typography>
            <Typography variant="body2" color="text.secondary" paragraph>
                Your current card will be blocked permanently. A new card will be issued and delivered to your registered address.
            </Typography>

            <Paper elevation={0} variant="outlined" sx={{ p: 3, my: 4, textAlign: 'left', bgcolor: 'transparent' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1, color: 'primary.main' }}>
                    <HomeIcon />
                    <Typography variant="subtitle2">Delivery Address</Typography>
                </Box>
                <Divider sx={{ my: 1 }} />
                <Typography variant="body1">{address.line1}</Typography>
                <Typography variant="body1">{address.line2}</Typography>
                <Typography variant="body1">{address.city} - {address.zip}</Typography>
            </Paper>

            <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center' }}>
                <Button variant="outlined" color="inherit" onClick={onCancel} disabled={loading}>
                    Cancel
                </Button>
                <Button
                    variant="contained"
                    color="primary"
                    onClick={onConfirm}
                    disabled={loading}
                >
                    {loading ? 'Processing...' : 'Confirm Replacement'}
                </Button>
            </Box>
        </Box>
    );
};

export default ReplaceCardFlow;
