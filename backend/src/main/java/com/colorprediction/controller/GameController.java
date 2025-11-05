package com.colorprediction.controller;

import com.colorprediction.dto.*;
import com.colorprediction.model.GamePeriod;
import com.colorprediction.model.User;
import com.colorprediction.model.UserPrediction;
import com.colorprediction.repository.GamePeriodRepository;
import com.colorprediction.service.AuthService;
import com.colorprediction.service.GameService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/game")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:4200")
public class GameController {
    
    private final GameService gameService;
    private final AuthService authService;
    private final GamePeriodRepository periodRepository;
    
    @GetMapping("/period")
    public ResponseEntity<GamePeriodResponse> getCurrentPeriod() {
        GamePeriod period = gameService.getCurrentPeriod();
        long timeLeft = gameService.getTimeLeftSeconds(period);
        
        return ResponseEntity.ok(new GamePeriodResponse(
                period.getPeriodId(),
                timeLeft,
                period.getWinningColor(),
                period.getWinningNumber(),
                period.getIsCompleted()
        ));
    }
    
    @PostMapping("/submit")
    public ResponseEntity<?> submitPrediction(
            @Valid @RequestBody PredictionRequest request,
            Authentication authentication) {
        try {
            String mobileNumber = authentication.getName();
            User user = authService.getUserByMobileNumber(mobileNumber);
            
            if (user == null) {
                return ResponseEntity.badRequest().body("User not found");
            }
            
            UserPrediction prediction = gameService.submitPrediction(
                    user,
                    request.getPeriodId(),
                    request.getColor(),
                    request.getNumber()
            );
            
            return ResponseEntity.ok(new AuthResponse(null, "Prediction submitted successfully", true));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(new AuthResponse(null, e.getMessage(), false));
        }
    }
    
    @GetMapping("/history")
    public ResponseEntity<List<PredictionHistoryResponse>> getHistory(Authentication authentication) {
        String mobileNumber = authentication.getName();
        User user = authService.getUserByMobileNumber(mobileNumber);
        
        if (user == null) {
            return ResponseEntity.notFound().build();
        }
        
        List<UserPrediction> predictions = gameService.getUserHistory(user);
        
        List<PredictionHistoryResponse> history = predictions.stream()
                .map(p -> {
                    GamePeriod period = p.getPeriod();
                    return new PredictionHistoryResponse(
                            p.getId(),
                            period != null ? period.getPeriodId() : "N/A",
                            p.getChosenColor(),
                            p.getChosenNumber(),
                            p.getStatus(),
                            p.getCreatedAt(),
                            period != null ? period.getWinningColor() : null,
                            period != null ? period.getWinningNumber() : null
                    );
                })
                .collect(Collectors.toList());
        
        return ResponseEntity.ok(history);
    }
    
    @GetMapping("/recent-periods")
    public ResponseEntity<List<GamePeriodResponse>> getRecentPeriods() {
        List<GamePeriod> periods = gameService.getRecentHistory();
        
        List<GamePeriodResponse> responses = periods.stream()
                .map(p -> new GamePeriodResponse(
                        p.getPeriodId(),
                        0,
                        p.getWinningColor(),
                        p.getWinningNumber(),
                        p.getIsCompleted()
                ))
                .collect(Collectors.toList());
        
        return ResponseEntity.ok(responses);
    }
}

