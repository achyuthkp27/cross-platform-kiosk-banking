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

        auditService.logCustomerAction("LOGIN_SUCCESS", userId, null);
        metricsService.incrementAuthSuccess();

        response.put("success", true);
        response.put("message", "Login successful");
        response.put("token", token);
        response.put("data", Map.of(
                "userId", customer.getUserId(),
                "name", customer.getName(),
                "languagePref", customer.getLanguagePref(),
                "themePref", customer.getThemePref()));

        return ResponseEntity.ok(response);
    }

    /**
     * Validate PIN for transaction authorization
     */
    @PostMapping("/validate-pin")
    public ResponseEntity<Map<String, Object>> validatePin(@RequestBody Map<String, String> body) {
        String userId = body.get("userId");
        String pin = body.get("pin");

        Map<String, Object> response = new HashMap<>();

        if (userId == null || pin == null) {
            response.put("success", false);
            response.put("message", "User ID and PIN are required");
            return ResponseEntity.badRequest().body(response);
        }

        boolean valid = authService.validatePin(userId, pin);

        if (valid) {
            auditService.logCustomerAction("PIN_VALIDATED", userId, null);
            response.put("success", true);
            response.put("message", "PIN validated");
        } else {
            auditService.logCustomerAction("PIN_FAILED", userId, null);
            response.put("success", false);
            response.put("message", "Invalid PIN");
        }

        return ResponseEntity.ok(response);
    }

    /**
     * Change PIN
     */
    @PostMapping("/change-pin")
    public ResponseEntity<Map<String, Object>> changePin(@RequestBody Map<String, String> body) {
        String userId = body.get("userId");
        String oldPin = body.get("oldPin");
        String newPin = body.get("newPin");

        Map<String, Object> response = new HashMap<>();

        if (userId == null || oldPin == null || newPin == null) {
            response.put("success", false);
            response.put("message", "User ID, old PIN, and new PIN are required");
            return ResponseEntity.badRequest().body(response);
        }

        boolean changed = authService.changePin(userId, oldPin, newPin);

        if (changed) {
            auditService.logCustomerAction("PIN_CHANGED", userId, null);
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
    public ResponseEntity<Map<String, Object>> updatePreferences(@RequestBody Map<String, String> body) {
        String userId = body.get("userId");
        String language = body.get("language");
        String theme = body.get("theme");

        Map<String, Object> response = new HashMap<>();

        if (userId == null) {
            response.put("success", false);
            response.put("message", "User ID is required");
            return ResponseEntity.badRequest().body(response);
        }

        authService.updatePreferences(userId, language, theme);
        response.put("success", true);
        response.put("message", "Preferences updated");

        return ResponseEntity.ok(response);
    }

    /**
     * Logout
     */
    @PostMapping("/logout")
    public ResponseEntity<Map<String, Object>> logout(@RequestBody Map<String, String> body) {
        String userId = body.get("userId");

        if (userId != null) {
            auditService.logCustomerAction("LOGOUT", userId, null);
        }

        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("message", "Logged out successfully");

        return ResponseEntity.ok(response);
    }
}
