package com.bumanguesa.api.settings.dto;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

/**
 * Payload to update the global site configuration. Every field is validated.
 */
public record SiteSettingRequest(
        @NotBlank @Size(max = 80) String brand,
        @NotBlank @Size(max = 80) String city,
        @NotBlank @Size(max = 80) String country,

        @NotBlank
        @Pattern(regexp = "\\d{8,15}", message = "debe contener solo dígitos (8 a 15)")
        String whatsappNumber,

        @NotBlank @Size(max = 40) String whatsappDisplay,
        @NotBlank @Size(max = 500) String defaultOrderMessage,

        @NotNull Boolean showPromoBar,

        @NotBlank @Size(max = 500) String facebookUrl,
        @NotBlank @Size(max = 500) String instagramUrl,
        @NotBlank @Size(max = 500) String tiktokUrl,

        @NotBlank @Size(max = 60) String hoursWeekdays,
        @NotBlank @Size(max = 60) String hoursWeekend,

        @NotNull @Min(2000) @Max(2100) Integer copyrightYear,

        @NotBlank @Size(max = 500) String marqueeText,
        @NotNull @Min(5) @Max(120) Integer marqueeDurationSeconds) {
}
