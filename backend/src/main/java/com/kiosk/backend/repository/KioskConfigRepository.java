package com.kiosk.backend.repository;

import com.kiosk.backend.entity.KioskConfig;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;

@Repository
public interface KioskConfigRepository extends JpaRepository<KioskConfig, Long> {
    Optional<KioskConfig> findByConfigKey(String configKey);
}
