package com.kiosk.backend.exception;

import com.kiosk.backend.dto.ApiError;
import jakarta.servlet.http.HttpServletRequest;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.slf4j.MDC;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.http.converter.HttpMessageNotReadableException;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.core.AuthenticationException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.method.annotation.MethodArgumentTypeMismatchException;
import org.springframework.web.servlet.resource.NoResourceFoundException;

@RestControllerAdvice
public class GlobalExceptionHandler {

        private final com.kiosk.backend.service.SecurityMetricsService metricsService;

        public GlobalExceptionHandler(com.kiosk.backend.service.SecurityMetricsService metricsService) {
                this.metricsService = metricsService;
        }

        private static final Logger logger = LoggerFactory.getLogger(GlobalExceptionHandler.class);

        @ExceptionHandler(Exception.class)
        public ResponseEntity<ApiError> handleAll(Exception ex, HttpServletRequest request) {
                String requestId = MDC.get("requestId");
                logger.error("Unhandled exception [requestId={}]: ", requestId, ex);

                ApiError apiError = new ApiError(
                                HttpStatus.INTERNAL_SERVER_ERROR.value(),
                                "Internal Server Error",
                                "An unexpected error occurred. Please reference Request ID: " + requestId,
                                request.getRequestURI(),
                                requestId);
                return new ResponseEntity<>(apiError, HttpStatus.INTERNAL_SERVER_ERROR);
        }

        @ExceptionHandler(IllegalArgumentException.class)
        public ResponseEntity<ApiError> handleIllegalArgument(IllegalArgumentException ex, HttpServletRequest request) {
                String requestId = MDC.get("requestId");
                logger.warn("Illegal Argument [requestId={}] : {}", requestId, ex.getMessage());

                ApiError apiError = new ApiError(
                                HttpStatus.BAD_REQUEST.value(),
                                "Bad Request",
                                ex.getMessage(),
                                request.getRequestURI(),
                                requestId);
                return new ResponseEntity<>(apiError, HttpStatus.BAD_REQUEST);
        }

        @ExceptionHandler(MethodArgumentTypeMismatchException.class)
        public ResponseEntity<ApiError> handleMethodArgumentTypeMismatch(MethodArgumentTypeMismatchException ex,
                        HttpServletRequest request) {
                String requestId = MDC.get("requestId");
                Class<?> requiredType = ex.getRequiredType();
                String typeName = requiredType != null ? requiredType.getSimpleName() : "Unknown";
                String message = String.format("The parameter '%s' of value '%s' could not be converted to type '%s'",
                                ex.getName(), ex.getValue(), typeName);

                ApiError apiError = new ApiError(
                                HttpStatus.BAD_REQUEST.value(),
                                "Bad Request",
                                message,
                                request.getRequestURI(),
                                requestId);
                return new ResponseEntity<>(apiError, HttpStatus.BAD_REQUEST);
        }

        @ExceptionHandler(HttpMessageNotReadableException.class)
        public ResponseEntity<ApiError> handleHttpMessageNotReadable(HttpMessageNotReadableException ex,
                        HttpServletRequest request) {
                String requestId = MDC.get("requestId");
                ApiError apiError = new ApiError(
                                HttpStatus.BAD_REQUEST.value(),
                                "Malformed JSON",
                                "Request body is missing or malformed",
                                request.getRequestURI(),
                                requestId);
                return new ResponseEntity<>(apiError, HttpStatus.BAD_REQUEST);
        }

        @ExceptionHandler(AccessDeniedException.class)
        public ResponseEntity<ApiError> handleAccessDenied(AccessDeniedException ex, HttpServletRequest request) {
                String requestId = MDC.get("requestId");
                logger.warn("Access Denied [requestId={}]: {}", requestId, ex.getMessage());
                metricsService.incrementSuspiciousRequest();

                ApiError apiError = new ApiError(
                                HttpStatus.FORBIDDEN.value(),
                                "Forbidden",
                                "Access is denied",
                                request.getRequestURI(),
                                requestId);
                return new ResponseEntity<>(apiError, HttpStatus.FORBIDDEN);
        }

        @ExceptionHandler(AuthenticationException.class)
        public ResponseEntity<ApiError> handleAuthenticationException(AuthenticationException ex,
                        HttpServletRequest request) {
                String requestId = MDC.get("requestId");
                logger.warn("Authentication Failed [requestId={}]: {}", requestId, ex.getMessage());
                metricsService.incrementAuthFailure();

                ApiError apiError = new ApiError(
                                HttpStatus.UNAUTHORIZED.value(),
                                "Unauthorized",
                                ex.getMessage(),
                                request.getRequestURI(),
                                requestId);
                return new ResponseEntity<>(apiError, HttpStatus.UNAUTHORIZED);
        }

        @ExceptionHandler(NoResourceFoundException.class)
        public ResponseEntity<ApiError> handleNoResourceFound(NoResourceFoundException ex, HttpServletRequest request) {
                // Hide stack trace for 404s
                String requestId = MDC.get("requestId");
                ApiError apiError = new ApiError(
                                HttpStatus.NOT_FOUND.value(),
                                "Not Found",
                                "Resource not found",
                                request.getRequestURI(),
                                requestId);
                return new ResponseEntity<>(apiError, HttpStatus.NOT_FOUND);
        }

        @ExceptionHandler(io.github.resilience4j.circuitbreaker.CallNotPermittedException.class)
        public ResponseEntity<ApiError> handleCircuitBreakerOpen(
                        io.github.resilience4j.circuitbreaker.CallNotPermittedException ex,
                        HttpServletRequest request) {
                String requestId = MDC.get("requestId");
                logger.error("Circuit Breaker Open [requestId={}]: {}", requestId, ex.getMessage());

                ApiError apiError = new ApiError(
                                HttpStatus.SERVICE_UNAVAILABLE.value(),
                                "Service Unavailable",
                                "The service is temporarily unavailable. Please try again later.",
                                request.getRequestURI(),
                                requestId);
                return new ResponseEntity<>(apiError, HttpStatus.SERVICE_UNAVAILABLE);
        }

        @ExceptionHandler(io.github.resilience4j.ratelimiter.RequestNotPermitted.class)
        public ResponseEntity<ApiError> handleRateLimitExceeded(
                        io.github.resilience4j.ratelimiter.RequestNotPermitted ex, HttpServletRequest request) {
                String requestId = MDC.get("requestId");
                logger.warn("Rate Limit Exceeded [requestId={}]: {}", requestId, ex.getMessage());

                ApiError apiError = new ApiError(
                                HttpStatus.TOO_MANY_REQUESTS.value(),
                                "Too Many Requests",
                                "You have exceeded the request limit.",
                                request.getRequestURI(),
                                requestId);
                return new ResponseEntity<>(apiError, HttpStatus.TOO_MANY_REQUESTS);
        }
}
