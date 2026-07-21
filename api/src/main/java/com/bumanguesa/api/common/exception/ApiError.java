package com.bumanguesa.api.common.exception;

import java.time.Instant;
import java.util.List;

/**
 * Standard error payload returned by the API.
 *
 * @param timestamp when the error happened
 * @param status    HTTP status code
 * @param error     HTTP status reason phrase
 * @param message   human readable summary
 * @param path      request path that failed
 * @param details   field-level validation messages (empty when not applicable)
 */
public record ApiError(
        Instant timestamp,
        int status,
        String error,
        String message,
        String path,
        List<FieldViolation> details) {

    public record FieldViolation(String field, String message) {}

    public static ApiError of(int status, String error, String message, String path) {
        return new ApiError(Instant.now(), status, error, message, path, List.of());
    }

    public static ApiError of(int status, String error, String message, String path,
                              List<FieldViolation> details) {
        return new ApiError(Instant.now(), status, error, message, path, details);
    }
}
