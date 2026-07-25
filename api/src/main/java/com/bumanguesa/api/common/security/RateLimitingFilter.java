package com.bumanguesa.api.common.security;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.time.Instant;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.atomic.AtomicInteger;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

/**
 * OWASP A04/A07: Rate Limiting & Anti-Brute Force Protection.
 * <p>Protects authentication and API endpoints from brute-force attacks and credential stuffing
 * using an in-memory sliding window algorithm per IP address.
 */
@Component
public class RateLimitingFilter extends OncePerRequestFilter {

    private static final int LOGIN_MAX_REQUESTS_PER_MINUTE = 5;
    private static final int GENERAL_MAX_REQUESTS_PER_MINUTE = 100;

    private final Map<String, RequestBucket> loginBuckets = new ConcurrentHashMap<>();
    private final Map<String, RequestBucket> generalBuckets = new ConcurrentHashMap<>();

    @Override
    protected void doFilterInternal(HttpServletRequest request,
                                    HttpServletResponse response,
                                    FilterChain filterChain) throws ServletException, IOException {

        String path = request.getRequestURI();
        String clientIp = getClientIp(request);
        long now = Instant.now().getEpochSecond();

        boolean isLoginRequest = path.startsWith("/api/auth/login") && "POST".equalsIgnoreCase(request.getMethod());

        if (isLoginRequest) {
            if (isRateLimited(loginBuckets, clientIp, LOGIN_MAX_REQUESTS_PER_MINUTE, now)) {
                sendRateLimitResponse(request, response, "Demasiados intentos de inicio de sesión. Por favor espera 1 minuto.");
                return;
            }
        } else if (path.startsWith("/api/")) {
            if (isRateLimited(generalBuckets, clientIp, GENERAL_MAX_REQUESTS_PER_MINUTE, now)) {
                sendRateLimitResponse(request, response, "Límite de peticiones excedido. Inténtalo de nuevo más tarde.");
                return;
            }
        }

        filterChain.doFilter(request, response);
    }

    private boolean isRateLimited(Map<String, RequestBucket> map, String ip, int maxRequests, long now) {
        if (map.size() > 5000) {
            map.entrySet().removeIf(entry -> now - entry.getValue().windowStart > 120);
        }

        RequestBucket bucket = map.compute(ip, (key, existing) -> {
            if (existing == null || now - existing.windowStart >= 60) {
                return new RequestBucket(now, new AtomicInteger(1));
            }
            existing.count.incrementAndGet();
            return existing;
        });

        return bucket.count.get() > maxRequests;
    }

    private void sendRateLimitResponse(HttpServletRequest request,
                                       HttpServletResponse response,
                                       String message) throws IOException {
        response.setStatus(HttpStatus.TOO_MANY_REQUESTS.value());
        response.setContentType(MediaType.APPLICATION_JSON_VALUE);
        response.setHeader("Retry-After", "60");

        String jsonResponse = String.format(
                "{\"timestamp\":\"%s\",\"status\":429,\"error\":\"Too Many Requests\",\"message\":\"%s\",\"path\":\"%s\"}",
                Instant.now().toString(),
                message.replace("\"", "\\\""),
                request.getRequestURI().replace("\"", "\\\"")
        );

        response.getWriter().write(jsonResponse);
    }

    private String getClientIp(HttpServletRequest request) {
        String xfHeader = request.getHeader("X-Forwarded-For");
        if (xfHeader == null || xfHeader.isEmpty()) {
            return request.getRemoteAddr();
        }
        return xfHeader.split(",")[0].trim();
    }

    private static class RequestBucket {
        final long windowStart;
        final AtomicInteger count;

        RequestBucket(long windowStart, AtomicInteger count) {
            this.windowStart = windowStart;
            this.count = count;
        }
    }
}
