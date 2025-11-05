package com.colorprediction.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class PredictionRequest {
    @NotBlank(message = "Period ID is required")
    private String periodId;
    
    @NotBlank(message = "Color is required")
    private String color;
    
    @NotNull(message = "Number is required")
    private Integer number;
}

