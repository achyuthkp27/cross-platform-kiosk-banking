package com.kiosk.backend.service;

import io.github.resilience4j.circuitbreaker.annotation.CircuitBreaker;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.Random;

@Service
public class BillerIntegrationService {

    private static final Logger logger = LoggerFactory.getLogger(BillerIntegrationService.class);
    private final Random random = new Random();

    /**
     * Simulates an external API call to a Biller Aggregator.
     * Protected by Resilience4j Circuit Breaker.
     */
    @CircuitBreaker(name = "billerService", fallbackMethod = "fallbackPayExternal")
    public String payExternal(String consumerNo, BigDecimal amount) {
        // Simulate random failure (30% chance)
        if (random.nextInt(100) < 30) {
            logger.error("Simulated external failure for consumer: {}", consumerNo);
            throw new RuntimeException("External Biller Service Unavailable");
        }

        // Simulate latency
        try {
            Thread.sleep(200);
        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
        }

        logger.info("External payment successful for consumer: {}", consumerNo);
        return "EXT-" + System.currentTimeMillis();
    }

    /**
     * Fallback method called when Circuit Breaker is OPEN or call fails.
     */
    public String fallbackPayExternal(String consumerNo, BigDecimal amount, Throwable t) {
        logger.warn("Fallback triggered for consumer: {}. Reason: {}", consumerNo, t.getMessage());
        throw new RuntimeException("Service temporarily unavailable. Please try again later.");
    }
}
