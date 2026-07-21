package com.bumanguesa.api.auth.dto;

/** Successful login result: the bearer token and account info. */
public record LoginResponse(
        String token,
        String tokenType,
        String username,
        String role,
        long expiresInMs) {
}
