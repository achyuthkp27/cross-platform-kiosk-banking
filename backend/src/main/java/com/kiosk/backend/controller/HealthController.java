package com.kiosk.backend.controller;

import com.kiosk.backend.dto.ApiResponse;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import javax.sql.DataSource;
import java.lang.management.ManagementFactory;
import java.lang.management.MemoryMXBean;
import java.lang.management.RuntimeMXBean;
import java.sql.Connection;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/v1")
@CrossOrigin(origins = "*")
public class HealthController {

    private final DataSource dataSource;

    public HealthController(DataSource dataSource) {
        this.dataSource = dataSource;
    }

    /**
     * Liveness and Readiness probe
     */
    @GetMapping("/health")
    public ApiResponse<Map<String, Object>> healthCheck() {
        Map<String, Object> status = new HashMap<>();
        status.put("status", "UP");
        status.put("timestamp", System.currentTimeMillis());

        // DB Check
        try (Connection conn = dataSource.getConnection()) {
            boolean isValid = conn.isValid(1);
            status.put("database", isValid ? "UP" : "DOWN");
        } catch (Exception e) {
            status.put("database", "DOWN");
            status.put("error", e.getMessage());
        }

        return ApiResponse.success(status);
    }

    /**
     * Basic System Metrics
     */
    @GetMapping("/metrics")
    public ApiResponse<Map<String, Object>> metrics() {
        Map<String, Object> metrics = new HashMap<>();

        // Uptime
        RuntimeMXBean runtime = ManagementFactory.getRuntimeMXBean();
        metrics.put("uptimeSeconds", runtime.getUptime() / 1000);

        // Memory
        MemoryMXBean memory = ManagementFactory.getMemoryMXBean();
        metrics.put("heapMemoryUsed", memory.getHeapMemoryUsage().getUsed());
        metrics.put("heapMemoryMax", memory.getHeapMemoryUsage().getMax());

        // Threads
        metrics.put("threadCount", ManagementFactory.getThreadMXBean().getThreadCount());

        return ApiResponse.success(metrics);
    }
}
