package com.kiosk.backend.controller;

import com.kiosk.backend.entity.AuditLog;
import com.kiosk.backend.service.AuditService;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/v1/audit")
@CrossOrigin(origins = "*")
public class AuditController {

    private final AuditService auditService;

    public AuditController(AuditService auditService) {
        this.auditService = auditService;
    }

    /**
     * Log an audit event from frontend
     */
    @PostMapping("/log")
    public ResponseEntity<Map<String, Object>> logEvent(@RequestBody Map<String, String> body) {
        String action = body.get("action");
        String actorType = body.getOrDefault("actorType", "CUSTOMER");
        String actorId = body.get("actorId");
        String targetType = body.get("targetType");
        String targetId = body.get("targetId");
        String details = body.get("details");
        String ipAddress = body.get("ipAddress");

        if (action == null) {
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("message", "Action is required");
            return ResponseEntity.badRequest().body(response);
        }

        AuditLog log = auditService.log(action, actorType, actorId, targetType, targetId, details, ipAddress);

        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("id", log.getId());
        return ResponseEntity.ok(response);
    }

    /**
     * Get recent audit logs
     */
    @GetMapping("/logs")
    public ResponseEntity<Map<String, Object>> getLogs(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "50") int size,
            @RequestParam(required = false) String actorType) {

        Page<AuditLog> logs;
        if (actorType != null) {
            logs = auditService.getLogsByActorType(actorType, page, size);
        } else {
            logs = auditService.getRecentLogs(page, size);
        }

        List<Map<String, Object>> logList = logs.getContent().stream()
                .map(this::mapLog)
                .collect(Collectors.toList());

        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("data", logList);
        response.put("page", page);
        response.put("size", size);
        response.put("totalElements", logs.getTotalElements());
        response.put("totalPages", logs.getTotalPages());

        return ResponseEntity.ok(response);
    }

    private Map<String, Object> mapLog(AuditLog log) {
        Map<String, Object> map = new HashMap<>();
        map.put("id", log.getId());
        map.put("action", log.getAction());
        map.put("actorType", log.getActorType());
        map.put("actorId", log.getActorId());
        map.put("targetType", log.getTargetType());
        map.put("targetId", log.getTargetId());
        map.put("details", log.getDetails());
        map.put("timestamp", log.getCreatedAt());
        return map;
    }
}
