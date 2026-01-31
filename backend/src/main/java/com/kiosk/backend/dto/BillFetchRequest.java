package com.kiosk.backend.dto;

public class BillFetchRequest {
    private String consumerNo;
    private String billerId; // Optional but good practice

    public String getConsumerNo() {
        return consumerNo;
    }

    public void setConsumerNo(String consumerNo) {
        this.consumerNo = consumerNo;
    }

    public String getBillerId() {
        return billerId;
    }

    public void setBillerId(String billerId) {
        this.billerId = billerId;
    }
}
