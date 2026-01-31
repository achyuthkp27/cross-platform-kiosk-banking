package com.kiosk.backend.service;

import com.kiosk.backend.entity.Customer;
import com.kiosk.backend.repository.CustomerRepository;

import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.lang.NonNull;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class AuthService {

    private final CustomerRepository customerRepository;
    private final BCryptPasswordEncoder passwordEncoder;

    public AuthService(CustomerRepository customerRepository) {
        this.customerRepository = customerRepository;
        this.passwordEncoder = new BCryptPasswordEncoder();
    }

    /**
     * Authenticate customer using User ID and DOB
     * 
     * @return Customer if valid, empty if invalid
     */
    public Optional<Customer> authenticateCustomer(@NonNull String userId, String dob) {
        Optional<Customer> customerOpt = customerRepository.findByUserIdIgnoreCase(userId);

        if (customerOpt.isEmpty()) {
            return Optional.empty();
        }

        Customer customer = customerOpt.get();

        // Check if customer is active
        if (!"ACTIVE".equals(customer.getStatus())) {
            return Optional.empty();
        }

        // Validate DOB hash
        // For MVP, we do simple comparison. In production, use proper hashing.
        // Note: The stored hash should be created with the same encoding.
        if (passwordEncoder.matches(dob, customer.getDobHash())) {
            return Optional.of(customer);
        }

        // DEV MODE: Fallback for demo/development - check if DOB matches plaintext
        // patterns
        // This allows testing with dummy hash data. Remove in production!
        String storedHash = customer.getDobHash();
        if (storedHash != null && storedHash.contains("dummyhash")) {
            // Check various DOB formats against the dummy hash pattern
            // Expected: dob=01/01/1990, hash contains "01011990"
            String normalizedDob = dob.replace("/", "");
            if (storedHash.toLowerCase().contains(normalizedDob.toLowerCase())) {
                System.out.println("[DEV] Demo login accepted for user: " + userId);
                return Optional.of(customer);
            }
        }

        return Optional.empty();
    }

    /**
     * Validate customer PIN for transactions
     */
    public boolean validatePin(@NonNull String userId, String pin) {
        Optional<Customer> customerOpt = customerRepository.findByUserId(userId);

        if (customerOpt.isEmpty()) {
            return false;
        }

        Customer customer = customerOpt.get();

        // Check BCrypt match first
        if (passwordEncoder.matches(pin, customer.getPinHash())) {
            return true;
        }

        // DEV MODE: Fallback for demo/development - check if PIN matches dummy pattern
        // This allows testing with dummy hash data. Remove in production!
        String storedHash = customer.getPinHash();
        if (storedHash != null && storedHash.contains("dummyhash")) {
            // Check if stored hash contains the PIN (e.g., "dummyhashforpin1234" contains
            // "1234")
            if (storedHash.toLowerCase().contains(pin.toLowerCase())) {
                System.out.println("[DEV] Demo PIN accepted for user: " + userId);
                return true;
            }
        }

        return false;
    }

    /**
     * Change customer PIN
     */
    public boolean changePin(@NonNull String userId, String oldPin, String newPin) {
        Optional<Customer> customerOpt = customerRepository.findByUserId(userId);

        if (customerOpt.isEmpty()) {
            return false;
        }

        Customer customer = customerOpt.get();

        // Validate old PIN
        if (!passwordEncoder.matches(oldPin, customer.getPinHash())) {
            return false;
        }

        // Set new PIN
        customer.setPinHash(passwordEncoder.encode(newPin));
        customerRepository.save(customer);
        return true;
    }

    /**
     * Get customer by user ID
     */
    public Optional<Customer> getCustomer(@NonNull String userId) {
        return customerRepository.findByUserId(userId);
    }

    /**
     * Update customer preferences
     */
    public void updatePreferences(@NonNull String userId, String language, String theme) {
        customerRepository.findByUserId(userId).ifPresent(customer -> {
            if (language != null)
                customer.setLanguagePref(language);
            if (theme != null)
                customer.setThemePref(theme);
            customerRepository.save(java.util.Objects.requireNonNull(customer));
        });
    }
}
