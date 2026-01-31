package com.kiosk.backend.controller;

import com.kiosk.backend.entity.Customer;
import com.kiosk.backend.service.CustomerService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/v1/customer")
@CrossOrigin(origins = "*")
public class CustomerController {

    private final CustomerService customerService;

    public CustomerController(CustomerService customerService) {
        this.customerService = customerService;
    }

    /**
     * Get customer address for authenticated user
     */
    @GetMapping("/address")
    public ResponseEntity<Map<String, Object>> getAddress(
            org.springframework.security.core.Authentication authentication) {
        Map<String, Object> response = new HashMap<>();
        String userId = (String) authentication.getPrincipal();
        // Auto-uppercase userId for case-insensitive lookup
        String normalizedUserId = userId.toUpperCase();

        Optional<Customer> customerOpt = customerService.getCustomerByUserId(normalizedUserId);

        if (customerOpt.isEmpty()) {
            response.put("success", false);
            response.put("message", "Customer not found");
            return ResponseEntity.status(404).body(response);
        }

        Customer customer = customerOpt.get();
        response.put("success", true);
        response.put("data", Map.of(
                "line1", customer.getAddressLine1() != null ? customer.getAddressLine1() : "",
                "line2", customer.getAddressLine2() != null ? customer.getAddressLine2() : "",
                "city", customer.getCity() != null ? customer.getCity() : "",
                "pin", customer.getPinCode() != null ? customer.getPinCode() : ""));

        return ResponseEntity.ok(response);
    }

    /**
     * Update customer address for authenticated user
     */
    @PutMapping("/address")
    public ResponseEntity<Map<String, Object>> updateAddress(
            org.springframework.security.core.Authentication authentication,
            @RequestBody Map<String, String> address) {
        Map<String, Object> response = new HashMap<>();
        String userId = (String) authentication.getPrincipal();
        // Auto-uppercase userId for case-insensitive lookup
        String normalizedUserId = userId.toUpperCase();

        try {
            Customer customer = customerService.updateAddress(
                    normalizedUserId,
                    address.get("line1"),
                    address.get("line2"),
                    address.get("city"),
                    address.get("pin"));

            response.put("success", true);
            response.put("message", "Address updated successfully");
            response.put("data", Map.of(
                    "line1", customer.getAddressLine1() != null ? customer.getAddressLine1() : "",
                    "line2", customer.getAddressLine2() != null ? customer.getAddressLine2() : "",
                    "city", customer.getCity() != null ? customer.getCity() : "",
                    "pin", customer.getPinCode() != null ? customer.getPinCode() : ""));

            return ResponseEntity.ok(response);

        } catch (IllegalArgumentException e) {
            response.put("success", false);
            response.put("message", e.getMessage());
            return ResponseEntity.badRequest().body(response);
        }
    }
}
