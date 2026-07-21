package com.bumanguesa.api.location.domain;

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

/** A physical store location with an embedded Google Maps URL. */
@Entity
@Table(name = "location")
@Getter
@Setter
@NoArgsConstructor
public class Location extends Auditable {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true, length = 80)
    private String slug;

    @Column(nullable = false, length = 120)
    private String name;

    @Column(nullable = false, length = 200)
    private String address;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 10)
    private BrandAccent accent;

    @Column(name = "map_embed_url", nullable = false, length = 2000)
    private String mapEmbedUrl;

    @Column(name = "order_index", nullable = false)
    private int orderIndex;

    @Column(nullable = false)
    private boolean active = true;
}
