package com.kiosk.backend.filter;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.kiosk.backend.dto.ApiResponse;
import com.kiosk.backend.dto.EncryptionRequest;
import com.kiosk.backend.dto.EncryptionResponse;
import com.kiosk.backend.service.CryptoService;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.web.filter.OncePerRequestFilter;
import org.springframework.web.util.ContentCachingResponseWrapper;

import java.io.IOException;

public class EncryptionFilter extends OncePerRequestFilter {

    private static final Logger logger = LoggerFactory.getLogger(EncryptionFilter.class);

    private final CryptoService cryptoService;
    private final ObjectMapper objectMapper;

    public EncryptionFilter(CryptoService cryptoService, ObjectMapper objectMapper) {
        this.cryptoService = cryptoService;
        this.objectMapper = objectMapper;
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {

        logger.debug("EncryptionFilter STARTING for {}", request.getRequestURI());
        String encryptionHeader = request.getHeader("X-Encryption-Mode");
        boolean isEncrypted = "TRUE".equalsIgnoreCase(encryptionHeader);

        // 2. Setup Wrappers
        HttpServletRequest requestToUse = request;
        ContentCachingResponseWrapper responseWrapper = new ContentCachingResponseWrapper(response);

        try {
            // 3. Decrypt Request if needed
            if (isEncrypted && request.getContentLength() > 0) {
                EncryptionRequest encryptedPayload = objectMapper.readValue(request.getInputStream(),
                        EncryptionRequest.class);

                byte[] decryptedBytes = cryptoService.decrypt(
                        encryptedPayload.getIv(),
                        encryptedPayload.getSalt(),
                        encryptedPayload.getCiphertext(),
                        encryptedPayload.getAad());

                requestToUse = new DecryptedRequestWrapper(request, decryptedBytes);
            }

            // 4. Proceed with Filter Chain
            filterChain.doFilter(requestToUse, responseWrapper);

            // 5. Encrypt Response if needed
            if (isEncrypted) {
                byte[] responseData = responseWrapper.getContentAsByteArray();

                if (responseData.length > 0) {
                    String aad = String.valueOf(System.currentTimeMillis());
                    CryptoService.EncryptionResult result = cryptoService.encrypt(responseData, aad);

                    EncryptionResponse encryptedResponse = new EncryptionResponse(
                            result.iv,
                            result.salt,
                            result.ciphertext,
                            result.aad);

                    responseWrapper.resetBuffer();
                    response.setContentType("application/json");
                    // Use OutputStream to avoid conflict if downstream used it
                    response.getOutputStream().write(objectMapper.writeValueAsBytes(encryptedResponse));
                }
            }

            // 6. Copy content to original response
            responseWrapper.copyBodyToResponse();

        } catch (Throwable e) {
            logger.error("ENCRYPTION FILTER ERROR", e);

            if (!response.isCommitted()) {
                response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
                response.setContentType("application/json");
                ApiResponse<Void> errorResponse = ApiResponse.error("Secure Channel Error: " + e.getMessage());
                try {
                    response.getOutputStream().write(objectMapper.writeValueAsBytes(errorResponse));
                    response.getOutputStream().flush();
                } catch (Exception writeEx) {
                    logger.error("Failed to write error response", writeEx);
                }
            }
        }
    }

    @Override
    protected boolean shouldNotFilter(HttpServletRequest request) {
        // Skip for OPTIONS (CORS) or specific paths if needed
        return "OPTIONS".equalsIgnoreCase(request.getMethod());
    }
}
