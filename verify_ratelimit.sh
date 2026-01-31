#!/bin/bash
# verify_ratelimit.sh

# This script verifies rate limiting on /v1/auth/login
# It sends requests sequentially. The limit is 5 per minute.
# We expect the 6th request to fail with 429.

URL="http://localhost:8080/v1/auth/login"
# Note: In REAL mode, the server expects encrypted payloads.
# Sending plaintext might return 400 Bad Request (Decryption Failed).
# However, 400 counts as a "request" for rate limiting purposes if the filter runs!
# BUT RateLimitFilter checks URI. It doesn't care about payload validity.
# So even junk requests should trigger the limiter if sent from the same IP.

echo "--- Starting Rate Limit Verification ---"
echo "Target: $URL"
echo "Limit: 5 requests / min"

for i in {1..7}
do
   echo "Request #$i..."
   # We use curl with -I to see headers (status code)
   # We send garbage data. EncryptionFilter will likely reject it with 400,
   # BUT RateLimitFilter runs *after* EncryptionFilter?
   # Wait. If RateLimitFilter is AFTER EncryptionFilter, and EncryptionFilter rejects garbage with 400,
   # does RateLimitFilter ever see it?
   # Request -> EncryptionFilter (Decrypt Fail -> Return 400) -> RateLimitFilter (NEVER REACHED).
   
   # AHA! If we want to rate limit *invalid* requests too, RateLimitFilter should be BEFORE EncryptionFilter!
   # Re-evaluating the order.
   # If RateLimitFilter is BEFORE:
   # Request -> RateLimitFilter (Count++) -> EncryptionFilter (Decrypt Fail -> 400).
   # This protects the EncryptionFilter (CPU expensive) from DoS!
   # THIS IS BETTER. Encryption is expensive. We should rate limit BEFORE decryption.
   
   # But what about the 429 encryption requirement?
   # If we return 429 plaintext, the verified client might fail to parse it.
   # But a DoS attacker doesn't care. 
   # A legitimate client hitting limits might be confused.
   # Compromise: Rate Limit BEFORE Encryption. 
   # If we want encrypted 429s, RateLimitFilter needs to explicitly encrypt or we accept plaintext 429s.
   
   # Let's test with the current config (RateLimit AFTER Encryption).
   # If I send garbage, EncryptionFilter blocks it (400). RateLimitFilter never counts it.
   # Use 'verify_encryption.js' logic to send *validly encrypted* requests? expensive to script in bash.
   # OR, rely on the fact that headers are checked first? 
   # EncryptionFilter checks 'X-Encryption-Mode: TRUE'.
   # If I send 'X-Encryption-Mode: FALSE' (or omit), EncryptionFilter skips decryption?
   # Let's check EncryptionFilter logic.
   # header "TRUE".equalsIgnoreCase(encryptionHeader).
   # If header is missing, isEncrypted = false.
   # Then it proceeds to filterChain.doFilter.
   # THEN RateLimitFilter sees it.
   # SO, if I send a request *without* the header, it bypasses decryption, hits RateLimitFilter.
   # This allows me to test rate limiting easily with curl!
   
   HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" -X POST $URL -H "Content-Type: application/json" -d '{}')
   echo "Response: $HTTP_CODE"
   sleep 0.5
done
