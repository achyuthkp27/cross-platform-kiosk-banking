package com.kiosk.backend.filter;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.slf4j.MDC;
import org.springframework.core.Ordered;
import org.springframework.core.annotation.Order;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.UUID;

@Component
@Order(Ordered.HIGHEST_PRECEDENCE)
public class RequestLoggingFilter extends OncePerRequestFilter {

    private static final String REQUEST_ID_HEADER = "X-Request-Id";
    private static final String MDC_KEY_REQUEST_ID = "requestId";

    @Override
    protected void doFilterInternal(@org.springframework.lang.NonNull HttpServletRequest request,
            @org.springframework.lang.NonNull HttpServletResponse response,
            @org.springframework.lang.NonNull FilterChain filterChain)
            throws ServletException, IOException {

        try {
            // 1. Generate or extract Request ID
            String requestId = request.getHeader(REQUEST_ID_HEADER);
            if (requestId == null || requestId.isEmpty()) {
                requestId = UUID.randomUUID().toString();
            }

            // 2. Put into MDC
            MDC.put(MDC_KEY_REQUEST_ID, requestId);

            // 3. Try to extract User ID if authenticated (though at Highest Precedence,
            // auth might not be ready yet)
            // Ideally, we'd update MDC *after* authentication too.
            // But let's check here in case it's set by a previous filter or if we want to
            // add a wrapper.
            // Since this is HIGHEST_PRECEDENCE, SecurityContext is likely empty here.
            // Use a separate filter or logic for User ID if needed later in chain.
            // For now, we'll try.

            // Add header to response
            response.setHeader(REQUEST_ID_HEADER, requestId);

            filterChain.doFilter(request, response);
        } finally {
            // 4. Clean up
            MDC.clear();
        }
    }
}
