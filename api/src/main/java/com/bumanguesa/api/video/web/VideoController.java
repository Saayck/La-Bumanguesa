package com.bumanguesa.api.video.web;

import com.bumanguesa.api.video.service.VideoService;

import com.bumanguesa.api.video.dto.VideoRequest;
import com.bumanguesa.api.video.dto.VideoResponse;
import jakarta.validation.Valid;
import java.net.URI;
import java.util.List;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class VideoController {

    private final VideoService service;

    public VideoController(VideoService service) {
        this.service = service;
    }

    @GetMapping("/api/videos")
    public List<VideoResponse> listPublic() {
        return service.listPublic();
    }

    @GetMapping("/api/admin/videos")
    public List<VideoResponse> listAll() {
        return service.listAll();
    }

    @GetMapping("/api/admin/videos/{slug}")
    public VideoResponse getBySlug(@PathVariable String slug) {
        return service.getBySlug(slug);
    }

    @PostMapping("/api/admin/videos")
    public ResponseEntity<VideoResponse> create(@Valid @RequestBody VideoRequest request) {
        VideoResponse created = service.create(request);
        return ResponseEntity.created(URI.create("/api/admin/videos/" + created.id())).body(created);
    }

    @PutMapping("/api/admin/videos/{slug}")
    public VideoResponse update(@PathVariable String slug, @Valid @RequestBody VideoRequest request) {
        return service.update(slug, request);
    }

    @DeleteMapping("/api/admin/videos/{slug}")
    public ResponseEntity<Void> delete(@PathVariable String slug) {
        service.delete(slug);
        return ResponseEntity.noContent().build();
    }
}
