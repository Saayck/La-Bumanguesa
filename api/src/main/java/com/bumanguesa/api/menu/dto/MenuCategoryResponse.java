package com.bumanguesa.api.menu.dto;

public record MenuCategoryResponse(
        Long id,
        String slug,
        String label,
        String icon,
        int orderIndex,
        boolean active
) {
    public static MenuCategoryResponse of(Long id, String slug, String label, String icon, int orderIndex, boolean active) {
        return new MenuCategoryResponse(id, slug, label, icon, orderIndex, active);
    }
}
