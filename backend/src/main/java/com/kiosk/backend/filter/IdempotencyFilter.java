package com.kiosk.backend.filter;

import com.kiosk.backend.entity.IdempotencyRecord;
import com.kiosk.backend.repository.IdempotencyRepository;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;
import org.springframework.web.util.ContentCachingResponseWrapper;

import java.io.IOException;
import java.util.Optional;

@Component
public class IdempotencyFilter extends OncePerRequestFilter {

    private final IdempotencyRepository idempotencyRepository;

    public IdempotencyFilter(IdempotencyRepository idempotencyRepository) {
        this.idempotencyRepository = idempotencyRepository;
    }

    @Override
    protected void doFilterInternal(@org.springframework.lang.NonNull HttpServletRequest request,
            @org.springframework.lang.NonNull HttpServletResponse response,
            @org.springframework.lang.NonNull FilterChain filterChain)
            throws ServletException, IOException {

        String method = request.getMethod();
        String key = request.getHeader("Idempotency-Key");

        // Only apply to state-changing methods (POST, PUT, DELETE) and if key is
        // present
        if (key == null || "GET".equalsIgnoreCase(method)) {
            filterChain.doFilter(request, response);
            return;
        }

        // Check if key exists
        Optional<IdempotencyRecord> recordOpt = idempotencyRepository.findByKey(key);
        if (recordOpt.isPresent()) {
            logger.info("Idempotency hit for key: " + key);
            IdempotencyRecord record = recordOpt.get();
            response.setStatus(record.getStatus());
            response.setContentType("application/json");
            response.getWriter().write(record.getResponseBody());
            response.setHeader("X-Idempotency-Hit", "true");
            return;
        }

        logger.info("Idempotency miss for key: " + key + ". Processing request...");

        // If not, wrap response, proceed, and save
        ContentCachingResponseWrapper responseWrapper = new ContentCachingResponseWrapper(response);

        try {
            filterChain.doFilter(request, responseWrapper);
        } finally {
            // Only save successful modifications (200-299)
            // Or maybe all? Usually 2xx. 400 Bad Request usually shouldn't burn the key if
            // it's retryable,
            // but for strict idempotency, ANY result for a key is final.
            // Let's standard: Store if it was processed.
            // NOTE: responseWrapper must be copied back to original response

            byte[] responseArray = responseWrapper.getContentAsByteArray();
            String responseBody = new String(responseArray, responseWrapper.getCharacterEncoding());

            // Re-write to real response
            responseWrapper.copyBodyToResponse();

            if (response.getStatus() >= 200 && response.getStatus() < 500) {
                // We count 4xx as valid logic responses (e.g. Insufficient Funds) that should
                // be cached
                // to prevent retrying the same bad request logic repeatedly?
                // Actually, "Insufficient Funds" is a domain state.
                // If I retry "Send $10" and get "Insufficient Funds", and then I deposit $100,
                // checking the same key again SHOULD return "Insufficient Funds" ideally
                // (strict)
                // OR it should re-evaluate (loose).
                // Banking usually demands STRICT. A specific Request ID has a specific outcome.
                // If you want to try again, generate a new Request ID.

                IdempotencyRecord newRecord = new IdempotencyRecord(
                        key,
                        method,
                        request.getRequestURI(),
                        response.getStatus(),
                        responseBody);
                try {
                    idempotencyRepository.save(newRecord);
                } catch (Exception e) {
                    // Concurrency edge case: duplicate key insert
                    // Ignore or log
                }
            }
        }
    }
}
