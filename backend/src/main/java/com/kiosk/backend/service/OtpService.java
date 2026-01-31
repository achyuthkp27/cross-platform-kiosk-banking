package com.kiosk.backend.service;

import com.kiosk.backend.entity.OtpAttempt;
import com.kiosk.backend.entity.OtpRecord;
import com.kiosk.backend.entity.UsedOtp;
import com.kiosk.backend.repository.OtpAttemptRepository;
import com.kiosk.backend.repository.OtpRecordRepository;
import com.kiosk.backend.repository.UsedOtpRepository;
import com.kiosk.backend.util.TotpUtility;
import org.apache.commons.codec.binary.Base32;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.security.SecureRandom;
import java.time.LocalDateTime;
import java.util.Optional;

@Service
public class OtpService {

    private final OtpRecordRepository otpRecordRepository;
    private final UsedOtpRepository usedOtpRepository;
    private final OtpAttemptRepository otpAttemptRepository;
    private final ConfigService configService;
    private final SecureRandom secureRandom = new SecureRandom();

    private static final int VALIDATION_WINDOW = 1; // +/- 1 window (30s)
    private static final int MAX_FAILED_ATTEMPTS = 3;
    private static final int LOCKOUT_MINUTES = 15;

    public OtpService(OtpRecordRepository otpRecordRepository,
            UsedOtpRepository usedOtpRepository,
            OtpAttemptRepository otpAttemptRepository,
            ConfigService configService) {
        this.otpRecordRepository = otpRecordRepository;
        this.usedOtpRepository = usedOtpRepository;
        this.otpAttemptRepository = otpAttemptRepository;
        this.configService = configService;
    }

    /**
     * Generate and store a new OTP using TOTP (Time-based One-Time Password)
     */
    @Transactional
    public String generateOtp(String identifier, String purpose) {
        // Generate a random Base32 secret for this OTP session
        byte[] secretBytes = new byte[20]; // 160 bits for HMAC-SHA256 recommended (min 128)
        secureRandom.nextBytes(secretBytes);
        Base32 base32 = new Base32();
        String secret = base32.encodeToString(secretBytes);

        String otp;
        try {
            otp = TotpUtility.generateNow(secret);
        } catch (Exception e) {
            throw new RuntimeException("Failed to generate TOTP", e);
        }

        // Get expiry from config (default 5 minutes)
        int expirySeconds = configService.getOtpExpirySeconds();
        int maxAttempts = configService.getOtpMaxAttempts();

        // Create OTP record
        OtpRecord record = new OtpRecord();
        record.setIdentifier(identifier);
        record.setSecret(secret);
        // We don't really need codeHash anymore for core logic, but keeping for legacy
        // compatibility if DB needs it
        record.setCodeHash("STORED_AS_SECRET");
        record.setPurpose(purpose != null ? purpose : "LOGIN");
        record.setMaxAttempts(maxAttempts);
        record.setExpiresAt(LocalDateTime.now().plusSeconds(expirySeconds));

        otpRecordRepository.save(record);

        // DEV LOGGING
        logOtp(identifier, record.getPurpose(), otp, record.getExpiresAt());

        return otp;
    }

    public String generateOtp(String identifier) {
        return generateOtp(identifier, "LOGIN");
    }

    /**
     * Validate an OTP using strict bank-grade checks
     */
    @Transactional
    public OtpValidationResult validateOtp(String identifier, String userCode) {
        // 1. Check Lockout
        Optional<OtpAttempt> attemptOpt = otpAttemptRepository.findById(identifier);
        if (attemptOpt.isPresent()) {
            OtpAttempt attempt = attemptOpt.get();
            if (attempt.getLockedUntil() != null && attempt.getLockedUntil().isAfter(LocalDateTime.now())) {
                return new OtpValidationResult(false,
                        "Account locked due to too many failed attempts. Try again later.");
            }
        }

        // 2. Fetch Active OTP Record
        Optional<OtpRecord> recordOpt = otpRecordRepository
                .findFirstByIdentifierAndValidatedFalseOrderByCreatedAtDesc(identifier);

        if (recordOpt.isEmpty()) {
            recordFailure(identifier); // Penalize guessing
            return new OtpValidationResult(false, "No OTP found");
        }

        OtpRecord record = recordOpt.get();

        if (record.isExpired()) {
            // Don't count expired usage as a security failure (bad UX), but assume invalid
            return new OtpValidationResult(false, "OTP has expired");
        }

        // 3. TOTP Window Validation
        long currentEpoch = System.currentTimeMillis() / 1000L;
        long currentWindow = currentEpoch / 30;
        boolean matched = false;
        long matchedWindow = -1;

        try {
            for (int i = -VALIDATION_WINDOW; i <= VALIDATION_WINDOW; i++) {
                long checkWindow = currentWindow + i;
                long checkEpoch = checkWindow * 30;
                String expected = TotpUtility.generate(record.getSecret(), checkEpoch);

                if (TotpUtility.constantTimeEquals(expected, userCode)) {
                    matched = true;
                    matchedWindow = checkWindow;
                    break;
                }
            }
        } catch (Exception e) {
            e.printStackTrace();
            return new OtpValidationResult(false, "System error validating OTP");
        }

        if (!matched) {
            recordFailure(identifier);
            return new OtpValidationResult(false, "Invalid OTP");
        }

        // 4. Replay Protection
        com.kiosk.backend.entity.UsedOtpId usedId = new com.kiosk.backend.entity.UsedOtpId(identifier, matchedWindow);
        if (usedOtpRepository.existsById(usedId)) {
            recordFailure(identifier); // Replay IS an attack
            return new OtpValidationResult(false, "OTP already used");
        }

        // 5. Success
        // Mark as used in replay table
        usedOtpRepository.save(new UsedOtp(identifier, matchedWindow));

        // Mark record as validated (legacy support)
        record.setValidated(true);
        otpRecordRepository.save(record);

        // Reset fail attempts
        resetAttempts(identifier);

        return new OtpValidationResult(true, "OTP validated successfully");
    }

    private void recordFailure(String userId) {
        OtpAttempt attempt = otpAttemptRepository.findById(userId).orElse(new OtpAttempt());
        attempt.setUserId(userId);
        attempt.setFailedAttempts(attempt.getFailedAttempts() + 1);

        if (attempt.getFailedAttempts() >= MAX_FAILED_ATTEMPTS) {
            attempt.setLockedUntil(LocalDateTime.now().plusMinutes(LOCKOUT_MINUTES));
        }

        otpAttemptRepository.save(attempt);
    }

    private void resetAttempts(String userId) {
        otpAttemptRepository.findById(userId).ifPresent(attempt -> {
            attempt.setFailedAttempts(0);
            attempt.setLockedUntil(null);
            otpAttemptRepository.save(attempt);
        });
    }

    private void logOtp(String identifier, String purpose, String otp, LocalDateTime expires) {
        System.out.println("\n===============================");
        System.out.println(" OTP GENERATED FOR: " + identifier);
        System.out.println(" PURPOSE: " + purpose);
        System.out.println(" CODE: " + otp);
        System.out.println(" EXPIRES: " + expires);
        System.out.println("===============================\n");
    }

    public static class OtpValidationResult {
        private final boolean valid;
        private final String message;

        public OtpValidationResult(boolean valid, String message) {
            this.valid = valid;
            this.message = message;
        }

        public boolean isValid() {
            return valid;
        }

        public String getMessage() {
            return message;
        }
    }
}
