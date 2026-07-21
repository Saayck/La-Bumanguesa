package com.bumanguesa.api.menu.repository;

import com.bumanguesa.api.menu.domain.MenuItem;

import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;

public interface MenuItemRepository extends JpaRepository<MenuItem, Long> {

    List<MenuItem> findByActiveTrueOrderByOrderIndexAsc();

    List<MenuItem> findAllByOrderByOrderIndexAsc();

    Optional<MenuItem> findBySlug(String slug);

    boolean existsBySlug(String slug);
}
