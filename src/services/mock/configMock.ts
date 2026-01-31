/**
 * Mock implementation for Config Service
 */

import { IConfigService } from '../../types/serviceInterfaces';
import { ApiResponse, KioskConfig, FeatureFlags } from '../../types/services';
import { MOCK_CONFIG, MOCK_FEATURES, delay } from './mockData';

export const configMock: IConfigService = {
    async getAll(): Promise<ApiResponse<KioskConfig>> {
        await delay(300);
        return {
            success: true,
            data: { ...MOCK_CONFIG }
        };
    },

    async getSessionTimeout(): Promise<number> {
        await delay(200);
        return MOCK_CONFIG.session_timeout_seconds;
    },

    async getOtpConfig(): Promise<{ expirySeconds: number; maxAttempts: number }> {
        await delay(200);
        return {
            expirySeconds: MOCK_CONFIG.otp_expiry_seconds,
            maxAttempts: MOCK_CONFIG.otp_max_attempts
        };
    },

    async getFeatures(): Promise<ApiResponse<FeatureFlags>> {
        await delay(200);
        return {
            success: true,
            data: { ...MOCK_FEATURES }
        };
    }
};
