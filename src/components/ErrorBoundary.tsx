import React, { Component, ErrorInfo, ReactNode } from 'react';
import { Box, Typography, Button, Paper } from '@mui/material';
import WarningAmberRoundedIcon from '@mui/icons-material/WarningAmberRounded';
import RefreshIcon from '@mui/icons-material/Refresh';
import HomeIcon from '@mui/icons-material/Home';

interface Props {
    children: ReactNode;
}

interface State {
    hasError: boolean;
    error: Error | null;
}

export default class ErrorBoundary extends Component<Props, State> {
    public state: State = {
        hasError: false,
        error: null,
    };

    public static getDerivedStateFromError(error: Error): State {
        // Update state so the next render will show the fallback UI.
        return { hasError: true, error };
    }

    public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
        console.error('Uncaught error:', error, errorInfo);
    }

    private handleReset = () => {
        this.setState({ hasError: false, error: null });
        window.location.href = '/'; // Hard reload to clear state
    };

    public render() {
        if (this.state.hasError) {
            return (
                <Box
                    sx={{
                        height: '100vh',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        bgcolor: '#0F172A', // Dark background for safety
                        p: 3,
                    }}
                >
                    <Paper
                        elevation={6}
                        sx={{
                            p: 5,
                            borderRadius: 4,
                            maxWidth: 500,
                            textAlign: 'center',
                            bgcolor: '#1E293B',
                            color: 'white',
                            border: '1px solid rgba(255,255,255,0.1)',
                        }}
                    >
                        <Box
                            sx={{
                                width: 80,
                                height: 80,
                                borderRadius: '50%',
                                bgcolor: 'rgba(239, 68, 68, 0.1)', // Red tint
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                mx: 'auto',
                                mb: 3,
                            }}
                        >
                            <WarningAmberRoundedIcon sx={{ fontSize: 40, color: '#EF4444' }} />
                        </Box>

                        <Typography variant="h4" fontWeight={700} gutterBottom>
                            System Error
                        </Typography>
                        <Typography variant="body1" sx={{ mb: 4, color: '#94A3B8' }}>
                            We encountered an unexpected issue. For security, your session has been paused.
                        </Typography>

                        <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center' }}>
                            <Button
                                variant="outlined"
                                startIcon={<HomeIcon />}
                                onClick={() => window.location.href = '/'}
                                sx={{
                                    borderRadius: 3,
                                    py: 1.5,
                                    color: 'white',
                                    borderColor: 'rgba(255,255,255,0.2)',
                                    '&:hover': { borderColor: 'white', bgcolor: 'rgba(255,255,255,0.05)' }
                                }}
                            >
                                Home
                            </Button>
                            <Button
                                variant="contained"
                                color="error"
                                startIcon={<RefreshIcon />}
                                onClick={this.handleReset}
                                sx={{
                                    borderRadius: 3,
                                    py: 1.5,
                                    boxShadow: '0 4px 12px rgba(239, 68, 68, 0.4)',
                                }}
                            >
                                Restart Kiosk
                            </Button>
                        </Box>

                        {process.env.NODE_ENV === 'development' && this.state.error && (
                            <Box sx={{ mt: 4, p: 2, bgcolor: 'rgba(0,0,0,0.3)', borderRadius: 2, textAlign: 'left' }}>
                                <Typography variant="caption" fontFamily="monospace" color="#EF4444">
                                    {this.state.error.toString()}
                                </Typography>
                            </Box>
                        )}
                    </Paper>
                </Box>
            );
        }

        return this.props.children;
    }
}
