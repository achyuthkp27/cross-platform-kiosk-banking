package com.kiosk.backend.config;

import com.kiosk.backend.entity.Account;
import com.kiosk.backend.entity.Card;
import com.kiosk.backend.entity.Customer;
import com.kiosk.backend.repository.AccountRepository;
import com.kiosk.backend.repository.CardRepository;
import com.kiosk.backend.repository.CustomerRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.Optional;

@Configuration
public class DataInitializer {

    @Bean
    CommandLineRunner initData(
            CustomerRepository customerRepository,
            AccountRepository accountRepository,
            CardRepository cardRepository) {
        return args -> {
            String userId = "DEMO001";

            // 1. Ensure Customer exists
            Optional<Customer> customerOpt = customerRepository.findByUserId(userId);
            Customer customer;
            if (customerOpt.isEmpty()) {
                customer = new Customer();
                customer.setUserId(userId);
                customer.setName("Demo User");
                customer.setDobHash("01/01/1990"); // Placeholder
                customer.setPinHash("$2a$10$SomethingFor1234");
                customer.setMobileNumber("9876543210");
                customer.setEmail("demo@example.com");
                customer = customerRepository.save(customer);
                System.out.println("[INIT] Created customer " + userId);
            } else {
                customer = customerOpt.get();
            }

            // 2. Ensure Accounts exist
            String acc1Num = "1000000001";
            Optional<Account> acc1Opt = accountRepository.findByAccountNumber(acc1Num);
            Account acc1;
            if (acc1Opt.isEmpty()) {
                acc1 = new Account();
                acc1.setCustomerId(customer.getId());
                acc1.setAccountNumber(acc1Num);
                acc1.setBalance(new BigDecimal("50000.00"));
                acc1.setAvailableBalance(new BigDecimal("48500.00"));
                acc1.setType("SAVINGS");
                acc1 = accountRepository.save(acc1);
                System.out.println("[INIT] Created account " + acc1Num);
            } else {
                acc1 = acc1Opt.get();
            }

            String acc2Num = "2000000001";
            Optional<Account> acc2Opt = accountRepository.findByAccountNumber(acc2Num);
            Account acc2;
            if (acc2Opt.isEmpty()) {
                acc2 = new Account();
                acc2.setCustomerId(customer.getId());
                acc2.setAccountNumber(acc2Num);
                acc2.setBalance(new BigDecimal("150000.00"));
                acc2.setAvailableBalance(new BigDecimal("150000.00"));
                acc2.setType("CURRENT");
                acc2 = accountRepository.save(acc2);
                System.out.println("[INIT] Created account " + acc2Num);
            } else {
                acc2 = acc2Opt.get();
            }

            // 3. Ensure Cards exist
            String card1Num = "4532789012348890";
            if (cardRepository.findByUserId(userId).stream().noneMatch(c -> c.getNumber().equals(card1Num))) {
                Card card1 = new Card();
                card1.setUserId(userId);
                card1.setAccountId(acc1.getId());
                card1.setNumber(card1Num);
                card1.setCvv("123");
                card1.setPin("1234");
                card1.setType("DEBIT");
                card1.setExpiryDate(LocalDate.now().plusYears(4));
                cardRepository.save(card1);
                System.out.println("[INIT] Created card " + card1Num);
            }

            String card2Num = "5412789012343456";
            if (cardRepository.findByUserId(userId).stream().noneMatch(c -> c.getNumber().equals(card2Num))) {
                Card card2 = new Card();
                card2.setUserId(userId);
                card2.setAccountId(acc2.getId());
                card2.setNumber(card2Num);
                card2.setCvv("456");
                card2.setPin("4321");
                card2.setType("CREDIT");
                card2.setExpiryDate(LocalDate.now().plusYears(3));
                cardRepository.save(card2);
                System.out.println("[INIT] Created card " + card2Num);
            }
        };
    }
}
