package com.kiosk.backend.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.IdClass;
import jakarta.persistence.Table;
import java.time.LocalDateTime;

@Entity
@Table(name = "used_otps")
@IdClass(UsedOtpId.class)
public class UsedOtp {

    @Id
    private String userId;

    @Id
    private Long timeWindow;

    private LocalDateTime usedAt;

    @org.hibernate.annotations.CreationTimestamp
    private LocalDateTime createdAt;

    public UsedOtp() {
    }

    public UsedOtp(String userId, Long timeWindow) {
        this.userId = userId;
        this.timeWindow = timeWindow;
        this.usedAt = LocalDateTime.now();
    }

    public String getUserId() {
        return userId;
    }

    public void setUserId(String userId) {
        this.userId = userId;
    }

    public Long getTimeWindow() {
        return timeWindow;
    }

    public void setTimeWindow(Long timeWindow) {
        this.timeWindow = timeWindow;
    }

    public LocalDateTime getUsedAt() {
        return usedAt;
    }

    public void setUsedAt(LocalDateTime usedAt) {
        this.usedAt = usedAt;
    }
}
