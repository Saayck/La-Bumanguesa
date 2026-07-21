package com.bumanguesa.api.auth.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

/** Credentials submitted to the login endpoint. */
public record LoginRequest(
        @NotBlank @Size(max = 60) String username,
        @NotBlank @Size(max = 100) String password) {
}
