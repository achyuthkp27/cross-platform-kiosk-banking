package com.kiosk.backend.repository;

import com.kiosk.backend.entity.Card;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CardRepository extends JpaRepository<Card, Long> {
    List<Card> findByUserId(String userId);

    List<Card> findByAccountId(Long accountId);
}
