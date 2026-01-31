package com.kiosk.backend.service;

import com.kiosk.backend.entity.Biller;
import com.kiosk.backend.entity.Transaction;
import org.springframework.stereotype.Service;
import com.kiosk.backend.repository.BillerRepository;
import com.kiosk.backend.repository.TransactionRepository;
import org.springframework.beans.factory.annotation.Autowired;

import java.math.BigDecimal;
import java.util.List;
import java.util.UUID;

@Service
public class BillPaymentService {

    private final BillerRepository billerRepository;
    private final TransactionRepository transactionRepository;
    private final AccountService accountService;
    private final BillerIntegrationService billerIntegrationService;

    public BillPaymentService(BillerRepository billerRepository, TransactionRepository transactionRepository,
            AccountService accountService, BillerIntegrationService billerIntegrationService) {
        this.billerRepository = billerRepository;
        this.transactionRepository = transactionRepository;
        this.accountService = accountService;
        this.billerIntegrationService = billerIntegrationService;
    }

    public List<String> getBillersByCategory(String category) {
        // Return names for now to match frontend expectation
        return billerRepository.findByCategory(category).stream()
                .map(Biller::getName)
                .toList();
    }

    @org.springframework.transaction.annotation.Transactional(rollbackFor = Exception.class)
    public Transaction processPayment(String billerName, BigDecimal amount, String consumerNo, String fromAccount) {
        // 1. Debit Account
        String description = "Bill Pay: " + consumerNo;
        String txnId = UUID.randomUUID().toString();

        accountService.debitAccount(fromAccount, amount, description, txnId);

        // 2. Record Transaction
        Transaction txn = new Transaction();
        txn.setId(txnId);
        txn.setType("BILL_PAYMENT");
        txn.setAmount(amount);
        txn.setStatus("SUCCESS");

        String detailsJson = String.format("{\"biller\": \"%s\", \"consumer\": \"%s\", \"fromAccount\": \"%s\"}",
                billerName, consumerNo, fromAccount);
        txn.setDetails(detailsJson);

        // 3. Call External Biller (Circuit Breaker Protected)
        String externalRef = billerIntegrationService.payExternal(consumerNo, amount);
        txn.setReferenceId(externalRef);

        return transactionRepository.save(txn);
    }
}
