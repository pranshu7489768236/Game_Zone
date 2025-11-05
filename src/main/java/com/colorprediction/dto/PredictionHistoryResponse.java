package com.colorprediction.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class PredictionHistoryResponse {
    private Long id;
    private String periodId;
    private String chosenColor;
    private Integer chosenNumber;
    private String status;
    private LocalDateTime createdAt;
    private String winningColor;
    private Integer winningNumber;
}

