package com.kiosk.backend.service;

import com.kiosk.backend.entity.Transaction;
import com.kiosk.backend.repository.TransactionRepository;
import org.springframework.lang.NonNull;
import org.springframework.stereotype.Service;
import java.math.BigDecimal;
import java.util.UUID;

@Service
public class FundTransferService {

    private final TransactionRepository transactionRepository;
    private final AccountService accountService;

    public FundTransferService(TransactionRepository transactionRepository, AccountService accountService) {
        this.transactionRepository = transactionRepository;
        this.accountService = accountService;
    }

    @org.springframework.transaction.annotation.Transactional(rollbackFor = Exception.class)
    public Transaction processTransfer(String beneficiaryName, String accountNumber, String ifsc, BigDecimal amount,
            @NonNull String fromAccount) {
        // 1. Debit from Sender
        // Description: Transfer to {Name} ({Account})
        String description = String.format("Transfer to %s", beneficiaryName);
        // We use a temporary transaction ID for reference first, or generate UUID
        String txnId = UUID.randomUUID().toString();

        // This will throw exception if funds insufficient, halting the txn
        accountService.debitAccount(fromAccount, amount, description, txnId);

        // 2. Record Transaction
        Transaction txn = new Transaction();
        txn.setId(txnId);
        txn.setType("FUND_TRANSFER");
        txn.setAmount(amount);
        txn.setStatus("SUCCESS");

        // Storing recipient details in the JSON details field
        String detailsJson = String.format(
                "{\"beneficiary\": \"%s\", \"account\": \"%s\", \"ifsc\": \"%s\", \"fromAccount\": \"%s\"}",
                beneficiaryName, accountNumber, ifsc, fromAccount);
        txn.setDetails(detailsJson);

        return transactionRepository.save(txn);
    }

    public boolean validateAccount(String accountNumber, String ifsc) {
        // Mock validation logic
        // In reality, this would call a core banking API
        return accountNumber.length() >= 9 && ifsc.length() == 11;
    }
}
