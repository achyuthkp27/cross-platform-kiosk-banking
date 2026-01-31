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
        // Mock fetch logic (simulated determinism)
        String consumerNo = request.getConsumerNo();

        BillDetailsResponse bill = new BillDetailsResponse(
                new BigDecimal("1250"),
                "20/02/2026",
                "John API Doe",
                "BILL-" + consumerNo);

        return ApiResponse.success(bill);
    }

    @PostMapping("/pay")
    public ApiResponse<PaymentResponse> payBill(@RequestBody BillPaymentRequest request) {
        Transaction txn = service.processPayment("Unknown", request.getAmount(), request.getBillNo(),
                request.getFromAccount());

        PaymentResponse response = new PaymentResponse(txn.getId());
        return ApiResponse.success(response);
    }
}
