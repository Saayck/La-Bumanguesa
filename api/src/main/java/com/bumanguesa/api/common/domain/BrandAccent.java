package com.bumanguesa.api.common.domain;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonValue;

/**
 * Brand accent color used across menu cards and locations.
 * Serialized to/from JSON in lowercase to match the Angular {@code BrandAccent} type.
 */
public enum BrandAccent {
    YELLOW,
    PINK,
    GREEN;

    @JsonValue
    public String toJson() {
        return name().toLowerCase();
    }

    @JsonCreator
    public static BrandAccent fromJson(String value) {
        if (value == null) {
            return null;
        }
        try {
            return BrandAccent.valueOf(value.trim().toUpperCase());
        } catch (IllegalArgumentException ex) {
            throw new IllegalArgumentException(
                    "accent inválido: '" + value + "'. Valores permitidos: yellow, pink, green.");
        }
    }
}
