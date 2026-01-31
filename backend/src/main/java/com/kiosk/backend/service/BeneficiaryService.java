package com.kiosk.backend.service;

import com.kiosk.backend.entity.Beneficiary;
import com.kiosk.backend.repository.BeneficiaryRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
public class BeneficiaryService {

    private final BeneficiaryRepository beneficiaryRepository;

    public BeneficiaryService(BeneficiaryRepository beneficiaryRepository) {
        this.beneficiaryRepository = beneficiaryRepository;
    }

    public List<Beneficiary> getBeneficiaries(String userId) {
        return beneficiaryRepository.findByUserId(userId);
    }

    @Transactional
    public Beneficiary addBeneficiary(String userId, String name, String accountNumber, String ifsc) {
        // Check if exists
        Optional<Beneficiary> existing = beneficiaryRepository.findByUserIdAndAccountNumber(userId, accountNumber);
        if (existing.isPresent()) {
            return existing.get();
        }

        Beneficiary beneficiary = new Beneficiary();
        beneficiary.setUserId(userId);
        beneficiary.setName(name);
        beneficiary.setAccountNumber(accountNumber);
        beneficiary.setIfsc(ifsc);

        return beneficiaryRepository.save(beneficiary);
    }
}
