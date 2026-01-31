package com.kiosk.backend.service;

import com.kiosk.backend.entity.OtpAttempt;
import com.kiosk.backend.entity.OtpRecord;
import com.kiosk.backend.entity.UsedOtp;
import com.kiosk.backend.repository.OtpAttemptRepository;
import com.kiosk.backend.repository.OtpRecordRepository;
import com.kiosk.backend.repository.UsedOtpRepository;
import com.kiosk.backend.util.TotpUtility;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

import java.time.LocalDateTime;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

class OtpServiceTest {

    @Mock
    private OtpRecordRepository otpRecordRepository;
    @Mock
    private UsedOtpRepository usedOtpRepository;
    @Mock
    private OtpAttemptRepository otpAttemptRepository;
    @Mock
    private ConfigService configService;

    @InjectMocks
    private OtpService otpService;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
        when(configService.getOtpExpirySeconds()).thenReturn(300);
        when(configService.getOtpMaxAttempts()).thenReturn(3);
        when(otpAttemptRepository.findById(anyString())).thenReturn(Optional.empty());
    }

    @Test
    void generateOtp_ShouldCreateRecordWithSecret() {
        String identifier = "user123";
        String otp = otpService.generateOtp(identifier);

        assertNotNull(otp);
        assertEquals(6, otp.length());

        ArgumentCaptor<OtpRecord> captor = ArgumentCaptor.forClass(OtpRecord.class);
        verify(otpRecordRepository).save(captor.capture());
        OtpRecord savedRecord = captor.getValue();

        assertEquals(identifier, savedRecord.getIdentifier());
        assertNotNull(savedRecord.getSecret());
    }

    @Test
    void validateOtp_ShouldValidateSuccessfully() throws Exception {
        String identifier = "user123";

        // Setup state
        OtpRecord record = new OtpRecord();
        record.setIdentifier(identifier);
        record.setMaxAttempts(3);
        record.setExpiresAt(LocalDateTime.now().plusMinutes(5));

        // Generate a known secret/OTP
        String secret = "JBSWY3DPEHPK3PXP"; // Base32
        record.setSecret(secret);
        String validCode = TotpUtility.generateNow(secret);

        when(otpRecordRepository.findFirstByIdentifierAndValidatedFalseOrderByCreatedAtDesc(identifier))
                .thenReturn(Optional.of(record));
        when(usedOtpRepository.existsById(any())).thenReturn(false);

        OtpService.OtpValidationResult result = otpService.validateOtp(identifier, validCode);

        assertTrue(result.isValid(), result.getMessage());
        verify(usedOtpRepository).save(any(UsedOtp.class));
        verify(otpAttemptRepository, never()).save(any(OtpAttempt.class)); // No failure recorded
    }

    @Test
    void validateOtp_ShouldFail_ReplayAttack() throws Exception {
        String identifier = "user123";
        String secret = "JBSWY3DPEHPK3PXP";
        String validCode = TotpUtility.generateNow(secret);

        OtpRecord record = new OtpRecord();
        record.setSecret(secret);
        record.setExpiresAt(LocalDateTime.now().plusMinutes(5));

        when(otpRecordRepository.findFirstByIdentifierAndValidatedFalseOrderByCreatedAtDesc(identifier))
                .thenReturn(Optional.of(record));

        // Simulate Replay: UsedOtp exists
        when(usedOtpRepository.existsById(any())).thenReturn(true);

        OtpService.OtpValidationResult result = otpService.validateOtp(identifier, validCode);

        assertFalse(result.isValid());
        assertEquals("OTP already used", result.getMessage());
        verify(otpAttemptRepository).save(any(OtpAttempt.class)); // Should record strict failure
    }

    @Test
    void validateOtp_ShouldLockout_AfterMaxAttempts() {
        String identifier = "lockedUser";

        OtpAttempt lockedAttempt = new OtpAttempt();
        lockedAttempt.setUserId(identifier);
        lockedAttempt.setLockedUntil(LocalDateTime.now().plusMinutes(10));

        when(otpAttemptRepository.findById(identifier)).thenReturn(Optional.of(lockedAttempt));

        OtpService.OtpValidationResult result = otpService.validateOtp(identifier, "123456");

        assertFalse(result.isValid());
        assertTrue(result.getMessage().contains("locked"));
        verify(otpRecordRepository, never()).findFirstByIdentifierAndValidatedFalseOrderByCreatedAtDesc(anyString());
    }
}
