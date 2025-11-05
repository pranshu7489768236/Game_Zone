package com.colorprediction.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class GamePeriodResponse {
    private String periodId;
    private long timeLeftSeconds;
    private String winningColor;
    private Integer winningNumber;
    private boolean isCompleted;
}

