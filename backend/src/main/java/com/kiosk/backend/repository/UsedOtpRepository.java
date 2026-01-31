package com.kiosk.backend.repository;

import com.kiosk.backend.entity.UsedOtp;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface UsedOtpRepository extends JpaRepository<UsedOtp, com.kiosk.backend.entity.UsedOtpId> {
}
