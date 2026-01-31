package com.kiosk.backend.controller;

import com.kiosk.backend.dto.AccountValidationRequest;
import com.kiosk.backend.dto.AccountValidationResponse;
import com.kiosk.backend.dto.ApiResponse;
import com.kiosk.backend.dto.FundTransferRequest;
import com.kiosk.backend.dto.TransferResponse;
import com.kiosk.backend.service.FundTransferService;
import com.kiosk.backend.entity.Transaction;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/v1/fund-transfer")
@CrossOrigin(origins = "*")
public class FundTransferController {

    private final FundTransferService service;

    public FundTransferController(FundTransferService service) {
        this.service = service;
    }

    @PostMapping("/validate")
    public ApiResponse<AccountValidationResponse> validateAccount(@RequestBody AccountValidationRequest request) {
        boolean isValid = service.validateAccount(request.getAccountNumber(), request.getIfsc());

        if (isValid) {
            AccountValidationResponse data = new AccountValidationResponse(true, "Verified User");
            return ApiResponse.success(data, "Account Verified");
        } else {
            return ApiResponse.success(new AccountValidationResponse(false, null), "Invalid Account/IFSC");
        }
    }

    @PostMapping("/process")
    public ApiResponse<TransferResponse> processTransfer(@RequestBody FundTransferRequest request) {
        String fromAccount = request.getFromAccount();
        if (fromAccount == null) {
            return ApiResponse.error("Source account is required");
        }

        Transaction txn = service.processTransfer(
                request.getBeneficiaryName(),
                request.getAccountNumber(),
                request.getIfsc(),
                request.getAmount(),
                fromAccount);

        TransferResponse data = new TransferResponse(txn.getId(), txn.getStatus());
        return ApiResponse.success(data);
    }
}
