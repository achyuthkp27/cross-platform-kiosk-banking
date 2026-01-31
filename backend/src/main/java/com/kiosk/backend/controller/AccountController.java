package com.kiosk.backend.controller;

import com.kiosk.backend.entity.Account;
import com.kiosk.backend.service.AccountService;
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

    public AccountController(AccountService accountService) {
        this.accountService = accountService;
    }

    /**
     * Get accounts for a customer by User ID (e.g. DEMO001)
     */
    @GetMapping
    public ResponseEntity<Map<String, Object>> getAccounts(@RequestParam String customerId) {
        if (customerId == null) {
            return ResponseEntity.badRequest().build();
        }
        List<Account> accounts = accountService.getAccountsByUserId(customerId);

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
}
