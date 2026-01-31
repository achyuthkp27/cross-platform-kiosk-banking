package com.kiosk.backend.controller;

import com.kiosk.backend.entity.ChequeBookOrder;
import com.kiosk.backend.service.ChequeBookService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/v1/cheque-book")
@CrossOrigin(origins = "*")
public class ChequeBookController {

    private final ChequeBookService chequeBookService;

    public ChequeBookController(ChequeBookService chequeBookService) {
        this.chequeBookService = chequeBookService;
    }

    /**
     * Create a new cheque book order
     */
    /**
     * Create a new cheque book order for authenticated user
     */
    @PostMapping("/order")
    public ResponseEntity<Map<String, Object>> createOrder(
            org.springframework.security.core.Authentication authentication,
            @RequestBody Map<String, Object> request) {
        Map<String, Object> response = new HashMap<>();

        try {
            Long accountId = Long.parseLong(request.get("accountId").toString());
            // Auto-uppercase userId for case-insensitive lookup
            String userId = ((String) authentication.getPrincipal()).toUpperCase();
            Integer leaves = Integer.parseInt(request.get("leaves").toString());
            BigDecimal chargeAmount = new BigDecimal(request.get("chargeAmount").toString());

            @SuppressWarnings("unchecked")
            Map<String, String> address = (Map<String, String>) request.get("deliveryAddress");
            String line1 = address.get("line1");
            String line2 = address.get("line2");
            String city = address.get("city");
            String pin = address.get("pin");

            ChequeBookOrder order = chequeBookService.createOrder(
                    accountId, userId, leaves, chargeAmount,
                    line1, line2, city, pin);

            response.put("success", true);
            response.put("data", Map.of(
                    "referenceId", order.getReferenceId(),
                    "status", order.getStatus().name(),
                    "deliveryEstimate", chequeBookService.getDeliveryEstimate()));
            return ResponseEntity.ok(response);

        } catch (IllegalArgumentException e) {
            response.put("success", false);
            response.put("message", e.getMessage());
            return ResponseEntity.badRequest().body(response);
        } catch (Exception e) {
            response.put("success", false);
            response.put("message", "Failed to process order: " + e.getMessage());
            return ResponseEntity.internalServerError().body(response);
        }
    }

    /**
     * Get all orders for authenticated user
     */
    @GetMapping("/orders")
    public ResponseEntity<Map<String, Object>> getOrders(
            org.springframework.security.core.Authentication authentication) {
        Map<String, Object> response = new HashMap<>();
        String userId = (String) authentication.getPrincipal(); // Extracted from JWT

        // Auto-uppercase userId for case-insensitive lookup
        String normalizedUserId = userId.toUpperCase();

        List<ChequeBookOrder> orders = chequeBookService.getOrdersByUserId(normalizedUserId);

        response.put("success", true);
        response.put("data", orders.stream().map(order -> Map.of(
                "id", order.getId(),
                "referenceId", order.getReferenceId(),
                "accountId", order.getAccountId(),
                "leaves", order.getLeaves(),
                "status", order.getStatus().name(),
                "requestDate", order.getOrderedAt().toString(), // Mapped to requestDate for frontend
                "chargeAmount", order.getChargeAmount())).toList());

        return ResponseEntity.ok(response);
    }

    /**
     * Get single order by reference ID
     */
    @GetMapping("/order/{referenceId}")
    public ResponseEntity<Map<String, Object>> getOrder(@PathVariable String referenceId) {
        Map<String, Object> response = new HashMap<>();

        Optional<ChequeBookOrder> orderOpt = chequeBookService.getOrderByReferenceId(referenceId);

        if (orderOpt.isEmpty()) {
            response.put("success", false);
            response.put("message", "Order not found");
            return ResponseEntity.status(404).body(response);
        }

        ChequeBookOrder order = orderOpt.get();
        response.put("success", true);
        response.put("data", Map.of(
                "referenceId", order.getReferenceId(),
                "leaves", order.getLeaves(),
                "status", order.getStatus().name(),
                "orderedAt", order.getOrderedAt().toString(),
                "chargeAmount", order.getChargeAmount(),
                "deliveryAddress", Map.of(
                        "line1", order.getDeliveryAddressLine1() != null ? order.getDeliveryAddressLine1() : "",
                        "line2", order.getDeliveryAddressLine2() != null ? order.getDeliveryAddressLine2() : "",
                        "city", order.getDeliveryCity() != null ? order.getDeliveryCity() : "",
                        "pin", order.getDeliveryPin() != null ? order.getDeliveryPin() : "")));

        return ResponseEntity.ok(response);
    }
}
