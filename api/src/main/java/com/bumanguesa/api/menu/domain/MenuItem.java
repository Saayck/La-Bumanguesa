package com.bumanguesa.api.menu.domain;

import com.bumanguesa.api.common.domain.Auditable;
import com.bumanguesa.api.common.domain.BrandAccent;
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

/** A menu highlight card (burgers, salchipapas, combos...). */
@Entity
@Table(name = "menu_item")
@Getter
@Setter
@NoArgsConstructor
public class MenuItem extends Auditable {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true, length = 80)
    private String slug;

    @Column(nullable = false, length = 120)
    private String title;

    @Column(nullable = false, length = 500)
    private String description;

    @Column(name = "image_url", nullable = false, length = 500)
    private String imageUrl;

    @Column(nullable = false, length = 60)
    private String badge;

    @Column(name = "badge_rotation", nullable = false)
    private int badgeRotation;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 10)
    private BrandAccent accent;

    @Column(name = "cta_label", nullable = false, length = 60)
    private String ctaLabel;

    @Column(name = "order_index", nullable = false)
    private int orderIndex;

    @Column(nullable = false)
    private boolean active = true;
}
