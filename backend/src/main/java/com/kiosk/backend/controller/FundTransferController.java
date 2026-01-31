package com.kiosk.backend.controller;

import com.kiosk.backend.dto.AccountValidationRequest;
import com.kiosk.backend.dto.AccountValidationResponse;
import com.kiosk.backend.dto.ApiResponse;
import com.kiosk.backend.dto.FundTransferRequest;
import com.kiosk.backend.dto.TransferResponse;
import com.kiosk.backend.dto.BeneficiaryDto;
import com.kiosk.backend.service.FundTransferService;
import com.kiosk.backend.service.BeneficiaryService;
import com.kiosk.backend.entity.Transaction;
import com.kiosk.backend.entity.Beneficiary;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/v1/fund-transfer")
@CrossOrigin(origins = "*")
public class FundTransferController {

    private final FundTransferService service;
    private final BeneficiaryService beneficiaryService;

    public FundTransferController(FundTransferService service, BeneficiaryService beneficiaryService) {
        this.service = service;
        this.beneficiaryService = beneficiaryService;
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
        System.out.println("[DEBUG] Processing Transfer: " + request.getFromAccount() + " -> "
                + request.getAccountNumber() + " Amount: " + request.getAmount());
        String fromAccount = request.getFromAccount();
        if (fromAccount == null) {
            return ApiResponse.error("Source account is required");
        }

        try {
            Transaction txn = service.processTransfer(
                    request.getBeneficiaryName(),
                    request.getAccountNumber(),
                    request.getIfsc(),
                    request.getAmount(),
                    fromAccount);

            System.out.println("[DEBUG] Transfer Success: " + txn.getId());
            TransferResponse data = new TransferResponse(txn.getId(), txn.getStatus());
            return ApiResponse.success(data);
        } catch (IllegalArgumentException e) {
            System.err.println("[DEBUG] Transfer Validations Error: " + e.getMessage());
            return ApiResponse.error(e.getMessage());
        } catch (Exception e) {
            System.err.println("[DEBUG] Transfer System Error: " + e.getMessage());
            e.printStackTrace();
            return ApiResponse.error("Transfer failed: " + e.getMessage());
        }
    }

    @GetMapping("/beneficiaries")
    public ApiResponse<java.util.List<Beneficiary>> getBeneficiaries() {
        String userId = org.springframework.security.core.context.SecurityContextHolder.getContext()
                .getAuthentication().getName();
        return ApiResponse.success(beneficiaryService.getBeneficiaries(userId), "Beneficiaries fetched");
    }

    @PostMapping("/beneficiaries")
    public ApiResponse<Beneficiary> addBeneficiary(@RequestBody BeneficiaryDto request) {
        String userId = org.springframework.security.core.context.SecurityContextHolder.getContext()
                .getAuthentication().getName();
        try {
            Beneficiary beneficiary = beneficiaryService.addBeneficiary(
                    userId,
                    request.getName(),
                    request.getAccountNumber(),
                    request.getIfsc());
            return ApiResponse.success(beneficiary, "Beneficiary added");
        } catch (Exception e) {
            return ApiResponse.error("Failed to add beneficiary: " + e.getMessage());
        }
    }
}
