package com.kiosk.backend.service;

import com.kiosk.backend.entity.Account;
import com.kiosk.backend.entity.Customer;
import com.kiosk.backend.entity.AccountStatement;
import com.kiosk.backend.repository.AccountRepository;
import com.kiosk.backend.repository.AccountStatementRepository;
import com.kiosk.backend.repository.CustomerRepository;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.Collections;
import java.util.List;
import java.util.Optional;

@Service
public class AccountService {

    private final AccountRepository accountRepository;
    private final CustomerRepository customerRepository;
    private final AccountStatementRepository statementRepository;

    public AccountService(AccountRepository accountRepository, CustomerRepository customerRepository,
            AccountStatementRepository statementRepository) {
        this.accountRepository = accountRepository;
        this.customerRepository = customerRepository;
        this.statementRepository = statementRepository;
    }

    /**
     * Get all accounts for a user by their User ID (e.g. DEMO001)
     */
    public List<Account> getAccountsByUserId(String userId) {
        Optional<Customer> customerOpt = customerRepository.findByUserId(userId);

        if (customerOpt.isEmpty()) {
            return Collections.emptyList();
        }

        return accountRepository.findByCustomerId(customerOpt.get().getId());
    }

    /**
     * Get account by account number
     */
    public Optional<Account> getAccountByNumber(String accountNumber) {
        return accountRepository.findByAccountNumber(accountNumber);
    }

    /**
     * Debit an account and create a statement entry
     * Returns updated Account or throws exception
     */
    public Account debitAccount(String accountNumber, BigDecimal amount, String description, String referenceId) {
        Optional<Account> accountOpt = accountRepository.findByAccountNumber(accountNumber);

        if (accountOpt.isEmpty()) {
            throw new IllegalArgumentException("Invalid account number");
        }

        Account account = accountOpt.get();

        if (account.getAvailableBalance().compareTo(amount) < 0) {
            throw new IllegalArgumentException("Insufficient funds");
        }

        // Deduct balance
        account.setBalance(account.getBalance().subtract(amount));
        account.setAvailableBalance(account.getAvailableBalance().subtract(amount));
        accountRepository.save(account);

        // Create Statement Entry
        AccountStatement statement = new AccountStatement();
        statement.setAccountId(account.getId());
        statement.setTxnType("DEBIT");
        statement.setAmount(amount);
        statement.setBalanceAfter(account.getAvailableBalance());
        statement.setDescription(description);
        statement.setReferenceId(referenceId);
        statementRepository.save(statement);

        return account;
    }
}
