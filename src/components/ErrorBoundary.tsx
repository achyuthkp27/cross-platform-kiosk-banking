import React, { Component, ErrorInfo, ReactNode } from 'react';
import { Box, Typography, Button, Paper, useTheme } from '@mui/material';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import RefreshIcon from '@mui/icons-material/Refresh';

interface Props {
    children: ReactNode;
    fallback?: ReactNode;
}

interface State {
    hasError: boolean;
    error: Error | null;
}

/**
 * Error Boundary component to catch React errors and display a user-friendly fallback.
 * Prevents the entire app from crashing due to component errors.
 */
class ErrorBoundary extends Component<Props, State> {
    public state: State = {
        hasError: false,
        error: null,
    };

    public static getDerivedStateFromError(error: Error): State {
        return { hasError: true, error };
    }

    public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
        console.error('Uncaught error:', error, errorInfo);
        // In production, you could send this to an error reporting service
    }

    private handleRetry = () => {
        this.setState({ hasError: false, error: null });
    };

    private handleGoHome = () => {
        window.location.href = '/';
    };

    public render() {
        if (this.state.hasError) {
            if (this.props.fallback) {
                return this.props.fallback;
            }

            return (
                <Box
                    sx={{
                        minHeight: '100vh',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        p: 4,
                        bgcolor: 'background.default',
                    }}
                >
                    <Paper
                        elevation={0}
                        sx={{
                            p: 6,
                            maxWidth: 500,
                            textAlign: 'center',
                            borderRadius: 4,
                            border: '1px solid',
                            borderColor: 'divider',
                        }}
                    >
                        <ErrorOutlineIcon
                            sx={{
                                fontSize: 80,
                                color: 'error.main',
                                mb: 3,
                            }}
                        />
                        <Typography variant="h4" gutterBottom sx={{ fontWeight: 700 }}>
                            Something went wrong
                        </Typography>
                        <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
                            We encountered an unexpected error. Please try again or return to the home screen.
                        </Typography>
                        {process.env.NODE_ENV === 'development' && this.state.error && (
                            <Box
                                sx={{
                                    mb: 4,
                                    p: 2,
                                    bgcolor: 'error.lighter',
                                    borderRadius: 2,
                                    textAlign: 'left',
                                    overflow: 'auto',
                                }}
                            >
                                <Typography
                                    variant="caption"
                                    component="pre"
                                    sx={{
                                        fontFamily: '"SF Mono", Monaco, monospace',
                                        whiteSpace: 'pre-wrap',
                                        wordBreak: 'break-word',
                                        color: 'error.main',
                                    }}
                                >
                                    {this.state.error.toString()}
                                </Typography>
                            </Box>
                        )}
                        <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center' }}>
                            <Button
                                variant="outlined"
                                startIcon={<RefreshIcon />}
                                onClick={this.handleRetry}
                                size="large"
                                sx={{ borderRadius: 2 }}
                            >
                                Try Again
                            </Button>
                            <Button
                                variant="contained"
                                onClick={this.handleGoHome}
                                size="large"
                                sx={{ borderRadius: 2 }}
                            >
                                Go Home
                            </Button>
                        </Box>
                    </Paper>
                </Box>
            );
        }

        return this.props.children;
    }
}

export default ErrorBoundary;
