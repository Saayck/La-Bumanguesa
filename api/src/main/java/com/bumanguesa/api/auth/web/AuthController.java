package com.bumanguesa.api.auth.web;

import com.bumanguesa.api.auth.service.JwtService;

import com.bumanguesa.api.auth.dto.LoginRequest;
import com.bumanguesa.api.auth.dto.LoginResponse;
import com.bumanguesa.api.auth.dto.MeResponse;
import jakarta.validation.Valid;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * Authentication endpoints.
 * <ul>
 *   <li>POST /api/auth/login — public, exchanges credentials for a JWT.</li>
 *   <li>GET  /api/auth/me    — authenticated, returns the current admin.</li>
 * </ul>
 */
@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthenticationManager authenticationManager;
    private final JwtService jwtService;

    public AuthController(AuthenticationManager authenticationManager, JwtService jwtService) {
        this.authenticationManager = authenticationManager;
        this.jwtService = jwtService;
    }

    @PostMapping("/login")
    public LoginResponse login(@Valid @RequestBody LoginRequest request) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.username(), request.password()));

        String role = extractRole(authentication);
        String token = jwtService.generateToken(authentication.getName(), role);
        return new LoginResponse(token, "Bearer", authentication.getName(), role, jwtService.getExpirationMs());
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
}
