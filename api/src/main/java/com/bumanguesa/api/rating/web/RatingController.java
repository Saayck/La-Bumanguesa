package com.bumanguesa.api.rating.web;

import com.bumanguesa.api.rating.dto.RatingRequest;
import com.bumanguesa.api.rating.dto.RatingStatsResponse;
import com.bumanguesa.api.rating.service.LocalAiRankingService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/ratings")
public class RatingController {

    private final LocalAiRankingService rankingService;

    public RatingController(LocalAiRankingService rankingService) {
        this.rankingService = rankingService;
    }

    @PostMapping
    public ResponseEntity<Void> submitRating(@Valid @RequestBody RatingRequest request) {
        rankingService.submitRating(request);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/ranking")
    public ResponseEntity<RatingStatsResponse> getAiRanking() {
        return ResponseEntity.ok(rankingService.getAiRankingStats());
    }
}
