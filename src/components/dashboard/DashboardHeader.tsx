import React from 'react';
import { Box, Typography, AppBar, Toolbar, Button, Chip } from '@mui/material';
import LogoutIcon from '@mui/icons-material/Logout';

interface DashboardHeaderProps {
    isDark: boolean;
    userName: string; // Or translate key
    timeLeft: number;
    formatTime: (seconds: number) => string;
    onLogout: () => void;
}

export const DashboardHeader: React.FC<DashboardHeaderProps> = ({
    isDark,
    userName,
    timeLeft,
    formatTime,
    onLogout
}) => {
    return (
        <AppBar
            position="static"
            color="transparent"
            elevation={0}
            sx={{
                bgcolor: isDark ? 'rgba(15, 23, 42, 0.8)' : 'rgba(255, 255, 255, 0.8)',
                backdropFilter: 'blur(12px)',
                borderBottom: `1px solid ${isDark ? 'rgba(255, 255, 255, 0.06)' : 'rgba(0, 0, 0, 0.06)'}`,
                transition: 'all 0.4s ease',
            }}
        >
            <Toolbar sx={{ py: 1 }}>
                <Box sx={{ flexGrow: 1 }}>
                    <Typography variant="h5" color="primary" sx={{ fontWeight: 700, letterSpacing: '-0.01em' }}>
                        Kiosk Banking
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                        {userName}
                    </Typography>
                </Box>

                <Chip
                    label={`Session: ${formatTime(timeLeft)}`}
                    color={timeLeft < 60 ? 'error' : 'default'}
                    variant={timeLeft < 60 ? 'filled' : 'outlined'}
                    sx={{
                        fontWeight: 600,
                        fontSize: '0.875rem',
                        px: 1,
                        mr: 2,
                        fontFamily: '"SF Mono", monospace'
                    }}
                />

                <Button
                    variant="outlined"
                    color="error"
                    startIcon={<LogoutIcon />}
                    onClick={onLogout}
                    sx={{
                        borderRadius: 2,
                        mr: 18,
                        borderWidth: 2,
                        '&:hover': { borderWidth: 2 }
                    }}
                >
                    Logout
                </Button>
            </Toolbar>
        </AppBar>
    );
};
