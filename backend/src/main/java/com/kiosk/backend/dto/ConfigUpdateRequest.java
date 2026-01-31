package com.kiosk.backend.dto;

public class ConfigUpdateRequest {
    private String value;
    private String adminId;

    public ConfigUpdateRequest() {
    }

    public ConfigUpdateRequest(String value, String adminId) {
        this.value = value;
        this.adminId = adminId;
    }

    public String getValue() {
        return value;
    }

    public void setValue(String value) {
        this.value = value;
    }

    public String getAdminId() {
        return adminId;
    }

    public void setAdminId(String adminId) {
        this.adminId = adminId;
    }
}
