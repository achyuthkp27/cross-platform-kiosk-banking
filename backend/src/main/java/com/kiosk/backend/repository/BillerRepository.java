package com.kiosk.backend.repository;

import com.kiosk.backend.entity.Biller;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface BillerRepository extends JpaRepository<Biller, String> {
    List<Biller> findByCategory(String category);
}
