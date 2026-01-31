package com.kiosk.backend.config;

import com.kiosk.backend.security.JwtAuthenticationFilter;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import java.util.List;

import com.kiosk.backend.filter.EncryptionFilter;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    private final JwtAuthenticationFilter jwtAuthFilter;
    private final com.kiosk.backend.filter.IdempotencyFilter idempotencyFilter;

    public SecurityConfig(JwtAuthenticationFilter jwtAuthFilter,
            com.kiosk.backend.filter.IdempotencyFilter idempotencyFilter) {
        this.jwtAuthFilter = jwtAuthFilter;
        this.idempotencyFilter = idempotencyFilter;
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http,
            EncryptionFilter encryptionFilter,
            com.kiosk.backend.filter.RateLimitFilter rateLimitFilter)
            throws Exception {
        http
                .csrf(AbstractHttpConfigurer::disable)
                .cors(cors -> cors.configurationSource(corsConfigurationSource()))
                .authorizeHttpRequests(auth -> auth
                        .requestMatchers(
                                "/v1/auth/**",
                                "/v1/config/**",
                                "/v1/audit/**",
                                "/actuator/**",
                                "/error",
                                "/v1/health",
                                "/v1/metrics")
                        .permitAll()
                        .anyRequest().authenticated())
                .sessionManagement(sess -> sess.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .addFilterBefore(idempotencyFilter, UsernamePasswordAuthenticationFilter.class)
                .addFilterBefore(encryptionFilter, UsernamePasswordAuthenticationFilter.class)
                .addFilterAfter(rateLimitFilter, EncryptionFilter.class)
                .addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }

    @Bean
    public EncryptionFilter encryptionFilter(com.kiosk.backend.service.CryptoService cryptoService,
            com.fasterxml.jackson.databind.ObjectMapper objectMapper) {
        return new EncryptionFilter(cryptoService, objectMapper);
    }

    @Bean
    public UrlBasedCorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration obj = new CorsConfiguration();
        obj.setAllowedOriginPatterns(List.of("*")); // TODO: Restrict to your domain in production
        obj.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "OPTIONS"));
        // Explicit header whitelist (production-safe)
        obj.setAllowedHeaders(List.of(
                "Authorization",
                "Content-Type",
                "Accept",
                "Origin",
                "Cache-Control",
                "Idempotency-Key",
                "X-Encryption-Mode", // Frontend sends this for E2E encryption
                "X-Request-ID"));
        obj.setExposedHeaders(List.of("X-Request-ID", "X-Rate-Limit-Remaining"));
        obj.setAllowCredentials(true);
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", obj);
        return source;
    }
}
