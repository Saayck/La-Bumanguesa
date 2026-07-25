package com.bumanguesa.api.auth.web;

import com.bumanguesa.api.auth.dto.LoginRequest;
import com.bumanguesa.api.auth.dto.LoginResponse;
import com.bumanguesa.api.auth.dto.MeResponse;
import com.bumanguesa.api.auth.service.JwtService;
import com.bumanguesa.api.common.security.SecurityAuditLogger;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * Authentication endpoints with OWASP A09 Audit Logging.
 */
@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthenticationManager authenticationManager;
    private final JwtService jwtService;
    private final SecurityAuditLogger auditLogger;

    public AuthController(AuthenticationManager authenticationManager,
                          JwtService jwtService,
                          SecurityAuditLogger auditLogger) {
        this.authenticationManager = authenticationManager;
        this.jwtService = jwtService;
        this.auditLogger = auditLogger;
    }

    @PostMapping("/login")
    public LoginResponse login(@Valid @RequestBody LoginRequest request, HttpServletRequest httpRequest) {
        String clientIp = getClientIp(httpRequest);
        try {
            Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(request.username(), request.password()));

            String role = extractRole(authentication);
            String token = jwtService.generateToken(authentication.getName(), role);

            auditLogger.logLoginSuccess(request.username(), clientIp);

            return new LoginResponse(token, "Bearer", authentication.getName(), role, jwtService.getExpirationMs());
        } catch (AuthenticationException ex) {
            auditLogger.logLoginFailure(request.username(), clientIp, ex.getMessage());
            throw ex;
        }
    }

    @GetMapping("/me")
    public MeResponse me(Authentication authentication) {
        return new MeResponse(authentication.getName(), extractRole(authentication));
    }

    private String extractRole(Authentication authentication) {
        return authentication.getAuthorities().stream()
                .map(GrantedAuthority::getAuthority)
                .findFirst()
                .map(a -> a.startsWith("ROLE_") ? a.substring(5) : a)
                .orElse("ADMIN");
    }

    private String getClientIp(HttpServletRequest request) {
        String xf = request.getHeader("X-Forwarded-For");
        if (xf == null || xf.isEmpty()) {
            return request.getRemoteAddr();
        }
        return xf.split(",")[0].trim();
    }
}
