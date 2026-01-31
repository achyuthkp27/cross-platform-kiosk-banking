/**
 * Real API implementation for Config Service
 */

import { apiClient } from '../apiClient';
import { IConfigService } from '../../types/serviceInterfaces';
import { ApiResponse, KioskConfig, FeatureFlags } from '../../types/services';

export const configApi: IConfigService = {
    async getAll(): Promise<ApiResponse<KioskConfig>> {
        const response = await apiClient.get<ApiResponse<Record<string, string>>>('/config');

        // Transform string values to typed config
        const data = response.data || {};
        return {
            success: response.success,
            data: {
                session_timeout_seconds: parseInt(data['session_timeout_seconds'] || '300'),
                otp_expiry_seconds: parseInt(data['otp_expiry_seconds'] || '300'),
                otp_max_attempts: parseInt(data['otp_max_attempts'] || '3'),
                pin_max_attempts: parseInt(data['pin_max_attempts'] || '3'),
                idle_reset_seconds: parseInt(data['idle_reset_seconds'] || '60')
            }
        };
    },

    async getSessionTimeout(): Promise<number> {
        const response = await apiClient.get<{ sessionTimeoutSeconds: number }>('/config/session-timeout');
        return response.sessionTimeoutSeconds || 300;
    },

    async getOtpConfig(): Promise<{ expirySeconds: number; maxAttempts: number }> {
        const response = await apiClient.get<{ expirySeconds: number; maxAttempts: number }>('/config/otp');
        return {
            expirySeconds: response.expirySeconds || 300,
            maxAttempts: response.maxAttempts || 3
        };
    },

    async getFeatures(): Promise<ApiResponse<FeatureFlags>> {
        return apiClient.get('/config/features');
    }
};
