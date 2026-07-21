package com.bumanguesa.api.video.domain;

import com.bumanguesa.api.common.domain.Auditable;
import com.bumanguesa.api.common.domain.VideoPlatform;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/** A social video card (TikTok / Reels / Shorts). */
@Entity
@Table(name = "video")
@Getter
@Setter
@NoArgsConstructor
public class Video extends Auditable {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true, length = 80)
    private String slug;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private VideoPlatform platform;

    @Column(nullable = false, length = 40)
    private String label;

    @Column(name = "thumbnail_url", nullable = false, length = 500)
    private String thumbnailUrl;

    @Column(name = "accent_color", nullable = false, length = 30)
    private String accentColor;

    @Column(name = "offset_y", nullable = false)
    private int offsetY;

    @Column(nullable = false, length = 500)
    private String url;

    @Column(name = "order_index", nullable = false)
    private int orderIndex;

    @Column(nullable = false)
    private boolean active = true;
}
