package com.bumanguesa.api.settings.dto;

import java.math.BigDecimal;

/**
 * Public site configuration. Shape matches the Angular {@code SiteConfig}
 * interface plus marquee and Yape/Plin payment details.
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
        Marquee marquee,
        Payment payment,
        BigDecimal takeawayFee,
        java.util.Map<String, SectionTitleDto> sectionTitles) {

    public record Hours(String weekdays, String weekend) {}

    public record Marquee(String text, int durationSeconds) {}

    public record Payment(String yapeQrUrl, String yapeNumber, String yapeHolder) {}

    public record SectionTitleDto(String sectionKey, String leading, String highlight, String accent) {}
}


