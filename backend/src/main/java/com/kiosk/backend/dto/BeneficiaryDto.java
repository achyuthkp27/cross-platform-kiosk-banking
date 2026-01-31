package com.kiosk.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class BeneficiaryDto {
    private String name;
    private String accountNumber;
    private String ifsc;
}
