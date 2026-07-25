package com.bumanguesa.api.auth.service;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import java.nio.charset.StandardCharsets;
import java.util.Date;
import javax.crypto.SecretKey;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

/**
 * OWASP A02: Hardened HS256 JWT Token Issuer and Validator.
 */
@Service
public class JwtService {

    private static final Logger log = LoggerFactory.getLogger(JwtService.class);
    private static final String DEFAULT_SECRET = "cambia-esta-clave-super-secreta-de-al-menos-32-bytes-en-produccion";

    private final SecretKey key;
    private final long expirationMs;

    public JwtService(
            @Value("${app.jwt.secret:cambia-esta-clave-super-secreta-de-al-menos-32-bytes-en-produccion}") String secret,
            @Value("${app.jwt.expiration-ms:86400000}") long expirationMs) {

        byte[] secretBytes = secret.getBytes(StandardCharsets.UTF_8);

        if (secretBytes.length < 32) {
            throw new IllegalArgumentException("SECURITY ERROR: app.jwt.secret debe tener al menos 32 bytes (256 bits).");
        }

        if (DEFAULT_SECRET.equals(secret)) {
            log.warn("SECURITY WARNING [OWASP A02]: Se está utilizando la clave JWT secreta predeterminada. " +
                     "Configura la variable de entorno JWT_SECRET en entornos de producción.");
        }

        this.key = Keys.hmacShaKeyFor(secretBytes);
        this.expirationMs = expirationMs;
    }

    public long getExpirationMs() {
        return expirationMs;
    }

    public String generateToken(String username, String role) {
        Date now = new Date();
        return Jwts.builder()
                .subject(username)
                .claim("role", role)
                .issuedAt(now)
                .expiration(new Date(now.getTime() + expirationMs))
                .signWith(key)
                .compact();
    }

    /** @return the username (subject) if the token is valid, otherwise null. */
    public String extractUsername(String token) {
        try {
            return parse(token).getSubject();
        } catch (Exception ex) {
            return null;
        }
    }

    private Claims parse(String token) {
        return Jwts.parser()
                .verifyWith(key)
                .build()
                .parseSignedClaims(token)
                .getPayload();
    }
}
