package com.bumanguesa.api.rating.service;

import com.bumanguesa.api.common.exception.ResourceNotFoundException;
import com.bumanguesa.api.menu.domain.MenuItem;
import com.bumanguesa.api.menu.repository.MenuItemRepository;
import com.bumanguesa.api.rating.domain.BurgerRating;
import com.bumanguesa.api.rating.dto.RatingRequest;
import com.bumanguesa.api.rating.dto.RatingStatsResponse;
import com.bumanguesa.api.rating.dto.RatingStatsResponse.ItemRankDto;
import com.bumanguesa.api.rating.repository.BurgerRatingRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.Comparator;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * Local AI & Bayesian Ranking Service:
 * Calculates intelligent popularity rankings based on 1-5 star ratings, vote weights,
 * and Bayesian inference: Score = (v * R + m * C) / (v + m).
 */
@Service
@Transactional(readOnly = true)
public class LocalAiRankingService {

    private final BurgerRatingRepository ratingRepository;
    private final MenuItemRepository menuItemRepository;

    public LocalAiRankingService(BurgerRatingRepository ratingRepository, MenuItemRepository menuItemRepository) {
        this.ratingRepository = ratingRepository;
        this.menuItemRepository = menuItemRepository;
    }

    @Transactional
    public void submitRating(RatingRequest request) {
        MenuItem item = menuItemRepository.findById(request.itemId())
                .orElseThrow(() -> new ResourceNotFoundException("Producto no encontrado."));

        BurgerRating rating = new BurgerRating();
        rating.setItem(item);
        rating.setStars(request.stars());
        rating.setComment(request.comment() != null ? request.comment() : "");
        ratingRepository.save(rating);
    }

    public RatingStatsResponse getAiRankingStats() {
        List<MenuItem> allItems = menuItemRepository.findAll();
        List<Object[]> rawStats = ratingRepository.findAverageAndCountPerItem();

        Map<Long, Double> avgMap = new HashMap<>();
        Map<Long, Long> countMap = new HashMap<>();

        long totalVotes = 0;
        double sumStars = 0;

        for (Object[] row : rawStats) {
            Long itemId = (Long) row[0];
            Double avg = (Double) row[1];
            Long count = (Long) row[2];

            avgMap.put(itemId, avg != null ? avg : 5.0);
            countMap.put(itemId, count != null ? count : 0L);

            totalVotes += (count != null ? count : 0L);
            sumStars += (avg != null ? avg : 5.0) * (count != null ? count : 0L);
        }

        double globalMean = totalVotes > 0 ? (sumStars / totalVotes) : 4.8;
        double minVotesThreshold = 2.0; // Bayesian prior smoothing constant

        List<ItemRankDto> rankings = new ArrayList<>();

        for (MenuItem item : allItems) {
            double v = countMap.getOrDefault(item.getId(), 1L);
            double R = avgMap.getOrDefault(item.getId(), 5.0);

            // Bayesian Weighted AI Rating formula
            double bayesianScore = (v * R + minVotesThreshold * globalMean) / (v + minVotesThreshold);

            String aiBadge = bayesianScore >= 4.7 ? "🔥 TOP #1 FAVORITO"
                    : bayesianScore >= 4.3 ? "⭐ RECOMENDADO IA"
                    : "👍 POPULAR";

            rankings.add(new ItemRankDto(
                    item.getId(),
                    item.getTitle(),
                    Math.round(R * 10.0) / 10.0,
                    (long) v,
                    Math.round(bayesianScore * 100.0) / 100.0,
                    aiBadge
            ));
        }

        rankings.sort(Comparator.comparingDouble(ItemRankDto::bayesianAiScore).reversed());

        String aiSummary = String.format("Motor de IA Local v1.0 — %d calificaciones procesadas. Algoritmo Bayesiano Ponderado activo.", totalVotes);

        return new RatingStatsResponse(
                totalVotes,
                Math.round(globalMean * 10.0) / 10.0,
                rankings,
                aiSummary
        );
    }
}
