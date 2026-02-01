import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import { useRouter, usePathname } from 'expo-router';
import { configService, authService } from '../services';

interface SessionContextType {
    timeLeft: number;
    isActive: boolean;
    showWarning: boolean;
    resetSession: () => Promise<void>;
    endSession: () => void;
    sessionDuration: number;
    setSessionDuration: (duration: number) => void;
    configLoaded: boolean;
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
const DEFAULT_SESSION_DURATION = 300; // 5 minutes fallback

export const SessionProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const router = useRouter();
    const pathname = usePathname();

    // Get stored duration from localStorage or default
    const getStoredDuration = () => {
        if (typeof window !== 'undefined') {
            const stored = localStorage.getItem('kiosk_session_duration');
            return stored ? parseInt(stored, 10) : DEFAULT_SESSION_DURATION;
        }
        return DEFAULT_SESSION_DURATION;
    };

    const [sessionDuration, setSessionDurationState] = useState(getStoredDuration());
    const [timeLeft, setTimeLeft] = useState(sessionDuration);
    const [isActive, setIsActive] = useState(pathname !== '/');
    const [showWarning, setShowWarning] = useState(false);
    const [configLoaded, setConfigLoaded] = useState(false);



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

    const resetSession = useCallback(async () => {
        if (!isActive) return;
        
        // If we are showing warning (session near expiry), try to refresh token
        if (showWarning) {
            console.log('[SessionContext] Session extending - attempting to refresh token');
            const refreshed = await authService.refreshToken();
            if (!refreshed) {
                console.warn('[SessionContext] Failed to refresh token - ending session');
                endSession();
                return;
            }
        }

        setTimeLeft(sessionDuration);
        setShowWarning(false);
    }, [isActive, sessionDuration, showWarning, endSession]);

    // Fetch session timeout from backend on mount
    useEffect(() => {
        const fetchConfig = async () => {
            try {
                const timeout = await configService.getSessionTimeout();
                if (timeout && timeout > 0) {
                    setSessionDurationState(timeout);
                    setTimeLeft(timeout);
                    if (typeof window !== 'undefined') {
                        localStorage.setItem('kiosk_session_duration', timeout.toString());
                    }
                    console.log(`[SessionContext] Loaded session timeout from config: ${timeout}s`);
                }
            } catch (error) {
                console.warn('[SessionContext] Failed to fetch session config, using default:', error);
            } finally {
                setConfigLoaded(true);
            }
        };

        fetchConfig();

        // Listen for auth expiry (401/403) from apiClient
        const handleAuthExpired = () => {
             console.log('[SessionContext] Auth expired event received, ending session');
             endSession();
        };

        if (typeof window !== 'undefined') {
            window.addEventListener('kiosk:auth:expired', handleAuthExpired);
        }

        return () => {
            if (typeof window !== 'undefined') {
                window.removeEventListener('kiosk:auth:expired', handleAuthExpired);
            }
        };
    }, [endSession]);

    // Handle route-based session activation
    // Session should only start AFTER user is logged in (has kiosk_userId in sessionStorage)
    useEffect(() => {
        const prevPathname = prevPathnameRef.current;
        prevPathnameRef.current = pathname;

        // Navigating to home - end session
        if (pathname === '/' && prevPathname !== '/') {
            setIsActive(false);
            return;
        }

        // Only start session if user is logged in (check sessionStorage)
        const isLoggedIn = typeof window !== 'undefined' && sessionStorage.getItem('kiosk_userId');
        
        // Start session only on dashboard (post-login) or if already logged in
        if (pathname === '/dashboard' && !isActive && isLoggedIn) {
            setIsActive(true);
            setTimeLeft(sessionDuration);
        }
    }, [pathname, sessionDuration, isActive]);

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

    return (
        <SessionContext.Provider value={{
            timeLeft,
            isActive,
            showWarning,
            resetSession,
            endSession,
            sessionDuration,
            setSessionDuration,
            configLoaded
        }}>
            {children}
        </SessionContext.Provider>
    );
};

