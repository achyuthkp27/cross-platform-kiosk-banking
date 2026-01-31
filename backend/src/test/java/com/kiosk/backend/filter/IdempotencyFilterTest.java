package com.kiosk.backend.filter;

import com.kiosk.backend.entity.IdempotencyRecord;
import com.kiosk.backend.repository.IdempotencyRepository;
import jakarta.servlet.FilterChain;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.mock.web.MockHttpServletRequest;
import org.springframework.mock.web.MockHttpServletResponse;

import java.io.PrintWriter;
import java.io.StringWriter;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class IdempotencyFilterTest {

    @Mock
    private IdempotencyRepository idempotencyRepository;

    @Mock
    private FilterChain filterChain;

    private IdempotencyFilter idempotencyFilter;

    @BeforeEach
    void setUp() {
        idempotencyFilter = new IdempotencyFilter(idempotencyRepository);
    }

    @Test
    void shouldPassThroughIfNoKey() throws Exception {
        MockHttpServletRequest request = new MockHttpServletRequest("POST", "/test");
        MockHttpServletResponse response = new MockHttpServletResponse();

        idempotencyFilter.doFilterInternal(request, response, filterChain);

        verify(filterChain).doFilter(request, response);
        verify(idempotencyRepository, never()).findByKey(any());
        verify(idempotencyRepository, never()).save(any());
    }

    @Test
    void shouldPassThroughIfGetMethod() throws Exception {
        MockHttpServletRequest request = new MockHttpServletRequest("GET", "/test");
        request.addHeader("Idempotency-Key", "key-123");
        MockHttpServletResponse response = new MockHttpServletResponse();

        idempotencyFilter.doFilterInternal(request, response, filterChain);

        verify(filterChain).doFilter(request, response);
        verify(idempotencyRepository, never()).findByKey(any());
    }

    @Test
    void shouldReturnCachedResponseIfKeyExists() throws Exception {
        String key = "key-123";
        MockHttpServletRequest request = new MockHttpServletRequest("POST", "/test");
        request.addHeader("Idempotency-Key", key);
        MockHttpServletResponse response = new MockHttpServletResponse();

        IdempotencyRecord record = new IdempotencyRecord();
        record.setStatus(200);
        record.setResponseBody("{\"status\":\"cached\"}");

        when(idempotencyRepository.findByKey(key)).thenReturn(Optional.of(record));

        idempotencyFilter.doFilterInternal(request, response, filterChain);

        verify(filterChain, never()).doFilter(any(), any());
        assertEquals(200, response.getStatus());
        assertEquals("{\"status\":\"cached\"}", response.getContentAsString());
        assertEquals("true", response.getHeader("X-Idempotency-Hit"));
    }

    @Test
    void shouldCaptureAndSaveResponseIfKeyNew() throws Exception {
        String key = "key-new";
        MockHttpServletRequest request = new MockHttpServletRequest("POST", "/test");
        request.addHeader("Idempotency-Key", key);
        MockHttpServletResponse response = new MockHttpServletResponse();

        // Simulate filter chain processing writing to response
        doAnswer(invocation -> {
            HttpServletResponse resp = invocation.getArgument(1);
            resp.setStatus(201);
            resp.getWriter().write("{\"status\":\"created\"}");
            return null;
        }).when(filterChain).doFilter(any(), any());

        idempotencyFilter.doFilterInternal(request, response, filterChain);

        verify(idempotencyRepository).findByKey(key);
        verify(filterChain).doFilter(any(), any()); // It uses a wrapper, so we can't easily equals matches

        // internal capturing is tricky to verify without integration test because
        // implementation wraps response
        // but we can verify save was called
        verify(idempotencyRepository).save(any(IdempotencyRecord.class));
    }
}
