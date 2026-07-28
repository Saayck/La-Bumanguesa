package com.bumanguesa.api.rating.dto;

import java.util.List;

public record RatingStatsResponse(
        long totalRatings,
        double globalAverageStars,
        List<ItemRankDto> rankings,
        String aiModelSummary
) {
    public record ItemRankDto(
            Long itemId,
            String title,
            double averageStars,
            long voteCount,
            double bayesianAiScore,
            String aiBadge
    ) {}
}
