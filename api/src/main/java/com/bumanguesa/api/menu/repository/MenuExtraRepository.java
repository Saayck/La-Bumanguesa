package com.bumanguesa.api.menu.repository;

import com.bumanguesa.api.menu.domain.MenuExtra;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

public interface MenuExtraRepository extends JpaRepository<MenuExtra, Long> {

    List<MenuExtra> findByActiveTrueOrderByOrderIndexAsc();

    List<MenuExtra> findAllByOrderByOrderIndexAsc();
}

