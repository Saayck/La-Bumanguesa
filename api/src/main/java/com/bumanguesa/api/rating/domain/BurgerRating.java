package com.bumanguesa.api.rating.domain;

import com.bumanguesa.api.common.domain.Auditable;
import com.bumanguesa.api.menu.domain.MenuItem;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "burger_rating")
@Getter
@Setter
@NoArgsConstructor
public class BurgerRating extends Auditable {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "item_id", nullable = false)
    private MenuItem item;

    @Column(nullable = false)
    private int stars;

    @Column(length = 500)
    private String comment;
}
