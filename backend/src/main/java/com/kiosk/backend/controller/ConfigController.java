package com.kiosk.backend.controller;

import com.kiosk.backend.dto.ApiResponse;
import com.kiosk.backend.dto.ConfigEntry;
import com.kiosk.backend.dto.ConfigUpdateRequest;
import com.kiosk.backend.dto.OtpConfigResponse;
import com.kiosk.backend.service.ConfigService;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/v1/config")
@CrossOrigin(origins = "*")
public class ConfigController {

    private final ConfigService configService;

    public ConfigController(ConfigService configService) {
        this.configService = configService;
    }

    /**
     * Get all kiosk configuration
     */
    @GetMapping
    public ApiResponse<Map<String, String>> getAllConfig() {
        return ApiResponse.success(configService.getAllConfig());
    }

    /**
     * Get a specific config value
     */
    @GetMapping("/{key}")
    public ApiResponse<ConfigEntry> getConfig(@PathVariable String key) {
        String value = configService.getValue(key);
        return ApiResponse.success(new ConfigEntry(key, value));
    }

    /**
     * Get session timeout specifically (commonly needed)
     */
    @GetMapping("/session-timeout")
    public ApiResponse<Map<String, Integer>> getSessionTimeout() {
        return ApiResponse.success(Map.of("sessionTimeoutSeconds", configService.getSessionTimeoutSeconds()));
    }

    /**
     * Get OTP configuration
     */
    @GetMapping("/otp")
    public ApiResponse<OtpConfigResponse> getOtpConfig() {
        OtpConfigResponse data = new OtpConfigResponse(
                configService.getOtpExpirySeconds(),
                configService.getOtpMaxAttempts());
        return ApiResponse.success(data);
    }

    /**
     * Get feature flags
     */
    @GetMapping("/features")
    public ApiResponse<Map<String, Boolean>> getFeatures() {
        return ApiResponse.success(Map.of(
                "fundTransfer", configService.isFeatureEnabled("fund_transfer"),
                "billPayment", configService.isFeatureEnabled("bill_payment"),
                "chequeBook", configService.isFeatureEnabled("cheque_book"),
                "cardServices", configService.isFeatureEnabled("card_services")));
    }

    /**
     * Update a config value (Admin only - should be protected)
     */
    @PutMapping("/{key}")
    public ApiResponse<Void> updateConfig(
            @PathVariable String key,
            @RequestBody ConfigUpdateRequest request) {

        String value = request.getValue();
        Long adminId = request.getAdminId() != null ? Long.parseLong(request.getAdminId()) : null;

        configService.setValue(key, value, adminId);
        return ApiResponse.success(null, "Configuration updated");
    }
}
