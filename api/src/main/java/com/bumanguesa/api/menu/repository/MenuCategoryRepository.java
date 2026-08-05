package com.bumanguesa.api.menu.repository;

import com.bumanguesa.api.menu.domain.MenuCategory;
import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;

public interface MenuCategoryRepository extends JpaRepository<MenuCategory, Long> {

    List<MenuCategory> findByActiveTrueOrderByOrderIndexAsc();

    List<MenuCategory> findAllByOrderByOrderIndexAsc();

    Optional<MenuCategory> findBySlug(String slug);
}
