package com.kiosk.backend.service;

import com.kiosk.backend.entity.Customer;
import com.kiosk.backend.repository.CustomerRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

@Service
public class CustomerService {

    private final CustomerRepository customerRepository;

    public CustomerService(CustomerRepository customerRepository) {
        this.customerRepository = customerRepository;
    }

    /**
     * Get customer by userId (case-insensitive)
     */
    public Optional<Customer> getCustomerByUserId(String userId) {
        return customerRepository.findByUserIdIgnoreCase(userId);
    }

    /**
     * Update customer address
     */
    @Transactional
    public Customer updateAddress(String userId, String line1, String line2, String city, String pinCode) {
        Optional<Customer> customerOpt = customerRepository.findByUserIdIgnoreCase(userId);

        if (customerOpt.isEmpty()) {
            throw new IllegalArgumentException("Customer not found");
        }

        Customer customer = customerOpt.get();
        customer.setAddressLine1(line1);
        customer.setAddressLine2(line2);
        customer.setCity(city);
        customer.setPinCode(pinCode);

        return customerRepository.save(customer);
    }
}
