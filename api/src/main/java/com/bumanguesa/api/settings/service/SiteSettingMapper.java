package com.bumanguesa.api.settings.service;

import com.bumanguesa.api.settings.domain.SiteSetting;
import com.bumanguesa.api.settings.dto.SiteSettingRequest;
import com.bumanguesa.api.settings.dto.SiteSettingResponse;

/** Maps between {@link SiteSetting} entities and their DTOs. */
final class SiteSettingMapper {

    private SiteSettingMapper() {
    }

    static SiteSettingResponse toResponse(SiteSetting e) {
        return new SiteSettingResponse(
                e.getBrand(),
                e.getCity(),
                e.getCountry(),
                e.getWhatsappNumber(),
                e.getWhatsappDisplay(),
                e.getDefaultOrderMessage(),
                e.isShowPromoBar(),
                e.getFacebookUrl(),
                e.getInstagramUrl(),
                e.getTiktokUrl(),
                new SiteSettingResponse.Hours(e.getHoursWeekdays(), e.getHoursWeekend()),
                e.getCopyrightYear(),
                new SiteSettingResponse.Marquee(e.getMarqueeText(), e.getMarqueeDurationSeconds()),
                new SiteSettingResponse.Payment(
                        e.getYapeQrUrl() != null ? e.getYapeQrUrl() : "https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=YAPE-LA-BUMANGUESA-989451473",
                        e.getYapeNumber() != null ? e.getYapeNumber() : "989 451 473",
                        e.getYapeHolder() != null ? e.getYapeHolder() : "La Bumanguesa Ica"
                ));
    }

    /** Copies all editable fields from the request onto the entity. */
    static void apply(SiteSetting e, SiteSettingRequest r) {
        e.setBrand(r.brand());
        e.setCity(r.city());
        e.setCountry(r.country());
        e.setWhatsappNumber(r.whatsappNumber());
        e.setWhatsappDisplay(r.whatsappDisplay());
        e.setDefaultOrderMessage(r.defaultOrderMessage());
        e.setShowPromoBar(r.showPromoBar());
        e.setFacebookUrl(r.facebookUrl());
        e.setInstagramUrl(r.instagramUrl());
        e.setTiktokUrl(r.tiktokUrl());
        e.setHoursWeekdays(r.hoursWeekdays());
        e.setHoursWeekend(r.hoursWeekend());
        e.setCopyrightYear(r.copyrightYear());
        e.setMarqueeText(r.marqueeText());
        e.setMarqueeDurationSeconds(r.marqueeDurationSeconds());

        if (r.yapeQrUrl() != null) e.setYapeQrUrl(r.yapeQrUrl());
        if (r.yapeNumber() != null) e.setYapeNumber(r.yapeNumber());
        if (r.yapeHolder() != null) e.setYapeHolder(r.yapeHolder());
    }
}
