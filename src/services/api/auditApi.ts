/**
 * Real API implementation for Audit Service
 */

import { apiClient } from '../apiClient';
import { IAuditService } from '../../types/serviceInterfaces';
import { ApiResponse, AuditLogEntry, AuditLogRequest } from '../../types/services';

export const auditApi: IAuditService = {
    async log(request: AuditLogRequest): Promise<ApiResponse<{ id: number }>> {
        return apiClient.post('/audit/log', request);
    },

    async getLogs(page = 0, size = 50, actorType?: string): Promise<ApiResponse<AuditLogEntry[]>> {
        let url = `/audit/logs?page=${page}&size=${size}`;
        if (actorType) {
            url += `&actorType=${actorType}`;
        }
        return apiClient.get(url);
    }
};
