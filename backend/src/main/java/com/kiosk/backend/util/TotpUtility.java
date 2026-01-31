package com.kiosk.backend.util;

import org.apache.commons.codec.binary.Base32;

import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;
import java.nio.ByteBuffer;
import java.security.GeneralSecurityException;
import java.time.Instant;

public final class TotpUtility {

    private static final int TIME_STEP_SECONDS = 30;
    private static final int OTP_DIGITS = 6;
    private static final String HMAC_ALGO = "HmacSHA256";

    private TotpUtility() {
    }

    /**
     * Generate RFC 6238 TOTP code
     */
    public static String generate(String base32Secret, long epochSeconds) throws GeneralSecurityException {
        byte[] key = new Base32().decode(base32Secret);
        long counter = epochSeconds / TIME_STEP_SECONDS;

        byte[] counterBytes = ByteBuffer.allocate(8).putLong(counter).array();

        Mac mac = Mac.getInstance(HMAC_ALGO);
        mac.init(new SecretKeySpec(key, HMAC_ALGO));
        byte[] hash = mac.doFinal(counterBytes);

        int offset = hash[hash.length - 1] & 0x0F;
        int binary = ((hash[offset] & 0x7F) << 24) |
                ((hash[offset + 1] & 0xFF) << 16) |
                ((hash[offset + 2] & 0xFF) << 8) |
                (hash[offset + 3] & 0xFF);

        int otp = binary % (int) Math.pow(10, OTP_DIGITS);
        return String.format("%0" + OTP_DIGITS + "d", otp);
    }

    /**
     * Generate TOTP code for current time
     */
    public static String generateNow(String base32Secret) throws GeneralSecurityException {
        return generate(base32Secret, Instant.now().getEpochSecond());
    }

    /**
     * Constant-time string comparison to prevent timing attacks
     */
    public static boolean constantTimeEquals(String a, String b) {
        if (a == null || b == null)
            return false;
        if (a.length() != b.length())
            return false;

        int result = 0;
        for (int i = 0; i < a.length(); i++) {
            result |= a.charAt(i) ^ b.charAt(i);
        }
        return result == 0;
    }
}
