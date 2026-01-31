/**
 * Real API implementation for Authentication Service
 */

import { apiClient } from '../apiClient';
import { IAuthService } from '../../types/serviceInterfaces';
import { ApiResponse, LoginRequest, LoginResponse, CustomerProfile } from '../../types/services';

export const authApi: IAuthService = {
    async login(request: LoginRequest): Promise<ApiResponse<LoginResponse>> {
        const response = await apiClient.post<ApiResponse<LoginResponse>>('/auth/login', {
            userId: request.userId,
            dob: request.dob
        });
        
        if (response.success && response.token) {
            console.log('[AuthAPI] Login successful, setting token');
            apiClient.setToken(response.token);
        }
        
        return response;
    },

    async validatePin(userId: string, pin: string): Promise<ApiResponse<void>> {
        return apiClient.post('/auth/validate-pin', { userId, pin });
    },

    async changePin(userId: string, oldPin: string, newPin: string): Promise<ApiResponse<void>> {
        return apiClient.post('/auth/change-pin', { userId, oldPin, newPin });
    },

    async updatePreferences(userId: string, language?: string, theme?: string): Promise<ApiResponse<void>> {
        return apiClient.post('/auth/preferences', { userId, language, theme });
    },

    async logout(userId: string): Promise<void> {
        await apiClient.post('/auth/logout', { userId });
    },

    async getProfile(userId: string): Promise<ApiResponse<CustomerProfile>> {
        return apiClient.get(`/auth/profile/${userId}`);
    }
};
