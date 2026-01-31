/**
 * Mock implementation for Audit Service
 */

import { IAuditService } from '../../types/serviceInterfaces';
import { ApiResponse, AuditLogEntry, AuditLogRequest } from '../../types/services';
import { delay } from './mockData';

// In-memory audit log for mock mode
const mockAuditLogs: AuditLogEntry[] = [];
let mockAuditId = 1;

export const auditMock: IAuditService = {
    async log(request: AuditLogRequest): Promise<ApiResponse<{ id: number }>> {
        await delay(100);

        const entry: AuditLogEntry = {
            id: mockAuditId++,
            action: request.action,
            actorType: request.actorType || 'CUSTOMER',
            actorId: request.actorId,
            targetType: request.targetType,
            targetId: request.targetId,
            details: request.details,
            timestamp: new Date().toISOString()
        };

        mockAuditLogs.unshift(entry); // Add to beginning

        // Keep only last 100 entries in mock mode
        if (mockAuditLogs.length > 100) {
            mockAuditLogs.pop();
        }

        console.log(`[MOCK AUDIT] ${request.action} by ${request.actorType}:${request.actorId}`);

        return {
            success: true,
            data: { id: entry.id }
        };
    },

    async getLogs(page = 0, size = 50, actorType?: string): Promise<ApiResponse<AuditLogEntry[]>> {
        await delay(300);

        let logs = [...mockAuditLogs];

        if (actorType) {
            logs = logs.filter(l => l.actorType === actorType);
        }

        const start = page * size;
        const paged = logs.slice(start, start + size);

        return {
            success: true,
            data: paged
        };
    }
};
