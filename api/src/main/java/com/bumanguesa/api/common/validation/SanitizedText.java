package com.bumanguesa.api.common.validation;

import jakarta.validation.Constraint;
import jakarta.validation.Payload;
import java.lang.annotation.Documented;
import java.lang.annotation.ElementType;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;

/**
 * OWASP A03: XSS & Code Injection Prevention.
 * Disallows dangerous script tags or event handlers in text inputs.
 */
@Documented
@Constraint(validatedBy = SanitizedTextValidator.class)
@Target({ElementType.FIELD, ElementType.PARAMETER})
@Retention(RetentionPolicy.RUNTIME)
public @interface SanitizedText {
    String message() default "contiene caracteres o scripts potencialmente peligrosos";
    Class<?>[] groups() default {};
    Class<? extends Payload>[] payload() default {};
}
