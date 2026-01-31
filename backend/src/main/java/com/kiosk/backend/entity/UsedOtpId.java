package com.kiosk.backend.entity;

import java.io.Serializable;
import java.util.Objects;

public class UsedOtpId implements Serializable {
    private String userId;
    private Long timeWindow;

    public UsedOtpId() {
    }

    public UsedOtpId(String userId, Long timeWindow) {
        this.userId = userId;
        this.timeWindow = timeWindow;
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

    @Override
    public boolean equals(Object o) {
        if (this == o)
            return true;
        if (o == null || getClass() != o.getClass())
            return false;
        UsedOtpId usedOtpId = (UsedOtpId) o;
        return Objects.equals(userId, usedOtpId.userId) && Objects.equals(timeWindow, usedOtpId.timeWindow);
    }

    @Override
    public int hashCode() {
        return Objects.hash(userId, timeWindow);
    }
}
