/**
 * Mock implementation for Authentication Service
 */

import { IAuthService } from '../../types/serviceInterfaces';
import { ApiResponse, LoginRequest, LoginResponse, CustomerProfile } from '../../types/services';
import { MOCK_CUSTOMERS, delay } from './mockData';

export const authMock: IAuthService = {
    async login(request: LoginRequest): Promise<ApiResponse<LoginResponse>> {
        await delay(1000);

        const customer = MOCK_CUSTOMERS[request.userId];

        if (!customer) {
            return {
                success: false,
                message: 'Invalid User ID'
            };
        }

        if (customer.dobHash !== request.dob) {
            return {
                success: false,
                message: 'Invalid Date of Birth'
            };
        }

        console.log(`[MOCK] Login successful for ${request.userId}`);

        return {
            success: true,
            message: 'Login successful',
            data: {
                userId: customer.userId,
                name: customer.name,
                languagePref: customer.languagePref,
                themePref: customer.themePref
            }
        };
    },

    async validatePin(userId: string, pin: string): Promise<ApiResponse<void>> {
        await delay(800);

        const customer = MOCK_CUSTOMERS[userId];

        if (!customer || customer.pinHash !== pin) {
            return {
                success: false,
                message: 'Invalid PIN'
            };
        }

        return {
            success: true,
            message: 'PIN validated'
        };
    },

    async changePin(userId: string, oldPin: string, newPin: string): Promise<ApiResponse<void>> {
        await delay(1000);

        const customer = MOCK_CUSTOMERS[userId];

        if (!customer || customer.pinHash !== oldPin) {
            return {
                success: false,
                message: 'Invalid current PIN'
            };
        }

        // In mock mode, we don't persist the change
        console.log(`[MOCK] PIN changed for ${userId} (not persisted)`);

        return {
            success: true,
            message: 'PIN changed successfully'
        };
    },

    async updatePreferences(userId: string, language?: string, theme?: string): Promise<ApiResponse<void>> {
        await delay(500);

        console.log(`[MOCK] Preferences updated for ${userId}: lang=${language}, theme=${theme}`);

        return {
            success: true,
            message: 'Preferences updated'
        };
    },

    async logout(userId: string): Promise<void> {
        await delay(300);
        console.log(`[MOCK] Logged out ${userId}`);
    },

    async getProfile(userId: string): Promise<ApiResponse<CustomerProfile>> {
        await delay(500);

        const customer = MOCK_CUSTOMERS[userId];

        if (!customer) {
            return {
                success: false,
                message: 'Customer not found'
            };
        }

        return {
            success: true,
            data: {
                userId: customer.userId,
                name: customer.name,
                mobileNumber: customer.mobileNumber,
                email: customer.email,
                languagePref: customer.languagePref,
                themePref: customer.themePref
            }
        };
    },

    async refreshToken(): Promise<boolean> {
        await delay(500);
        console.log('[MOCK] Token refreshed successfully');
        return true;
    }
};
