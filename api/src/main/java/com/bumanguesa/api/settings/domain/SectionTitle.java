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

@Entity
@Table(name = "section_title")
@Getter
@Setter
@NoArgsConstructor
public class SectionTitle extends Auditable {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "section_key", nullable = false, unique = true, length = 50)
    private String sectionKey;

    /**
     * Se mapea a `leading_text`: `leading` es palabra reservada en PostgreSQL y
     * Hibernate generaría SQL inválido al consultarla sin comillas.
     */
    @Column(name = "leading_text", nullable = false, length = 100)
    private String leading;

    @Column(nullable = false, length = 100)
    private String highlight;

    @Column(nullable = false, length = 20)
    private String accent;

    @Column(nullable = false)
    private boolean active = true;
}
