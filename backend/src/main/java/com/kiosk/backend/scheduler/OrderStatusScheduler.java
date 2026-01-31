package com.kiosk.backend.scheduler;

import com.kiosk.backend.entity.ChequeBookOrder;
import com.kiosk.backend.entity.ChequeBookOrder.OrderStatus;
import com.kiosk.backend.repository.ChequeBookOrderRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

/**
 * Scheduler to automatically update cheque book order statuses:
 * - ORDERED → DISPATCHED after 12 hours (0.5 days)
 * - DISPATCHED → DELIVERED after 24 hours (1 day from order)
 */
@Component
public class OrderStatusScheduler {

    private static final Logger logger = LoggerFactory.getLogger(OrderStatusScheduler.class);

    private final ChequeBookOrderRepository orderRepository;

    public OrderStatusScheduler(ChequeBookOrderRepository orderRepository) {
        this.orderRepository = orderRepository;
    }

    /**
     * Run every 30 minutes to check for status updates
     */
    @Scheduled(fixedRate = 1800000) // 30 minutes in ms
    @Transactional
    public void updateOrderStatuses() {
        logger.info("Running order status scheduler...");

        LocalDateTime now = LocalDateTime.now();

        // Update ORDERED → DISPATCHED (after 12 hours)
        LocalDateTime dispatchThreshold = now.minusHours(12);
        List<ChequeBookOrder> ordersToDispatch = orderRepository
                .findByStatusAndOrderedAtBefore(OrderStatus.ORDERED, dispatchThreshold);

        for (ChequeBookOrder order : ordersToDispatch) {
            order.setStatus(OrderStatus.DISPATCHED);
            order.setDispatchedAt(now);
            orderRepository.save(order);
            logger.info("Order {} dispatched", order.getReferenceId());
        }

        // Update DISPATCHED → DELIVERED (after 12 hours from dispatch = 24 hours from
        // order)
        LocalDateTime deliverThreshold = now.minusHours(12);
        List<ChequeBookOrder> ordersToDeliver = orderRepository
                .findByStatusAndDispatchedAtBefore(OrderStatus.DISPATCHED, deliverThreshold);

        for (ChequeBookOrder order : ordersToDeliver) {
            order.setStatus(OrderStatus.DELIVERED);
            order.setDeliveredAt(now);
            orderRepository.save(order);
            logger.info("Order {} delivered", order.getReferenceId());
        }

        logger.info("Order status scheduler complete. Dispatched: {}, Delivered: {}",
                ordersToDispatch.size(), ordersToDeliver.size());
    }
}
