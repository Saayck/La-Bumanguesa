package com.bumanguesa.api.common.domain;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonValue;

/**
 * Social platform of a video card. Serialized in lowercase to match the
 * Angular {@code VideoPlatform} type.
 */
public enum VideoPlatform {
    TIKTOK,
    INSTAGRAM,
    YOUTUBE;

    @JsonValue
    public String toJson() {
        return name().toLowerCase();
    }

    @JsonCreator
    public static VideoPlatform fromJson(String value) {
        if (value == null) {
            return null;
        }
        try {
            return VideoPlatform.valueOf(value.trim().toUpperCase());
        } catch (IllegalArgumentException ex) {
            throw new IllegalArgumentException(
                    "platform inválido: '" + value + "'. Valores permitidos: tiktok, instagram, youtube.");
        }
    }
}
