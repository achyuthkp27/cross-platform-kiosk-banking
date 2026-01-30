import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useRouter, usePathname } from 'expo-router';

interface SessionContextType {
    timeLeft: number;
    isActive: boolean;
    showWarning: boolean;
    resetSession: () => void;
    endSession: () => void;
    sessionDuration: number;
    setSessionDuration: (duration: number) => void;
}

const SessionContext = createContext<SessionContextType | undefined>(undefined);

export const useSession = () => {
    const context = useContext(SessionContext);
    if (!context) {
        throw new Error('useSession must be used within a SessionProvider');
    }
    return context;
};

// Configuration
const SESSION_TIMEOUT = 300; // 5 minutes in seconds
const WARNING_THRESHOLD = 30; // Show warning when 30 seconds remain

export const SessionProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const router = useRouter();
    const pathname = usePathname();

    // Default to 5 minutes (300 seconds) if not set
    const getStoredDuration = () => {
        if (typeof window !== 'undefined') {
            const stored = localStorage.getItem('kiosk_session_duration');
            return stored ? parseInt(stored, 10) : 300;
        }
        return 300;
    };

    const [sessionDuration, setSessionDurationState] = useState(getStoredDuration());
    const [timeLeft, setTimeLeft] = useState(sessionDuration);
    const [isActive, setIsActive] = useState(false); // Active means a user is logged in
    const [showWarning, setShowWarning] = useState(false);

    // Update localStorage when state changes
    const setSessionDuration = (seconds: number) => {
        setSessionDurationState(seconds);
        if (typeof window !== 'undefined') {
            localStorage.setItem('kiosk_session_duration', seconds.toString());
        }
    };

    const isProtectedRoute = useCallback(() => {
        return pathname !== '/';
    }, [pathname]);

    const endSession = useCallback(() => {
        setIsActive(false);
        setTimeLeft(sessionDuration);
        setShowWarning(false);
        router.replace('/');
    }, [router, sessionDuration]);

    const resetSession = useCallback(() => {
        // Only allow reset if specifically requested (e.g. from modal)
        // NOT on activity anymore
        if (!isActive) return;
        setTimeLeft(sessionDuration);
        setShowWarning(false);
    }, [isActive, sessionDuration]);

    // Timer Logic
    useEffect(() => {
        if (pathname === '/') {
            setIsActive(false);
            return;
        } else {
            if (!isActive) {
                setIsActive(true);
                setTimeLeft(sessionDuration);
            }
        }
    }, [pathname, sessionDuration, isActive]); // Added missing dependencies

    useEffect(() => {
        if (!isActive) return;

        const timer = setInterval(() => {
            setTimeLeft((prev) => {
                if (prev <= 1) {
                    clearInterval(timer);
                    endSession();
                    return 0;
                }
                if (prev <= WARNING_THRESHOLD) {
                    setShowWarning(true);
                }
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(timer);
    }, [isActive, endSession]);

    // OMITTED: Activity Listeners (removed per requirements)

    return (
        <SessionContext.Provider value={{
            timeLeft,
            isActive,
            showWarning,
            resetSession,
            endSession,
            sessionDuration,
            setSessionDuration
        }}>
            {children}
        </SessionContext.Provider>
    );
};
