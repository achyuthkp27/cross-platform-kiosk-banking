package com.kiosk.backend.dto;

public class EncryptionRequest {
    private String iv;
    private String salt;
    private String ciphertext;
    private String aad;

    public EncryptionRequest() {
    }

    public EncryptionRequest(String iv, String salt, String ciphertext, String aad) {
        this.iv = iv;
        this.salt = salt;
        this.ciphertext = ciphertext;
        this.aad = aad;
    }

    public String getIv() {
        return iv;
    }

    public void setIv(String iv) {
        this.iv = iv;
    }

    public String getSalt() {
        return salt;
    }

    public void setSalt(String salt) {
        this.salt = salt;
    }

    public String getCiphertext() {
        return ciphertext;
    }

    public void setCiphertext(String ciphertext) {
        this.ciphertext = ciphertext;
    }

    public String getAad() {
        return aad;
    }

    public void setAad(String aad) {
        this.aad = aad;
    }
}
