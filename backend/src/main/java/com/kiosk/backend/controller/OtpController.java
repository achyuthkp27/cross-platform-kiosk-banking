package com.kiosk.backend.controller;

import com.kiosk.backend.dto.ApiResponse;
import com.kiosk.backend.dto.OtpGenerateRequest;
import com.kiosk.backend.dto.OtpValidateRequest;
import com.kiosk.backend.dto.OtpValidateResponse;
import com.kiosk.backend.service.OtpService;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/v1/otp")
@CrossOrigin(origins = "*")
public class OtpController {

    private final OtpService otpService;

    public OtpController(OtpService otpService) {
        this.otpService = otpService;
    }

    @PostMapping("/generate")
    public ApiResponse<Void> generate(@RequestBody OtpGenerateRequest request) {
        String identifier = request.getIdentifier();
        String purpose = request.getPurpose() != null ? request.getPurpose() : "LOGIN";

        otpService.generateOtp(identifier, purpose);
        return ApiResponse.success(null, "OTP sent to registered mobile");
    }

    @PostMapping("/validate")
    public ApiResponse<OtpValidateResponse> validate(@RequestBody OtpValidateRequest request) {
        OtpService.OtpValidationResult result = otpService.validateOtp(request.getIdentifier(), request.getCode());

        OtpValidateResponse data = new OtpValidateResponse(result.isValid(), result.getMessage());
        return ApiResponse.success(data, result.getMessage());
    }
}
