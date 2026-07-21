package com.bumanguesa.api.video.repository;

import com.bumanguesa.api.video.domain.Video;

import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;

public interface VideoRepository extends JpaRepository<Video, Long> {

    List<Video> findByActiveTrueOrderByOrderIndexAsc();

    List<Video> findAllByOrderByOrderIndexAsc();

    Optional<Video> findBySlug(String slug);

    boolean existsBySlug(String slug);
}
