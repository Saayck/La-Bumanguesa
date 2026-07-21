package com.bumanguesa.api.hero.repository;

import com.bumanguesa.api.hero.domain.HeroSlide;

import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

public interface HeroSlideRepository extends JpaRepository<HeroSlide, Long> {

    List<HeroSlide> findByActiveTrueOrderByOrderIndexAsc();

    List<HeroSlide> findAllByOrderByOrderIndexAsc();
}
