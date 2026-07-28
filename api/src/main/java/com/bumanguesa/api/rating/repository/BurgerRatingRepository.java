package com.bumanguesa.api.rating.repository;

import com.bumanguesa.api.rating.domain.BurgerRating;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface BurgerRatingRepository extends JpaRepository<BurgerRating, Long> {

    @Query("SELECT r.item.id, AVG(r.stars), COUNT(r.id) FROM BurgerRating r GROUP BY r.item.id")
    List<Object[]> findAverageAndCountPerItem();

    List<BurgerRating> findTop50ByOrderByCreatedAtDesc();
}
