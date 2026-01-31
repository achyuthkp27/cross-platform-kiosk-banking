package com.kiosk.backend.dto;

public class TransferResponse {
    private String txnId;
    private String status;

    public TransferResponse() {
    }

    public TransferResponse(String txnId, String status) {
        this.txnId = txnId;
        this.status = status;
    }

    public String getTxnId() {
        return txnId;
    }

    public void setTxnId(String txnId) {
        this.txnId = txnId;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }
}
