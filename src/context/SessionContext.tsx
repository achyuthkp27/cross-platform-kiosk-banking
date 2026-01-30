import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
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

    // Track if we've initialized the session for this navigation
    const prevPathnameRef = useRef(pathname);

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

    // Handle route-based session activation
    // Using ref comparison to avoid cascading renders
    useEffect(() => {
        const prevPathname = prevPathnameRef.current;
        prevPathnameRef.current = pathname;

        // Navigating to home - end session
        if (pathname === '/' && prevPathname !== '/') {
            setIsActive(false);
            return;
        }

        // Navigating away from home - start session
        if (pathname !== '/' && prevPathname === '/') {
            setIsActive(true);
            setTimeLeft(sessionDuration);
        }
    }, [pathname, sessionDuration]);

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
