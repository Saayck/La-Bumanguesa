package com.bumanguesa.api.menu.service;

import com.bumanguesa.api.common.exception.ResourceNotFoundException;
import com.bumanguesa.api.menu.domain.MenuExtra;
import com.bumanguesa.api.menu.dto.MenuExtraRequest;
import com.bumanguesa.api.menu.dto.MenuExtraResponse;
import com.bumanguesa.api.menu.repository.MenuExtraRepository;
import java.util.List;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/** Fuente única de los adicionales para la web, el modal de pedido y la IA. */
@Service
@Transactional(readOnly = true)
public class MenuExtraService {

    private final MenuExtraRepository repository;

    public MenuExtraService(MenuExtraRepository repository) {
        this.repository = repository;
    }

    public List<MenuExtraResponse> listActive() {
        return repository.findByActiveTrueOrderByOrderIndexAsc().stream()
                .map(e -> MenuExtraResponse.of(e.getId(), e.getName(), e.getPrice(), e.getOrderIndex(), e.isActive()))
                .toList();
    }

    public List<MenuExtraResponse> listAll() {
        return repository.findAllByOrderByOrderIndexAsc().stream()
                .map(e -> MenuExtraResponse.of(e.getId(), e.getName(), e.getPrice(), e.getOrderIndex(), e.isActive()))
                .toList();
    }

    public MenuExtraResponse getById(Long id) {
        MenuExtra extra = repository.findById(id)
                // ResourceNotFoundException -> 404. Con IllegalArgumentException
                // el GlobalExceptionHandler devolvía 400, que engaña al cliente.
                .orElseThrow(() -> new ResourceNotFoundException("Adicional no encontrado."));
        return MenuExtraResponse.of(extra.getId(), extra.getName(), extra.getPrice(), extra.getOrderIndex(), extra.isActive());
    }

    @Transactional
    public MenuExtraResponse create(MenuExtraRequest request) {
        MenuExtra extra = new MenuExtra();
        extra.setName(request.name().trim());
        extra.setPrice(request.price());
        extra.setOrderIndex(request.orderIndex());
        extra.setActive(request.active() == null || request.active());
        MenuExtra saved = repository.save(extra);
        return MenuExtraResponse.of(saved.getId(), saved.getName(), saved.getPrice(), saved.getOrderIndex(), saved.isActive());
    }

    @Transactional
    public MenuExtraResponse update(Long id, MenuExtraRequest request) {
        MenuExtra extra = repository.findById(id)
                // ResourceNotFoundException -> 404. Con IllegalArgumentException
                // el GlobalExceptionHandler devolvía 400, que engaña al cliente.
                .orElseThrow(() -> new ResourceNotFoundException("Adicional no encontrado."));
        extra.setName(request.name().trim());
        extra.setPrice(request.price());
        extra.setOrderIndex(request.orderIndex());
        if (request.active() != null) {
            extra.setActive(request.active());
        }
        return MenuExtraResponse.of(extra.getId(), extra.getName(), extra.getPrice(), extra.getOrderIndex(), extra.isActive());
    }

    @Transactional
    public void delete(Long id) {
        repository.deleteById(id);
    }

    /** Entidades activas, para construir el contexto del asistente. */
    public List<MenuExtra> activeExtras() {
        return repository.findByActiveTrueOrderByOrderIndexAsc();
    }
}

