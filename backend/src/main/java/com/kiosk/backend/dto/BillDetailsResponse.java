package com.kiosk.backend.dto;

import java.math.BigDecimal;

public class BillDetailsResponse {
    private BigDecimal amount;
    private String dueDate;
    private String name;
    private String billNo;

    public BillDetailsResponse() {
    }

    public BillDetailsResponse(BigDecimal amount, String dueDate, String name, String billNo) {
        this.amount = amount;
        this.dueDate = dueDate;
        this.name = name;
        this.billNo = billNo;
    }

    public BigDecimal getAmount() {
        return amount;
    }

    public void setAmount(BigDecimal amount) {
        this.amount = amount;
    }

    public String getDueDate() {
        return dueDate;
    }

    public void setDueDate(String dueDate) {
        this.dueDate = dueDate;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getBillNo() {
        return billNo;
    }

    public void setBillNo(String billNo) {
        this.billNo = billNo;
    }
}
