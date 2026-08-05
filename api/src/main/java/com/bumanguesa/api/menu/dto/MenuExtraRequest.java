package com.bumanguesa.api.menu.dto;

import com.bumanguesa.api.common.validation.SanitizedText;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.math.BigDecimal;

public record MenuExtraRequest(
        @NotBlank @SanitizedText String name,
        @NotNull @DecimalMin("0.00") BigDecimal price,
        @NotNull Integer orderIndex,
        Boolean active
) {}
