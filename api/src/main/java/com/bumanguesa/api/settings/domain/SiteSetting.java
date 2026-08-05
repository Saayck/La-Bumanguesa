package com.bumanguesa.api.settings.domain;

import com.bumanguesa.api.common.domain.Auditable;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;

/**
 * Global, single-row site configuration (brand, contact, social links, hours,
 * promo bar, marquee and Yape/Plin payment details).
 */
@Entity
@Table(name = "site_setting")
@Getter
@Setter
@NoArgsConstructor
public class SiteSetting extends Auditable {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 80)
    private String brand;

    @Column(nullable = false, length = 80)
    private String city;

    @Column(nullable = false, length = 80)
    private String country;

    @Column(name = "whatsapp_number", nullable = false, length = 15)
    private String whatsappNumber;

    @Column(name = "whatsapp_display", nullable = false, length = 40)
    private String whatsappDisplay;

    @Column(name = "default_order_message", nullable = false, length = 500)
    private String defaultOrderMessage;

    @Column(name = "show_promo_bar", nullable = false)
    private boolean showPromoBar;

    @Column(name = "facebook_url", nullable = false, length = 500)
    private String facebookUrl;

    @Column(name = "instagram_url", nullable = false, length = 500)
    private String instagramUrl;

    @Column(name = "tiktok_url", nullable = false, length = 500)
    private String tiktokUrl;

    @Column(name = "hours_weekdays", nullable = false, length = 60)
    private String hoursWeekdays;

    @Column(name = "hours_weekend", nullable = false, length = 60)
    private String hoursWeekend;

    @Column(name = "copyright_year", nullable = false)
    private int copyrightYear;

    @Column(name = "marquee_text", nullable = false, length = 500)
    private String marqueeText;

    @Column(name = "marquee_duration_seconds", nullable = false)
    private int marqueeDurationSeconds;

    @Column(name = "yape_qr_url", length = 500)
    private String yapeQrUrl;

    @Column(name = "yape_number", length = 40)
    private String yapeNumber;

    @Column(name = "yape_holder", length = 120)
    private String yapeHolder;

    @Column(name = "takeaway_fee", nullable = false, precision = 8, scale = 2)
    private BigDecimal takeawayFee = new BigDecimal("1.00");
}

