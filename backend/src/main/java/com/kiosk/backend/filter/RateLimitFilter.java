package com.kiosk.backend.filter;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.kiosk.backend.dto.ApiResponse;
import com.kiosk.backend.service.RateLimitService;
import io.github.bucket4j.Bucket;
import io.github.bucket4j.ConsumptionProbe;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.lang.NonNull;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

@Component
public class RateLimitFilter extends OncePerRequestFilter {

    private static final Logger logger = LoggerFactory.getLogger(RateLimitFilter.class);

    private final RateLimitService rateLimitService;
    private final ObjectMapper objectMapper;

    public RateLimitFilter(RateLimitService rateLimitService, ObjectMapper objectMapper) {
        this.rateLimitService = rateLimitService;
        this.objectMapper = objectMapper;
    }

    @Override
    protected void doFilterInternal(@NonNull HttpServletRequest request, @NonNull HttpServletResponse response,
            @NonNull FilterChain filterChain)
            throws ServletException, IOException {

        if (isAuthEndpoint(request)) {
            String clientIp = getClientIp(request);
            Bucket tokenBucket = rateLimitService.resolveBucket(clientIp);
            ConsumptionProbe probe = tokenBucket.tryConsumeAndReturnRemaining(1);

            if (!probe.isConsumed()) {
                logger.warn("Rate limit exceeded for IP: {}", clientIp);
                response.setStatus(HttpStatus.TOO_MANY_REQUESTS.value());
                response.setContentType("application/json");

                // Using getOutputStream() to be safe given previous EncryptionFilter learnings
                // However, this filter runs BEFORE EncryptionFilter, so we should output
                // Plaintext JSON?
                // Wait, if it runs BEFORE EncryptionFilter, the response will be encrypted if
                // we write to it and continue?
                // NO, if we return early, we stop the chain. EncryptionFilter won't see the
                // response content if we don't call chain.doFilter().
                // But we WANT the 429 to be encrypted if the client expects encryption?
                // Actually, if we block here, we return a 429. The client (apiClient) handles
                // errors.
                // For simplicity, we return plaintext 429. If encryption is STRICT, this might
                // be an issue.
                // BUT EncryptionFilter wraps the response. If we write here and return, we are
                // "inside" the filter chain of previous filters, but "outside" EncryptionFilter
                // if we put this BEFORE it.
                // We planned to put this BEFORE AuthenticationFilter.
                // Ideally: EncryptionFilter -> RateLimitFilter -> AuthenticationFilter.
                // So EncryptionFilter decrypts request -> RateLimit checks -> Auth checks.
                // If RateLimit blocks, it writes 429. EncryptionFilter (on the way out)
                // Encrypts it!
                // PERFECT. So we just write to response. Writer or OutputStream?
                // EncryptionFilter uses ContentCachingResponseWrapper. So we allow writing.
                // We should use OutputStream to be safe.

                ApiResponse<Void> errorResponse = ApiResponse.error("Too many requests. Please try again later.");
                response.getOutputStream().write(objectMapper.writeValueAsBytes(errorResponse));
                return;
            }

            // Add header showing remaining tokens
            response.addHeader("X-Rate-Limit-Remaining", String.valueOf(probe.getRemainingTokens()));
        }

        filterChain.doFilter(request, response);
    }

    private boolean isAuthEndpoint(HttpServletRequest request) {
        String uri = request.getRequestURI();
        return uri.startsWith("/v1/auth/");
    }

    private String getClientIp(HttpServletRequest request) {
        String xfHeader = request.getHeader("X-Forwarded-For");
        if (xfHeader == null) {
            return request.getRemoteAddr();
        }
        return xfHeader.split(",")[0];
    }
}
