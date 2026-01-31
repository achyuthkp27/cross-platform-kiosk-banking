package com.kiosk.backend.repository;

import com.kiosk.backend.entity.ChequeBookOrder;
import com.kiosk.backend.entity.ChequeBookOrder.OrderStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface ChequeBookOrderRepository extends JpaRepository<ChequeBookOrder, Long> {

    List<ChequeBookOrder> findByUserIdOrderByOrderedAtDesc(String userId);

    Optional<ChequeBookOrder> findByReferenceId(String referenceId);

    List<ChequeBookOrder> findByStatus(OrderStatus status);

    // For scheduler: find orders that need status update
    List<ChequeBookOrder> findByStatusAndOrderedAtBefore(OrderStatus status, LocalDateTime before);

    List<ChequeBookOrder> findByStatusAndDispatchedAtBefore(OrderStatus status, LocalDateTime before);
}
