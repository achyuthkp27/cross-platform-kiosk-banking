package com.kiosk.backend.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import javax.crypto.Cipher;
import javax.crypto.Mac;
import javax.crypto.SecretKey;
import javax.crypto.spec.GCMParameterSpec;
import javax.crypto.spec.SecretKeySpec;
import java.nio.charset.StandardCharsets;
import java.security.SecureRandom;
import java.util.Base64;

@Service
public class CryptoService {

    @Value("${kiosk.master.secret:DEFAULT_INSECURE_SECRET_CHANGE_ME_IMMEDIATELY_1234567890}")
    private String masterSecret;

    private static final String ALGORITHM = "AES/GCM/NoPadding";
    private static final int GCM_TAG_LENGTH = 128;
    private static final int SALT_LENGTH = 16;
    private static final int IV_LENGTH = 12;

    private final SecureRandom secureRandom = new SecureRandom();

    /**
     * Decrypts the payload using a key derived from the Master Secret + provided
     * Salt.
     */
    public byte[] decrypt(String ivBase64, String saltBase64, String ciphertextBase64, String aad) {
        try {
            byte[] iv = Base64.getDecoder().decode(ivBase64);
            byte[] salt = Base64.getDecoder().decode(saltBase64);
            byte[] ciphertext = Base64.getDecoder().decode(ciphertextBase64);

            SecretKey derivedKey = deriveKey(salt);

            Cipher cipher = Cipher.getInstance(ALGORITHM);
            GCMParameterSpec spec = new GCMParameterSpec(GCM_TAG_LENGTH, iv);
            cipher.init(Cipher.DECRYPT_MODE, derivedKey, spec);

            if (aad != null) {
                cipher.updateAAD(aad.getBytes(StandardCharsets.UTF_8));
            }

            return cipher.doFinal(ciphertext);
        } catch (Exception e) {
            throw new RuntimeException("Decryption failed: Integrity check or key mismatch", e);
        }
    }

    /**
     * Encrypts the payload, generating a fresh Salt and IV.
     * Returns a wrapper containing all components needed for decryption.
     */
    public EncryptionResult encrypt(byte[] plaintext, String aad) {
        try {
            byte[] salt = new byte[SALT_LENGTH];
            secureRandom.nextBytes(salt);

            byte[] iv = new byte[IV_LENGTH];
            secureRandom.nextBytes(iv);

            SecretKey derivedKey = deriveKey(salt);

            Cipher cipher = Cipher.getInstance(ALGORITHM);
            GCMParameterSpec spec = new GCMParameterSpec(GCM_TAG_LENGTH, iv);
            cipher.init(Cipher.ENCRYPT_MODE, derivedKey, spec);

            if (aad != null) {
                cipher.updateAAD(aad.getBytes(StandardCharsets.UTF_8));
            }

            byte[] ciphertext = cipher.doFinal(plaintext);

            return new EncryptionResult(
                    Base64.getEncoder().encodeToString(iv),
                    Base64.getEncoder().encodeToString(salt),
                    Base64.getEncoder().encodeToString(ciphertext),
                    aad);

        } catch (Exception e) {
            throw new RuntimeException("Encryption failed", e);
        }
    }

    /**
     * HKDF-SHA256 Derivation
     * Derived Key = HKDF(MasterSecret, Salt, Info="kiosk-api")
     */
    private SecretKey deriveKey(byte[] salt) throws Exception {
        byte[] ikm = masterSecret.getBytes(StandardCharsets.UTF_8);
        byte[] info = "kiosk-api".getBytes(StandardCharsets.UTF_8);

        // HKDF-Extract
        Mac hmac = Mac.getInstance("HmacSHA256");
        SecretKeySpec saltKey = new SecretKeySpec(salt, "HmacSHA256"); // Salt is used as key for extract
        hmac.init(saltKey);
        byte[] prk = hmac.doFinal(ikm);

        // HKDF-Expand
        Mac hmacExpand = Mac.getInstance("HmacSHA256");
        hmacExpand.init(new SecretKeySpec(prk, "HmacSHA256"));

        // T(1) = HMAC-Hash(PRK, T(0) | info | 0x01)
        hmacExpand.update(info);
        hmacExpand.update((byte) 0x01);
        byte[] okm = hmacExpand.doFinal(); // 32 bytes for SHA-256 matches AES-256 requirement

        return new SecretKeySpec(okm, "AES");
    }

    public static class EncryptionResult {
        public String iv;
        public String salt;
        public String ciphertext;
        public String aad;

        public EncryptionResult(String iv, String salt, String ciphertext, String aad) {
            this.iv = iv;
            this.salt = salt;
            this.ciphertext = ciphertext;
            this.aad = aad;
        }
    }
}
