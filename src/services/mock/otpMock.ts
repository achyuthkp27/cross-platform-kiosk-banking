/**
 * Mock implementation for OTP Service
 */

import { IOtpService } from '../../types/serviceInterfaces';
import { ApiResponse, OtpGenerateRequest, OtpValidateRequest, OtpValidateResponse } from '../../types/services';
import { MOCK_OTP_STORE, MOCK_CONFIG, delay } from './mockData';

export const otpMock: IOtpService = {
    async generate(request: OtpGenerateRequest): Promise<ApiResponse<void>> {
        await delay(1000);

        // Generate 6-digit OTP
        const code = '123456'; // Fixed for easy testing in mock mode
        const expiresAt = Date.now() + (MOCK_CONFIG.otp_expiry_seconds * 1000);

        MOCK_OTP_STORE.set(request.identifier, {
            code,
            expiresAt,
            attempts: 0
        });

        console.log(`[MOCK] OTP generated for ${request.identifier}: ${code}`);
        console.log(`[MOCK] Purpose: ${request.purpose || 'LOGIN'}`);

        return {
            success: true,
            message: 'OTP sent to registered mobile'
        };
    },

    async validate(request: OtpValidateRequest): Promise<ApiResponse<OtpValidateResponse>> {
        await delay(800);

        const stored = MOCK_OTP_STORE.get(request.identifier);

        if (!stored) {
            return {
                success: false,
                message: 'No OTP found',
                data: { valid: false, message: 'No OTP found for this identifier' }
            };
        }

        // Check expiry
        if (Date.now() > stored.expiresAt) {
            MOCK_OTP_STORE.delete(request.identifier);
            return {
                success: false,
                message: 'OTP expired',
                data: { valid: false, message: 'OTP has expired' }
            };
        }

        // Check attempts
        if (stored.attempts >= MOCK_CONFIG.otp_max_attempts) {
            return {
                success: false,
                message: 'Max attempts exceeded',
                data: { valid: false, message: 'Maximum attempts exceeded' }
            };
        }

        stored.attempts++;

        // Validate code
        if (stored.code === request.code) {
            MOCK_OTP_STORE.delete(request.identifier);
            return {
                success: true,
                message: 'OTP validated',
                data: { valid: true, message: 'OTP validated successfully' }
            };
        }

        const remaining = MOCK_CONFIG.otp_max_attempts - stored.attempts;
        return {
            success: false,
            message: `Invalid OTP. ${remaining} attempts remaining`,
            data: { valid: false, message: `Invalid OTP. ${remaining} attempts remaining` }
        };
    }
};
