package com.kiosk.backend.controller;

import com.kiosk.backend.entity.Customer;
import com.kiosk.backend.service.AuthService;
import com.kiosk.backend.service.AuditService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/v1/auth")
@CrossOrigin(origins = "*")
public class AuthController {

    private final AuthService authService;
    private final AuditService auditService;
    private final com.kiosk.backend.security.JwtService jwtService;
    private final com.kiosk.backend.service.SecurityMetricsService metricsService;

    public AuthController(AuthService authService, AuditService auditService,
            com.kiosk.backend.security.JwtService jwtService,
            com.kiosk.backend.service.SecurityMetricsService metricsService) {
        this.authService = authService;
        this.auditService = auditService;
        this.jwtService = jwtService;
        this.metricsService = metricsService;
    }

    /**
     * Login with User ID and DOB
     */
    @PostMapping("/login")
    public ResponseEntity<Map<String, Object>> login(@RequestBody Map<String, String> body) {
        String userId = body.get("userId");
        String dob = body.get("dob");

        Map<String, Object> response = new HashMap<>();

        if (userId == null || dob == null) {
            response.put("success", false);
            response.put("message", "User ID and DOB are required");
            return ResponseEntity.badRequest().body(response);
        }

        Optional<Customer> customerOpt = authService.authenticateCustomer(userId, dob);

        if (customerOpt.isEmpty()) {
            auditService.logCustomerAction("LOGIN_FAILED", userId, "Invalid credentials");
            metricsService.incrementAuthFailure();
            response.put("success", false);
            response.put("message", "Invalid User ID or Date of Birth");
            return ResponseEntity.ok(response);
        }

        Customer customer = customerOpt.get();
        // Generate Token
        String token = jwtService.generateToken(userId);
        String refreshToken = jwtService.generateRefreshToken(userId);

        auditService.logCustomerAction("LOGIN_SUCCESS", userId, null);
        metricsService.incrementAuthSuccess();

        response.put("success", true);
        response.put("message", "Login successful");
        response.put("token", token);
        response.put("refreshToken", refreshToken);
        response.put("data", Map.of(
                "userId", customer.getUserId(),
                "name", customer.getName(),
                "languagePref", customer.getLanguagePref(),
                "themePref", customer.getThemePref()));

        return ResponseEntity.ok(response);
    }

    /**
     * Refresh Token
     */
    @PostMapping("/refresh")
    public ResponseEntity<Map<String, Object>> refresh(@RequestBody Map<String, String> body) {
        String refreshToken = body.get("refreshToken");
        Map<String, Object> response = new HashMap<>();

        if (refreshToken == null) {
            response.put("success", false);
            response.put("message", "Refresh Token is required");
            return ResponseEntity.badRequest().body(response);
        }

        try {
            String userId = jwtService.extractUsername(refreshToken);
            if (userId != null && jwtService.isTokenValid(refreshToken, userId)) {
                String newToken = jwtService.generateToken(userId);
                response.put("success", true);
                response.put("token", newToken);
                response.put("message", "Token refreshed successfully");
                return ResponseEntity.ok(response);
            }
        } catch (Exception e) {
            // Token invalid or expired
        }

        response.put("success", false);
        response.put("message", "Invalid or expired refresh token");
        return ResponseEntity.status(401).body(response);
    }

    /**
     * Validate PIN for transaction authorization
     */
    @PostMapping("/validate-pin")
    public ResponseEntity<Map<String, Object>> validatePin(
            org.springframework.security.core.Authentication authentication,
            @RequestBody Map<String, String> body) {
        String pin = body.get("pin");
        Map<String, Object> response = new HashMap<>();

        if (pin == null) {
            response.put("success", false);
            response.put("message", "PIN is required");
            return ResponseEntity.badRequest().body(response);
        }

        String userId = (String) authentication.getPrincipal();
        if (userId == null)
            return ResponseEntity.status(401).build();

        final String finalUserId = userId.toUpperCase();
        boolean valid = authService.validatePin(java.util.Objects.requireNonNull(finalUserId), pin);

        if (valid) {
            auditService.logCustomerAction("PIN_VALIDATED", finalUserId, null);
            response.put("success", true);
            response.put("message", "PIN validated");
        } else {
            auditService.logCustomerAction("PIN_FAILED", finalUserId, null);
            response.put("success", false);
            response.put("message", "Invalid PIN");
        }

        return ResponseEntity.ok(response);
    }

    /**
     * Change PIN
     */
    @PostMapping("/change-pin")
    public ResponseEntity<Map<String, Object>> changePin(
            org.springframework.security.core.Authentication authentication,
            @RequestBody Map<String, String> body) {
        String oldPin = body.get("oldPin");
        String newPin = body.get("newPin");
        Map<String, Object> response = new HashMap<>();

        if (oldPin == null || newPin == null) {
            response.put("success", false);
            response.put("message", "Old PIN and new PIN are required");
            return ResponseEntity.badRequest().body(response);
        }

        String userId = (String) authentication.getPrincipal();
        if (userId == null)
            return ResponseEntity.status(401).build();

        final String finalUserId = userId.toUpperCase();
        boolean changed = authService.changePin(java.util.Objects.requireNonNull(finalUserId), oldPin, newPin);

        if (changed) {
            auditService.logCustomerAction("PIN_CHANGED", finalUserId, null);
            response.put("success", true);
            response.put("message", "PIN changed successfully");
        } else {
            response.put("success", false);
            response.put("message", "Invalid current PIN");
        }

        return ResponseEntity.ok(response);
    }

    /**
     * Update user preferences
     */
    @PostMapping("/preferences")
    public ResponseEntity<Map<String, Object>> updatePreferences(
            org.springframework.security.core.Authentication authentication,
            @RequestBody Map<String, String> body) {
        String language = body.get("language");
        String theme = body.get("theme");

        String userId = (String) authentication.getPrincipal(); // From Token
        if (userId == null)
            return ResponseEntity.status(401).build();

        // Normalize userId
        final String normalizedUserId = java.util.Objects
                .requireNonNull(java.util.Objects.requireNonNull(userId).toUpperCase());
        authService.updatePreferences(normalizedUserId, language, theme);

        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("message", "Preferences updated");

        return ResponseEntity.ok(response);
    }

    /**
     * Logout
     */
    @PostMapping("/logout")
    public ResponseEntity<Map<String, Object>> logout(org.springframework.security.core.Authentication authentication) {
        if (authentication != null && authentication.getPrincipal() instanceof String) {
            String userId = (String) authentication.getPrincipal();
            auditService.logCustomerAction("LOGOUT", userId, null);
        }

        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("message", "Logged out successfully");

        return ResponseEntity.ok(response);
    }

    /**
     * Get Profile
     */
    @GetMapping("/profile")
    public ResponseEntity<Map<String, Object>> getProfile(
            org.springframework.security.core.Authentication authentication) {
        String userId = (String) authentication.getPrincipal();
        final String nonNullUserId = java.util.Objects.requireNonNull(userId);
        Optional<Customer> customerOpt = authService
                .getCustomer(java.util.Objects.requireNonNull(nonNullUserId.toUpperCase()));

        Map<String, Object> response = new HashMap<>();
        if (customerOpt.isPresent()) {
            Customer customer = customerOpt.get();
            response.put("success", true);
            response.put("data", Map.of(
                    "userId", customer.getUserId(),
                    "name", customer.getName(),
                    "languagePref", customer.getLanguagePref(),
                    "themePref", customer.getThemePref()));
            return ResponseEntity.ok(response);
        } else {
            return ResponseEntity.notFound().build();
        }
    }
}
