package com.kiosk.backend.service;

import com.kiosk.backend.entity.Account;
import com.kiosk.backend.entity.ChequeBookOrder;
import com.kiosk.backend.entity.ChequeBookOrder.OrderStatus;
import com.kiosk.backend.repository.AccountRepository;
import com.kiosk.backend.repository.ChequeBookOrderRepository;
import org.springframework.lang.NonNull;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;
import java.util.Objects;
import java.util.Optional;
import java.util.UUID;

@Service
public class ChequeBookService {

    private final ChequeBookOrderRepository orderRepository;
    private final AccountRepository accountRepository;
    private final AccountService accountService;

    public ChequeBookService(ChequeBookOrderRepository orderRepository,
            AccountRepository accountRepository,
            AccountService accountService) {
        this.orderRepository = orderRepository;
        this.accountRepository = accountRepository;
        this.accountService = accountService;
    }

    /**
     * Create a cheque book order, debit the charge from the account, and persist
     */
    @Transactional
    public ChequeBookOrder createOrder(@NonNull Long accountId, String userId, Integer leaves,
            BigDecimal chargeAmount,
            String addressLine1, String addressLine2,
            String city, String pin) {
        // Validate account exists
        Optional<Account> accountOpt = accountRepository.findById(accountId);
        if (accountOpt.isEmpty()) {
            throw new IllegalArgumentException("Invalid account ID");
        }

        Account account = accountOpt.get();
        String referenceId = "CHQ" + UUID.randomUUID().toString().substring(0, 8).toUpperCase();

        // Debit the charge from the account
        accountService.debitAccount(
                Objects.requireNonNull(account.getAccountNumber()),
                chargeAmount,
                "Cheque Book Order - " + leaves + " Leaves",
                referenceId);

        // Create and save the order
        ChequeBookOrder order = new ChequeBookOrder();
        order.setAccountId(accountId);
        order.setUserId(userId);
        order.setLeaves(leaves);
        order.setChargeAmount(chargeAmount);
        order.setReferenceId(referenceId);
        order.setStatus(OrderStatus.ORDERED);
        order.setDeliveryAddressLine1(addressLine1);
        order.setDeliveryAddressLine2(addressLine2);
        order.setDeliveryCity(city);
        order.setDeliveryPin(pin);

        return orderRepository.save(order);
    }

    /**
     * Get all orders for a user
     */
    public List<ChequeBookOrder> getOrdersByUserId(String userId) {
        return orderRepository.findByUserIdOrderByOrderedAtDesc(userId);
    }

    /**
     * Get order by reference ID
     */
    public Optional<ChequeBookOrder> getOrderByReferenceId(String referenceId) {
        return orderRepository.findByReferenceId(referenceId);
    }

    /**
     * Calculate estimated delivery date (1 day from order)
     */
    public String getDeliveryEstimate() {
        return "1-2 Business Days";
    }
}
