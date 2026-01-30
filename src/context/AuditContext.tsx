import React, { createContext, useContext, useState, useEffect } from 'react';

export interface AuditLog {
    id: string;
    action: string;
    user: string;
    time: string;
    timestamp: number; // For sorting
    metadata?: Record<string, unknown>;
}

interface AuditContextType {
    logs: AuditLog[];
    addLog: (action: string, user: string, metadata?: Record<string, unknown>) => void;
    clearLogs: () => void;
}

const AuditContext = createContext<AuditContextType | undefined>(undefined);

export const AuditProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [logs, setLogs] = useState<AuditLog[]>([]);

    useEffect(() => {
        // Load logs from localStorage on mount
        try {
            const savedLogs = localStorage.getItem('kiosk_audit_logs');
            if (savedLogs) {
                setLogs(JSON.parse(savedLogs));
            }
        } catch (error) {
            console.error('Failed to load audit logs:', error);
        }
    }, []);

    const addLog = (action: string, user: string, metadata?: Record<string, unknown>) => {
        const now = new Date();
        const newLog: AuditLog = {
            id: crypto.randomUUID(),
            action,
            user,
            time: now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            timestamp: now.getTime(),
            metadata,
        };

        setLogs(prevLogs => {
            const updatedLogs = [newLog, ...prevLogs].slice(0, 100); // Keep last 100 logs
            try {
                localStorage.setItem('kiosk_audit_logs', JSON.stringify(updatedLogs));
            } catch (error) {
                console.error('Failed to save audit log:', error);
            }
            return updatedLogs;
        });
    };

    const clearLogs = () => {
        setLogs([]);
        localStorage.removeItem('kiosk_audit_logs');
    };

    return (
        <AuditContext.Provider value={{ logs, addLog, clearLogs }}>
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
