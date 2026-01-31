/**
 * Real API implementation for OTP Service
 */

import { apiClient } from '../apiClient';
import { IOtpService } from '../../types/serviceInterfaces';
import { ApiResponse, OtpGenerateRequest, OtpValidateRequest, OtpValidateResponse } from '../../types/services';

export const otpApi: IOtpService = {
    async generate(request: OtpGenerateRequest): Promise<ApiResponse<void>> {
        return apiClient.post('/otp/generate', {
            identifier: request.identifier,
            purpose: request.purpose || 'LOGIN'
        });
    },

    async validate(request: OtpValidateRequest): Promise<ApiResponse<OtpValidateResponse>> {
        const response = await apiClient.post<ApiResponse<any>>('/otp/validate', {
            identifier: request.identifier,
            code: request.code
        });

        return {
            success: response.success,
            message: response.message,
            data: {
                valid: response.success,
                message: response.message || ''
            }
        };
    }
};
