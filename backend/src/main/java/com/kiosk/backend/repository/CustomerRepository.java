package com.kiosk.backend.repository;

import com.kiosk.backend.entity.Customer;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;

@Repository
public interface CustomerRepository extends JpaRepository<Customer, Long> {
    // Case-insensitive lookup for userId
    Optional<Customer> findByUserIdIgnoreCase(String userId);

    boolean existsByUserIdIgnoreCase(String userId);

    // Keep original for internal use if needed
    Optional<Customer> findByUserId(String userId);

    boolean existsByUserId(String userId);
}
