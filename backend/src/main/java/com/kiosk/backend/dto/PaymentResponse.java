package com.kiosk.backend.dto;

public class PaymentResponse {
    private String txnId;

    public PaymentResponse() {
    }

    public PaymentResponse(String txnId) {
        this.txnId = txnId;
    }

    public String getTxnId() {
        return txnId;
    }

    public void setTxnId(String txnId) {
        this.txnId = txnId;
    }
}
