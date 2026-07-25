package com.bumanguesa.api.common.security;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;

/**
 * OWASP A09: Security Logging and Monitoring.
 * Centralized logger for security-relevant events (authentication, access control, mutations).
 */
@Component
public class SecurityAuditLogger {

    private static final Logger log = LoggerFactory.getLogger("SECURITY_AUDIT");

    public void logLoginSuccess(String username, String clientIp) {
        log.info("[AUDIT-SUCCESS] Login exitoso para el usuario '{}' desde IP: {}", username, sanitize(clientIp));
    }

    public void logLoginFailure(String username, String clientIp, String reason) {
        log.warn("[AUDIT-FAILURE] Fallo de login para el usuario '{}' desde IP: {} - Razón: {}",
                sanitize(username), sanitize(clientIp), sanitize(reason));
    }

    public void logUnauthorizedAccess(String requestUri, String clientIp) {
        log.warn("[AUDIT-UNAUTHORIZED] Intento de acceso no autorizado a URI '{}' desde IP: {}",
                sanitize(requestUri), sanitize(clientIp));
    }

    public void logResourceMutation(String resourceType, String identifier, String username, String clientIp, String action) {
        log.info("[AUDIT-MUTATION] Recurso {} '{}' {} por el usuario '{}' desde IP: {}",
                resourceType, identifier, action, username, sanitize(clientIp));
    }

    private String sanitize(String input) {
        if (input == null) return "UNKNOWN";
        return input.replaceAll("[\r\n]", "_"); // Prevent log injection / CRLF injection
    }
}
