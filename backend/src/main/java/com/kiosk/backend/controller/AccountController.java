package com.kiosk.backend.controller;

import com.kiosk.backend.entity.Account;
import com.kiosk.backend.entity.AccountStatement;
import com.kiosk.backend.service.AccountService;
import com.kiosk.backend.repository.AccountStatementRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/v1/accounts")
@CrossOrigin(origins = "*")
public class AccountController {

    private final AccountService accountService;
    private final AccountStatementRepository statementRepository;

    public AccountController(AccountService accountService, AccountStatementRepository statementRepository) {
        this.accountService = accountService;
        this.statementRepository = statementRepository;
    }

    /**
     * Get accounts for the authenticated user
     * User ID extracted from SecurityContext (JWT)
     */
    @GetMapping
    public ResponseEntity<Map<String, Object>> getAccounts(
            org.springframework.security.core.Authentication authentication) {
        String userId = (String) authentication.getPrincipal();

        if (userId == null || userId.isBlank()) {
            return ResponseEntity.status(401).build();
        }

        // Auto-uppercase userId for case-insensitive lookup
        String normalizedId = java.util.Objects.requireNonNull(userId).toUpperCase();
        List<Account> accounts = accountService.getAccountsByUserId(java.util.Objects.requireNonNull(normalizedId));

        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("data", accounts);

        if (accounts.isEmpty()) {
            response.put("message", "No accounts found");
        } else {
            response.put("message", "Accounts fetched successfully");
        }

        return ResponseEntity.ok(response);
    }

    /**
     * Get account statement (transactions) for an account
     */
    @GetMapping("/{accountId}/statement")
    public ResponseEntity<Map<String, Object>> getAccountStatement(@PathVariable Long accountId) {
        List<AccountStatement> statements = statementRepository.findByAccountIdOrderByTxnDateDesc(accountId);

        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("data", statements);
        response.put("message", statements.isEmpty() ? "No transactions found" : "Statement fetched successfully");

        return ResponseEntity.ok(response);
    }
}
