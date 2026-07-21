package com.bumanguesa.api.location.repository;

import com.bumanguesa.api.location.domain.Location;

import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;

public interface LocationRepository extends JpaRepository<Location, Long> {

    List<Location> findByActiveTrueOrderByOrderIndexAsc();

    List<Location> findAllByOrderByOrderIndexAsc();

    Optional<Location> findBySlug(String slug);

    boolean existsBySlug(String slug);
}
