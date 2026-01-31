package com.kiosk.backend.security;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.lang.NonNull;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.ArrayList;

@Component
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private final JwtService jwtService;
    private final com.kiosk.backend.service.SecurityMetricsService metricsService;

    public JwtAuthenticationFilter(JwtService jwtService,
            com.kiosk.backend.service.SecurityMetricsService metricsService) {
        this.jwtService = jwtService;
        this.metricsService = metricsService;
    }

    @Override
    protected void doFilterInternal(
            @NonNull HttpServletRequest request,
            @NonNull HttpServletResponse response,
            @NonNull FilterChain filterChain) throws ServletException, IOException {
        final String authHeader = request.getHeader("Authorization");
        final String jwt;
        final String userId;

        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            filterChain.doFilter(request, response);
            return;
        }

        jwt = authHeader.substring(7);
        try {
            userId = jwtService.extractUsername(jwt);
            if (userId != null && SecurityContextHolder.getContext().getAuthentication() == null) {
                if (jwtService.isTokenValid(jwt, userId)) {
                    UsernamePasswordAuthenticationToken authToken = new UsernamePasswordAuthenticationToken(
                            userId,
                            null,
                            new ArrayList<>() // No roles for now
                    );
                    authToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
                    SecurityContextHolder.getContext().setAuthentication(authToken);

                    // Add userId to MDC for logging
                    org.slf4j.MDC.put("userId", userId);
                }
            }
        } catch (Exception e) {
            if (e instanceof io.jsonwebtoken.ExpiredJwtException) {
                metricsService.incrementTokenExpired();
            }
            // Token invalid or expired - just ignore, context remains empty
            // Ideally log this at debug
        }

        try {
            filterChain.doFilter(request, response);
        } finally {
            // Cleanup userId from MDC to prevent leaking to other requests on thread
            org.slf4j.MDC.remove("userId");
        }
    }
}
