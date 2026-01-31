package com.kiosk.backend.repository;

import com.kiosk.backend.entity.OtpAttempt;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface OtpAttemptRepository extends JpaRepository<OtpAttempt, String> {
}
