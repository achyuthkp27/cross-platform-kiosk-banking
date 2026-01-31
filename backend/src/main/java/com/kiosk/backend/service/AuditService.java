package com.kiosk.backend.service;

import com.kiosk.backend.entity.AuditLog;
import com.kiosk.backend.repository.AuditLogRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;

@Service
public class AuditService {

    private final AuditLogRepository auditLogRepository;
    private final SecurityMetricsService metricsService;

    public AuditService(AuditLogRepository auditLogRepository, SecurityMetricsService metricsService) {
        this.auditLogRepository = auditLogRepository;
        this.metricsService = metricsService;
    }

    /**
     * Log an audit event
     */
    public AuditLog log(String action, String actorType, String actorId,
            String targetType, String targetId, String details, String ipAddress) {
        AuditLog log = new AuditLog();
        log.setAction(action);
        log.setActorType(actorType);
        log.setActorId(actorId);
        log.setTargetType(targetType);
        log.setTargetId(targetId);
        log.setDetails(details);
        log.setIpAddress(ipAddress);

        metricsService.incrementAuditEvent();
        return auditLogRepository.save(log);
    }

    /**
     * Convenience method for customer actions
     */
    public AuditLog logCustomerAction(String action, String customerId, String details) {
        return log(action, "CUSTOMER", customerId, null, null, details, null);
    }

    /**
     * Convenience method for admin actions
     */
    public AuditLog logAdminAction(String action, String adminId, String targetType, String targetId, String details) {
        return log(action, "ADMIN", adminId, targetType, targetId, details, null);
    }

    /**
     * Convenience method for system actions
     */
    public AuditLog logSystemAction(String action, String details) {
        return log(action, "SYSTEM", null, null, null, details, null);
    }

    /**
     * Get recent audit logs
     */
    public Page<AuditLog> getRecentLogs(int page, int size) {
        return auditLogRepository.findAllByOrderByCreatedAtDesc(PageRequest.of(page, size));
    }

    /**
     * Get logs by actor type
     */
    public Page<AuditLog> getLogsByActorType(String actorType, int page, int size) {
        return auditLogRepository.findByActorTypeOrderByCreatedAtDesc(actorType, PageRequest.of(page, size));
    }
}
