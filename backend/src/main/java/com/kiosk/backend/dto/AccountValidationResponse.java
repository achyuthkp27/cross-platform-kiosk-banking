package com.kiosk.backend.dto;

public class AccountValidationResponse {
    private boolean valid;
    private String name;

    public AccountValidationResponse() {
    }

    public AccountValidationResponse(boolean valid, String name) {
        this.valid = valid;
        this.name = name;
    }

    public boolean isValid() {
        return valid;
    }

    public void setValid(boolean valid) {
        this.valid = valid;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }
}
