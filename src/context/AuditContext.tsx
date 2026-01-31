import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { auditService, isApiMode } from '../services';

export interface AuditLog {
    id: string;
    action: string;
    user: string;
    time: string;
    timestamp: number;
    metadata?: Record<string, unknown>;
}

interface AuditContextType {
    logs: AuditLog[];
    addLog: (action: string, user: string, metadata?: Record<string, unknown>) => void;
    clearLogs: () => void;
    refreshLogs: () => Promise<void>;
}

const AuditContext = createContext<AuditContextType | undefined>(undefined);

export const AuditProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [logs, setLogs] = useState<AuditLog[]>([]);

    // Load logs from service/localStorage on mount
    useEffect(() => {
        const loadLogs = async () => {
            try {
                // Try to fetch from service (backend in REAL, mock store in MOCK)
                const response = await auditService.getLogs(0, 100);
                if (response.success && response.data) {
                    const formattedLogs: AuditLog[] = response.data.map(log => ({
                        id: log.id.toString(),
                        action: log.action,
                        user: log.actorId || 'System',
                        time: new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                        timestamp: new Date(log.timestamp).getTime(),
                        metadata: log.details ? JSON.parse(log.details) : undefined
                    }));
                    setLogs(formattedLogs);
                    return;
                }
            } catch (error) {
                console.warn('[AuditContext] Failed to fetch logs from service:', error);
            }

            // Fallback to localStorage
            try {
                const savedLogs = localStorage.getItem('kiosk_audit_logs');
                if (savedLogs) {
                    setLogs(JSON.parse(savedLogs));
                }
            } catch (error) {
                console.error('[AuditContext] Failed to load audit logs:', error);
            }
        };

        loadLogs();
    }, []);

    const addLog = useCallback((action: string, user: string, metadata?: Record<string, unknown>) => {
        const now = new Date();
        const newLog: AuditLog = {
            id: crypto.randomUUID(),
            action,
            user,
            time: now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            timestamp: now.getTime(),
            metadata,
        };

        // Add to local state immediately for UI responsiveness
        setLogs(prevLogs => {
            const updatedLogs = [newLog, ...prevLogs].slice(0, 100);
            try {
                localStorage.setItem('kiosk_audit_logs', JSON.stringify(updatedLogs));
            } catch (error) {
                console.error('[AuditContext] Failed to save audit log:', error);
            }
            return updatedLogs;
        });

        // Also send to backend service (async, non-blocking)
        auditService.log({
            action,
            actorType: 'CUSTOMER',
            actorId: user,
            details: metadata ? JSON.stringify(metadata) : undefined
        }).catch(err => {
            console.warn('[AuditContext] Failed to send log to service:', err);
        });
    }, []);

    const clearLogs = useCallback(() => {
        setLogs([]);
        localStorage.removeItem('kiosk_audit_logs');
    }, []);

    const refreshLogs = useCallback(async () => {
        try {
            const response = await auditService.getLogs(0, 100);
            if (response.success && response.data) {
                const formattedLogs: AuditLog[] = response.data.map(log => ({
                    id: log.id.toString(),
                    action: log.action,
                    user: log.actorId || 'System',
                    time: new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                    timestamp: new Date(log.timestamp).getTime(),
                    metadata: log.details ? JSON.parse(log.details) : undefined
                }));
                setLogs(formattedLogs);
            }
        } catch (error) {
            console.error('[AuditContext] Failed to refresh logs:', error);
        }
    }, []);

    return (
        <AuditContext.Provider value={{ logs, addLog, clearLogs, refreshLogs }}>
            {children}
        </AuditContext.Provider>
    );
};

export const useAudit = () => {
    const context = useContext(AuditContext);
    if (!context) {
        throw new Error('useAudit must be used within an AuditProvider');
    }
    return context;
};

