package com.kiosk.backend.service;

import io.micrometer.core.instrument.Counter;
import io.micrometer.core.instrument.MeterRegistry;
import org.springframework.stereotype.Service;

@Service
public class SecurityMetricsService {

    private final Counter authSuccessCounter;
    private final Counter authFailureCounter;
    private final Counter tokenExpiredCounter;
    private final Counter suspiciousRequestCounter;
    private final Counter auditEventCounter;

    public SecurityMetricsService(MeterRegistry registry) {
        this.authSuccessCounter = Counter.builder("security_auth_success_total")
                .description("Total number of successful logins")
                .register(registry);

        this.authFailureCounter = Counter.builder("security_auth_failure_total")
                .description("Total number of failed login attempts")
                .register(registry);

        this.tokenExpiredCounter = Counter.builder("security_token_expired_total")
                .description("Total number of requests with expired tokens")
                .register(registry);

        this.suspiciousRequestCounter = Counter.builder("security_request_suspicious_total")
                .description("Total number of suspicious requests (401/403 spikes)")
                .register(registry);

        this.auditEventCounter = Counter.builder("security_audit_logs_total")
                .description("Total number of audit events recorded")
                .register(registry);
    }

    public void incrementAuthSuccess() {
        authSuccessCounter.increment();
    }

    public void incrementAuthFailure() {
        authFailureCounter.increment();
    }

    public void incrementTokenExpired() {
        tokenExpiredCounter.increment();
    }

    public void incrementSuspiciousRequest() {
        suspiciousRequestCounter.increment();
    }

    public void incrementAuditEvent() {
        auditEventCounter.increment();
    }
}
