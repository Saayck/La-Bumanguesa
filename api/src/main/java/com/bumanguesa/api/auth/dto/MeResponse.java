package com.bumanguesa.api.auth.dto;

/** Identity of the currently authenticated admin. */
public record MeResponse(String username, String role) {
}
