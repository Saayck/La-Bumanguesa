package com.bumanguesa.api.common.exception;

/**
 * Thrown when creating/updating an entity would violate a uniqueness rule
 * (e.g. a duplicated slug). Mapped to HTTP 409 by {@link GlobalExceptionHandler}.
 */
public class DuplicateResourceException extends RuntimeException {

    public DuplicateResourceException(String message) {
        super(message);
    }
}
