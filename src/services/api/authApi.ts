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
            apiClient.setToken(response.token, response.refreshToken);
        }
        
        return response;
    },

    async validatePin(userId: string, pin: string): Promise<ApiResponse<void>> {
        return apiClient.post('/auth/validate-pin', { pin });
    },

    async changePin(userId: string, oldPin: string, newPin: string): Promise<ApiResponse<void>> {
        return apiClient.post('/auth/change-pin', { oldPin, newPin });
    },

    async updatePreferences(userId: string, language?: string, theme?: string): Promise<ApiResponse<void>> {
        return apiClient.post('/auth/preferences', { language, theme });
    },

    async logout(userId: string): Promise<void> {
        await apiClient.post('/auth/logout', {});
    },

    async getProfile(userId: string): Promise<ApiResponse<CustomerProfile>> {
        return apiClient.get(`/auth/profile`);
    },

    async refreshToken(): Promise<boolean> {
        const refreshToken = apiClient.getRefreshToken();
        if (!refreshToken) return false;

        try {
            const response = await apiClient.post<any>('/auth/refresh', { refreshToken });
            if (response.success && response.token) {
                console.log('[AuthAPI] Token refreshed successfully');
                apiClient.setToken(response.token, refreshToken); // Keep same refresh token? Or rotate?
                return true;
            }
        } catch (error) {
            console.error('[AuthAPI] Failed to refresh token', error);
        }
        return false;
    }
};
