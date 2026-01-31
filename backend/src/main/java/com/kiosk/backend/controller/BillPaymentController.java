package com.kiosk.backend.controller;

import com.kiosk.backend.dto.ApiResponse;
import com.kiosk.backend.dto.BillDetailsResponse;
import com.kiosk.backend.dto.BillFetchRequest;
import com.kiosk.backend.dto.BillPaymentRequest;
import com.kiosk.backend.dto.PaymentResponse;
import com.kiosk.backend.service.BillPaymentService;
import com.kiosk.backend.entity.Transaction;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.math.BigDecimal;

@RestController
@RequestMapping("/v1/bill-payment")
@CrossOrigin(origins = "*")
public class BillPaymentController {

    private final BillPaymentService service;

    public BillPaymentController(BillPaymentService service) {
        this.service = service;
    }

    @GetMapping("/billers/{category}")
    public ApiResponse<List<String>> getBillers(@PathVariable String category) {
        List<String> billers = service.getBillersByCategory(category);
        return ApiResponse.success(billers);
    }

    @PostMapping("/fetch")
    public ApiResponse<BillDetailsResponse> fetchBill(@RequestBody BillFetchRequest request) {
        String consumerNo = request.getConsumerNo();
        System.out.println("[DEBUG] Fetching Bill for: " + consumerNo);

        // Generate semi-random deterministic data based on consumer number
        int hash = consumerNo.hashCode();
        BigDecimal amount = new BigDecimal(1000 + (Math.abs(hash) % 5000));
        String name = (Math.abs(hash) % 2 == 0) ? "Alex Customer" : "Sam Billing";
        String dueDate = "28/02/2026";

        BillDetailsResponse bill = new BillDetailsResponse(
                amount,
                dueDate,
                name,
                "BILL-" + consumerNo);

        return ApiResponse.success(bill);
    }

    @PostMapping("/pay")
    public ApiResponse<PaymentResponse> payBill(@RequestBody BillPaymentRequest request) {
        System.out.println("[DEBUG] Processing Bill Payment: " + request.getBillNo() + " from "
                + request.getFromAccount() + " Amount: " + request.getAmount());
        String fromAccount = request.getFromAccount();
        if (fromAccount == null) {
            return ApiResponse.error("Source account is required");
        }

        try {
            Transaction txn = service.processPayment(
                    request.getBillerName() != null ? request.getBillerName() : "Unknown",
                    request.getAmount(),
                    request.getBillNo(),
                    fromAccount);

            System.out.println("[DEBUG] Bill Payment Success: " + txn.getId());
            PaymentResponse response = new PaymentResponse(txn.getId());
            return ApiResponse.success(response);
        } catch (IllegalArgumentException e) {
            System.err.println("[DEBUG] Bill Payment Validation Error: " + e.getMessage());
            return ApiResponse.error(e.getMessage());
        } catch (Exception e) {
            System.err.println("[DEBUG] Bill Payment System Error: " + e.getMessage());
            e.printStackTrace();
            return ApiResponse.error("Payment failed: " + e.getMessage());
        }
    }
}
