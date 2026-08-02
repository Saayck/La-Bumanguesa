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

    /**
     * OWASP LLM01: intento de inyección de prompt detectado en la entrada.
     * Se registra un extracto acotado para poder ajustar los patrones sin volcar
     * texto arbitrario del usuario en los logs.
     */
    public void logPromptInjectionAttempt(String feature, String message) {
        String excerpt = message == null ? "" : message.substring(0, Math.min(message.length(), 160));
        log.warn("[AUDIT-AI-INJECTION] Intento de inyección de prompt bloqueado en '{}'. Extracto: '{}'",
                sanitize(feature), sanitize(excerpt));
    }

    /**
     * OWASP LLM01: el clasificador semántico detectó una inyección que el filtro
     * por patrones no vio (paráfrasis o idioma no cubierto). Vigilar estos
     * registros es lo que permite ampliar los patrones con casos reales.
     */
    public void logSemanticInjectionAttempt(String feature, String message) {
        String excerpt = message == null ? "" : message.substring(0, Math.min(message.length(), 160));
        log.warn("[AUDIT-AI-SEMANTIC] Inyección detectada por similitud semántica en '{}' "
                + "(el filtro por patrones no la cubría). Extracto: '{}'",
                sanitize(feature), sanitize(excerpt));
    }

    /**
     * OWASP LLM02: la respuesta del modelo arrastraba contexto interno y se
     * descartó antes de llegar al cliente. Señal fuerte: revisar de inmediato.
     */
    public void logContextLeakBlocked(String feature) {
        log.error("[AUDIT-AI-LEAK] Respuesta bloqueada en '{}': contenía marcadores del contexto interno.",
                sanitize(feature));
    }

    private String sanitize(String input) {
        if (input == null) return "UNKNOWN";
        return input.replaceAll("[\r\n]", "_"); // Prevent log injection / CRLF injection
    }
}
