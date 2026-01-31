package com.kiosk.backend.dto;

public class OtpConfigResponse {
    private int expirySeconds;
    private int maxAttempts;

    public OtpConfigResponse() {
    }

    public OtpConfigResponse(int expirySeconds, int maxAttempts) {
        this.expirySeconds = expirySeconds;
        this.maxAttempts = maxAttempts;
    }

    public int getExpirySeconds() {
        return expirySeconds;
    }

    public void setExpirySeconds(int expirySeconds) {
        this.expirySeconds = expirySeconds;
    }

    public int getMaxAttempts() {
        return maxAttempts;
    }

    public void setMaxAttempts(int maxAttempts) {
        this.maxAttempts = maxAttempts;
    }
}
