package com.bumanguesa.api.settings.dto;

/**
 * Public site configuration. Shape matches the Angular {@code SiteConfig}
 * interface (nested {@code hours}) plus the marquee content.
 */
public record SiteSettingResponse(
        String brand,
        String city,
        String country,
        String whatsappNumber,
        String whatsappDisplay,
        String defaultOrderMessage,
        boolean showPromoBar,
        String facebookUrl,
        String instagramUrl,
        String tiktokUrl,
        Hours hours,
        int copyrightYear,
        Marquee marquee) {

    public record Hours(String weekdays, String weekend) {}

    public record Marquee(String text, int durationSeconds) {}
}
