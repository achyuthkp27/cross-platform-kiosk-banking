package com.kiosk.backend.repository;

import com.kiosk.backend.entity.Beneficiary;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface BeneficiaryRepository extends JpaRepository<Beneficiary, Long> {
    List<Beneficiary> findByUserId(String userId);

    Optional<Beneficiary> findByUserIdAndAccountNumber(String userId, String accountNumber);
}
