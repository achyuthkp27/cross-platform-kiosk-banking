package com.kiosk.backend.service;

import com.kiosk.backend.security.JwtService;
import io.jsonwebtoken.Claims;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.MockitoAnnotations;

import java.util.Date;
import java.util.concurrent.TimeUnit;

import static org.junit.jupiter.api.Assertions.*;

class JwtServiceTest {

    @InjectMocks
    private JwtService jwtService;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    void generateToken_ShouldGenerateValidToken() {
        String userId = "user123";
        String token = jwtService.generateToken(userId);

        assertNotNull(token);
        assertTrue(jwtService.isTokenValid(token, userId));
        assertEquals(userId, jwtService.extractUsername(token));
    }

    @Test
    void generateRefreshToken_ShouldGenerateValidToken() {
        String userId = "user123";
        String token = jwtService.generateRefreshToken(userId);

        assertNotNull(token);
        assertTrue(jwtService.isTokenValid(token, userId));
        assertEquals(userId, jwtService.extractUsername(token));
    }

    @Test
    void extractClaim_ShouldExtractExpiration() {
        String userId = "user123";
        String token = jwtService.generateToken(userId);

        Date expiration = jwtService.extractClaim(token, Claims::getExpiration);
        assertNotNull(expiration);
        assertTrue(expiration.after(new Date()));
    }

    @Test
    void tokens_ShouldHaveDifferentExpirations() {
        String userId = "user123";
        String accessToken = jwtService.generateToken(userId);
        String refreshToken = jwtService.generateRefreshToken(userId);

        Date accessExp = jwtService.extractClaim(accessToken, Claims::getExpiration);
        Date refreshExp = jwtService.extractClaim(refreshToken, Claims::getExpiration);

        // Refresh token should expire later than access token
        assertTrue(refreshExp.after(accessExp));
    }
}
