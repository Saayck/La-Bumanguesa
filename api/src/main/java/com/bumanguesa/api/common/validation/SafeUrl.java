package com.bumanguesa.api.common.validation;

import jakarta.validation.Constraint;
import jakarta.validation.Payload;
import java.lang.annotation.Documented;
import java.lang.annotation.ElementType;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;

/**
 * OWASP A10: SSRF Prevention Validator.
 * Ensures the target string is a valid HTTP/HTTPS URL and does not point to internal/private IPs.
 */
@Documented
@Constraint(validatedBy = SafeUrlValidator.class)
@Target({ElementType.FIELD, ElementType.PARAMETER})
@Retention(RetentionPolicy.RUNTIME)
public @interface SafeUrl {
    String message() default "debe ser una URL válida y segura (http/https sin direcciones privadas)";
    Class<?>[] groups() default {};
    Class<? extends Payload>[] payload() default {};
}
