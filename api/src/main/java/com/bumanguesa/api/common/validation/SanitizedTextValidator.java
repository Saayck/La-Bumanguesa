package com.bumanguesa.api.common.validation;

import jakarta.validation.ConstraintValidator;
import jakarta.validation.ConstraintValidatorContext;
import java.util.regex.Pattern;

/**
 * Validates text inputs against inline script tags, javascript URIs, and dangerous HTML handlers.
 */
public class SanitizedTextValidator implements ConstraintValidator<SanitizedText, String> {

    private static final Pattern DANGEROUS_PATTERNS = Pattern.compile(
            "(?i)<script|javascript:|onload\\s*=|onerror\\s*=|onclick\\s*=|eval\\(|document\\.cookie",
            Pattern.CASE_INSENSITIVE
    );

    @Override
    public boolean isValid(String value, ConstraintValidatorContext context) {
        if (value == null || value.trim().isEmpty()) {
            return true;
        }

        return !DANGEROUS_PATTERNS.matcher(value).find();
    }
}
