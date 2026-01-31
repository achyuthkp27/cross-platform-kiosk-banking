import React, { useState, useEffect } from 'react';
import { Box, Typography, Switch, FormControlLabel, Paper, IconButton } from '@mui/material';
import { apiClient } from '../../services/apiClient';
import CodeIcon from '@mui/icons-material/Code'; // Using Code icon for DevTools
import CloseIcon from '@mui/icons-material/Close';

export const DevTools = () => {
    const [visible, setVisible] = useState(false);
    const isMockMode = process.env.EXPO_PUBLIC_DATA_MODE !== 'REAL';

    if (!visible) {
        return (
            <Box sx={{ position: 'absolute', bottom: 16, right: 16, zIndex: 9999 }}>
                <IconButton
                    onClick={() => setVisible(true)}
                    sx={{
                        bgcolor: 'background.paper',
                        boxShadow: 3,
                        '&:hover': { bgcolor: 'action.hover' }
                    }}
                >
                    <CodeIcon fontSize="small" />
                </IconButton>
            </Box>
        );
    }

    return (
        <Paper
            elevation={4}
            sx={{
                position: 'absolute',
                bottom: 16,
                right: 16,
                p: 2,
                zIndex: 9999,
                minWidth: 200,
                border: '1px solid',
                borderColor: 'divider'
            }}
        >
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="subtitle2" fontWeight="bold">Dev Tools</Typography>
                <IconButton size="small" onClick={() => setVisible(false)}>
                    <CloseIcon fontSize="small" />
                </IconButton>
            </Box>

            <Box sx={{ mb: 1 }}>
                <Typography variant="caption" color="text.secondary">DATA MODE</Typography>
                <Typography variant="body2" fontWeight="bold" color={isMockMode ? 'warning.main' : 'success.main'}>
                    {isMockMode ? 'MOCK (Local Only)' : 'REAL (Connected)'}
                </Typography>
            </Box>

            <Typography variant="caption" display="block" sx={{ mt: 1, color: 'text.secondary' }}>
                {isMockMode
                    ? 'Using simulated data'
                    : 'Connecting to http://localhost:8080'}
            </Typography>
            
            <Typography variant="caption" display="block" sx={{ mt: 1, color: 'text.disabled', fontSize: '0.7rem' }}>
                Restart app to change mode
            </Typography>
        </Paper>
    );
};
