import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import { useRouter, usePathname } from 'expo-router';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Typography, Box, LinearProgress } from '@mui/material';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';

// Configuration
const SESSION_TIMEOUT_MS = 5 * 60 * 1000; // 5 minutes
const WARNING_BEFORE_TIMEOUT_MS = 60 * 1000; // Show warning 1 minute before timeout
const ACTIVITY_EVENTS = ['mousedown', 'mousemove', 'keydown', 'scroll', 'touchstart', 'click'];

interface SessionContextType {
    isSessionActive: boolean;
    timeRemaining: number;
    resetSession: () => void;
    endSession: () => void;
}

const SessionContext = createContext<SessionContextType>({
    isSessionActive: false,
    timeRemaining: SESSION_TIMEOUT_MS,
    resetSession: () => { },
    endSession: () => { },
});

export const useSession = () => useContext(SessionContext);

interface SessionProviderProps {
    children: React.ReactNode;
}

export const SessionProvider: React.FC<SessionProviderProps> = ({ children }) => {
    const router = useRouter();
    const pathname = usePathname();
    const [isSessionActive, setIsSessionActive] = useState(false);
    const [timeRemaining, setTimeRemaining] = useState(SESSION_TIMEOUT_MS);
    const [showWarning, setShowWarning] = useState(false);
    const lastActivityRef = useRef<number>(Date.now());
    const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

    // Pages where session tracking should be active (not on landing/login)
    const isProtectedPage = pathname !== '/' && pathname !== '/login';

    const resetSession = useCallback(() => {
        lastActivityRef.current = Date.now();
        setTimeRemaining(SESSION_TIMEOUT_MS);
        setShowWarning(false);
        setIsSessionActive(true);
    }, []);

    const endSession = useCallback(() => {
        setIsSessionActive(false);
        setShowWarning(false);
        setTimeRemaining(SESSION_TIMEOUT_MS);
        // Navigate to landing page
        router.replace('/');
    }, [router]);

    // Handle user activity
    const handleActivity = useCallback(() => {
        if (isProtectedPage && isSessionActive) {
            lastActivityRef.current = Date.now();
            if (showWarning) {
                setShowWarning(false);
            }
        }
    }, [isProtectedPage, isSessionActive, showWarning]);

    // Set up activity listeners
    useEffect(() => {
        if (!isProtectedPage) return;

        ACTIVITY_EVENTS.forEach(event => {
            window.addEventListener(event, handleActivity, { passive: true });
        });

        return () => {
            ACTIVITY_EVENTS.forEach(event => {
                window.removeEventListener(event, handleActivity);
            });
        };
    }, [isProtectedPage, handleActivity]);

    // Start session when entering protected pages
    useEffect(() => {
        if (isProtectedPage && !isSessionActive) {
            resetSession();
        } else if (!isProtectedPage && isSessionActive) {
            setIsSessionActive(false);
        }
    }, [isProtectedPage, isSessionActive, resetSession]);

    // Session timer
    useEffect(() => {
        if (!isSessionActive || !isProtectedPage) {
            if (timerRef.current) {
                clearInterval(timerRef.current);
                timerRef.current = null;
            }
            return;
        }

        timerRef.current = setInterval(() => {
            const elapsed = Date.now() - lastActivityRef.current;
            const remaining = Math.max(0, SESSION_TIMEOUT_MS - elapsed);
            setTimeRemaining(remaining);

            // Show warning dialog
            if (remaining <= WARNING_BEFORE_TIMEOUT_MS && remaining > 0 && !showWarning) {
                setShowWarning(true);
            }

            // Session expired
            if (remaining === 0) {
                endSession();
            }
        }, 1000);

        return () => {
            if (timerRef.current) {
                clearInterval(timerRef.current);
                timerRef.current = null;
            }
        };
    }, [isSessionActive, isProtectedPage, showWarning, endSession]);

    const handleContinue = () => {
        resetSession();
    };

    const handleLogout = () => {
        endSession();
    };

    const warningTimeRemaining = Math.ceil(timeRemaining / 1000);

    return (
        <SessionContext.Provider value={{ isSessionActive, timeRemaining, resetSession, endSession }}>
            {children}

            {/* Session Timeout Warning Dialog */}
            <Dialog
                open={showWarning}
                onClose={handleContinue}
                PaperProps={{
                    sx: {
                        borderRadius: 4,
                        p: 2,
                        minWidth: 400,
                    }
                }}
            >
                <DialogTitle sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <WarningAmberIcon color="warning" sx={{ fontSize: 32 }} />
                    <Typography variant="h5" fontWeight={700}>
                        Session Timeout Warning
                    </Typography>
                </DialogTitle>
                <DialogContent>
                    <Typography variant="body1" sx={{ mb: 3 }}>
                        Your session will expire due to inactivity.
                    </Typography>
                    <Box sx={{ textAlign: 'center', mb: 2 }}>
                        <Typography variant="h2" color="warning.main" fontWeight={800}>
                            {warningTimeRemaining}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            seconds remaining
                        </Typography>
                    </Box>
                    <LinearProgress
                        variant="determinate"
                        value={(warningTimeRemaining / 60) * 100}
                        color="warning"
                        sx={{ height: 8, borderRadius: 4 }}
                    />
                </DialogContent>
                <DialogActions sx={{ justifyContent: 'center', gap: 2, pb: 2 }}>
                    <Button
                        variant="outlined"
                        color="error"
                        onClick={handleLogout}
                        size="large"
                        sx={{ borderRadius: 2, px: 4 }}
                    >
                        Logout
                    </Button>
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={handleContinue}
                        size="large"
                        sx={{ borderRadius: 2, px: 4 }}
                    >
                        Continue Session
                    </Button>
                </DialogActions>
            </Dialog>
        </SessionContext.Provider>
    );
};

export default SessionProvider;
