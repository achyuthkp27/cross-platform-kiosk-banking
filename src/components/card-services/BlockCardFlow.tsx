import React, { useState } from 'react';
import { Box, Typography, Button, FormControl, RadioGroup, FormControlLabel, Radio, Paper } from '@mui/material';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';

interface BlockCardFlowProps {
    isBlocked: boolean;
    onCancel: () => void;
    onConfirm: (reason?: string) => void;
    loading?: boolean;
}

const REASONS = [
    'Lost Card',
    'Stolen Card',
    'Damaged Card',
    'Suspicious Activity',
    'Other'
];

const BlockCardFlow: React.FC<BlockCardFlowProps> = ({ isBlocked, onCancel, onConfirm, loading }) => {
    const [reason, setReason] = useState(REASONS[0]);

    if (isBlocked) {
        return (
            <Box sx={{ textAlign: 'center', maxWidth: 450, mx: 'auto' }}>
                <Typography variant="h6" gutterBottom>Unblock Card</Typography>
                <Typography variant="body1" color="text.secondary" paragraph>
                    Are you sure you want to unblock this card? You will be able to use it for transactions immediately.
                </Typography>

                <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', mt: 4 }}>
                    <Button variant="outlined" color="inherit" onClick={onCancel} disabled={loading}>
                        Cancel
                    </Button>
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={() => onConfirm()} // No reason needed for unblock
                        disabled={loading}
                    >
                        {loading ? 'Unblocking...' : 'Unblock Now'}
                    </Button>
                </Box>
            </Box>
        );
    }

    return (
        <Box sx={{ maxWidth: 500, mx: 'auto' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3, color: 'warning.main', justifyContent: 'center' }}>
                <WarningAmberIcon fontSize="large" />
                <Typography variant="h6">Block Card</Typography>
            </Box>

            <Typography variant="body1" align="center" paragraph>
                Blocking this card will temporarily disable all transactions. You can unblock it later.
            </Typography>

            <Typography variant="subtitle2" sx={{ mt: 3, mb: 2 }}>Select a reason:</Typography>

            <Paper variant="outlined" sx={{ p: 2, mb: 4, bgcolor: 'transparent' }}>
                <FormControl component="fieldset">
                    <RadioGroup
                        aria-label="reason"
                        name="reason"
                        value={reason}
                        onChange={(e) => setReason(e.target.value)}
                    >
                        {REASONS.map((r) => (
                            <FormControlLabel key={r} value={r} control={<Radio />} label={r} />
                        ))}
                    </RadioGroup>
                </FormControl>
            </Paper>

            <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center' }}>
                <Button variant="outlined" color="inherit" onClick={onCancel} disabled={loading}>
                    Cancel
                </Button>
                <Button
                    variant="contained"
                    color="error"
                    onClick={() => onConfirm(reason)}
                    disabled={loading}
                >
                    {loading ? 'Blocking...' : 'Block Card'}
                </Button>
            </Box>
        </Box>
    );
};

export default BlockCardFlow;
