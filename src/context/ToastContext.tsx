import React, { createContext, useContext, useState, useCallback } from 'react';
import { Snackbar, Alert, AlertColor, Slide, SlideProps, Box, Typography, alpha } from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ErrorIcon from '@mui/icons-material/Error';
import WarningIcon from '@mui/icons-material/Warning';
import InfoIcon from '@mui/icons-material/Info';

interface Toast {
    id: string;
    message: string;
    severity: AlertColor;
    duration?: number;
}

interface ToastContextType {
    showToast: (message: string, severity?: AlertColor, duration?: number) => void;
    showSuccess: (message: string, duration?: number) => void;
    showError: (message: string, duration?: number) => void;
    showWarning: (message: string, duration?: number) => void;
    showInfo: (message: string, duration?: number) => void;
}

const ToastContext = createContext<ToastContextType>({
    showToast: () => { },
    showSuccess: () => { },
    showError: () => { },
    showWarning: () => { },
    showInfo: () => { },
});

export const useToast = () => useContext(ToastContext);

const SlideTransition = (props: SlideProps) => {
    return <Slide {...props} direction="up" />;
};

const getIcon = (severity: AlertColor) => {
    const iconSx = { fontSize: 28 };
    switch (severity) {
        case 'success': return <CheckCircleIcon sx={iconSx} />;
        case 'error': return <ErrorIcon sx={iconSx} />;
        case 'warning': return <WarningIcon sx={iconSx} />;
        case 'info': return <InfoIcon sx={iconSx} />;
        default: return <InfoIcon sx={iconSx} />;
    }
};

const getColors = (severity: AlertColor) => {
    switch (severity) {
        case 'success': return { bg: '#059669', glow: '#10B981' };
        case 'error': return { bg: '#DC2626', glow: '#EF4444' };
        case 'warning': return { bg: '#D97706', glow: '#F59E0B' };
        case 'info': return { bg: '#0284C7', glow: '#0EA5E9' };
        default: return { bg: '#0284C7', glow: '#0EA5E9' };
    }
};

interface ToastProviderProps {
    children: React.ReactNode;
}

export const ToastProvider: React.FC<ToastProviderProps> = ({ children }) => {
    const [toasts, setToasts] = useState<Toast[]>([]);

    const showToast = useCallback((message: string, severity: AlertColor = 'info', duration: number = 4000) => {
        const id = Date.now().toString();
        setToasts(prev => [...prev, { id, message, severity, duration }]);
    }, []);

    const showSuccess = useCallback((message: string, duration?: number) => {
        showToast(message, 'success', duration);
    }, [showToast]);

    const showError = useCallback((message: string, duration?: number) => {
        showToast(message, 'error', duration);
    }, [showToast]);

    const showWarning = useCallback((message: string, duration?: number) => {
        showToast(message, 'warning', duration);
    }, [showToast]);

    const showInfo = useCallback((message: string, duration?: number) => {
        showToast(message, 'info', duration);
    }, [showToast]);

    const handleClose = (id: string) => {
        setToasts(prev => prev.filter(toast => toast.id !== id));
    };

    return (
        <ToastContext.Provider value={{ showToast, showSuccess, showError, showWarning, showInfo }}>
            {children}

            {/* Toast Container */}
            <Box
                sx={{
                    position: 'fixed',
                    bottom: 24,
                    left: '50%',
                    transform: 'translateX(-50%)',
                    zIndex: 10000,
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 1.5,
                    alignItems: 'center',
                }}
            >
                <AnimatePresence mode="popLayout">
                    {toasts.map((toast) => {
                        const colors = getColors(toast.severity);
                        return (
                            <motion.div
                                key={toast.id}
                                initial={{ opacity: 0, y: 50, scale: 0.8 }}
                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                exit={{ opacity: 0, y: -20, scale: 0.8 }}
                                transition={{ type: 'spring', damping: 20, stiffness: 300 }}
                                layout
                            >
                                <Snackbar
                                    open={true}
                                    autoHideDuration={toast.duration}
                                    onClose={() => handleClose(toast.id)}
                                    anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
                                    sx={{ position: 'relative' }}
                                >
                                    <Box
                                        sx={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: 2,
                                            px: 3,
                                            py: 2,
                                            borderRadius: 3,
                                            background: colors.bg,
                                            color: 'white',
                                            boxShadow: `0 8px 32px ${alpha(colors.glow, 0.4)}, 0 0 0 1px ${alpha('#fff', 0.1)}`,
                                            backdropFilter: 'blur(20px)',
                                            minWidth: 280,
                                        }}
                                    >
                                        <motion.div
                                            initial={{ rotate: -180, scale: 0 }}
                                            animate={{ rotate: 0, scale: 1 }}
                                            transition={{ delay: 0.1, type: 'spring', damping: 10 }}
                                        >
                                            {getIcon(toast.severity)}
                                        </motion.div>
                                        <Typography
                                            sx={{
                                                fontWeight: 600,
                                                fontSize: '0.95rem',
                                                letterSpacing: '0.01em',
                                            }}
                                        >
                                            {toast.message}
                                        </Typography>
                                    </Box>
                                </Snackbar>
                            </motion.div>
                        );
                    })}
                </AnimatePresence>
            </Box>
        </ToastContext.Provider>
    );
};

export default ToastProvider;
