package com.colorprediction.service;

import com.colorprediction.model.GamePeriod;
import com.colorprediction.model.User;
import com.colorprediction.model.UserPrediction;
import com.colorprediction.model.Wallet;
import com.colorprediction.repository.GamePeriodRepository;
import com.colorprediction.repository.UserPredictionRepository;
import com.colorprediction.repository.WalletRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Random;

@Service
@RequiredArgsConstructor
public class GameService {
    
    private final GamePeriodRepository periodRepository;
    private final UserPredictionRepository predictionRepository;
    private final WalletRepository walletRepository;
    private final Random random = new Random();
    
    private static final String[] COLORS = {"GREEN", "VIOLET", "RED"};
    private static final int PERIOD_DURATION_MINUTES = 3;
    
    public GamePeriod getCurrentPeriod() {
        return periodRepository.findCurrentPeriod()
                .orElseGet(this::createNewPeriod);
    }
    
    @Transactional
    public GamePeriod createNewPeriod() {
        String periodId = generatePeriodId();
        LocalDateTime now = LocalDateTime.now();
        LocalDateTime endTime = now.plusMinutes(PERIOD_DURATION_MINUTES);
        
        GamePeriod period = new GamePeriod();
        period.setPeriodId(periodId);
        period.setStartTime(now);
        period.setEndTime(endTime);
        period.setIsCompleted(false);
        
        return periodRepository.save(period);
    }
    
    @Scheduled(fixedRate = 180000) // Every 3 minutes
    @Transactional
    public void completeCurrentPeriod() {
        periodRepository.findCurrentPeriod().ifPresent(period -> {
            if (LocalDateTime.now().isAfter(period.getEndTime())) {
                // Generate winning color and number
                String winningColor = COLORS[random.nextInt(COLORS.length)];
                int winningNumber = random.nextInt(10);
                
                period.setWinningColor(winningColor);
                period.setWinningNumber(winningNumber);
                period.setIsCompleted(true);
                periodRepository.save(period);
                
                // Process predictions and update wallets
                processPredictions(period);
                
                // Create new period
                createNewPeriod();
            }
        });
    }
    
    private void processPredictions(GamePeriod period) {
        List<UserPrediction> predictions = predictionRepository.findByPeriodAndStatus(period, "PENDING");
        
        for (UserPrediction prediction : predictions) {
            boolean isWin = prediction.getChosenColor().equalsIgnoreCase(period.getWinningColor()) &&
                           prediction.getChosenNumber().equals(period.getWinningNumber());
            
            prediction.setStatus(isWin ? "WIN" : "LOSS");
            predictionRepository.save(prediction);
            
            if (isWin) {
                // Award 2x the bet amount (assuming bet amount is stored separately)
                // For simplicity, we'll add a fixed win amount
                Wallet wallet = walletRepository.findByUser(prediction.getUser())
                        .orElseThrow(() -> new RuntimeException("Wallet not found"));
                wallet.setBalance(wallet.getBalance().add(BigDecimal.valueOf(100.00)));
                walletRepository.save(wallet);
            }
        }
    }
    
    public UserPrediction submitPrediction(User user, String periodId, String color, Integer number) {
        GamePeriod period = periodRepository.findByPeriodId(periodId)
                .orElseThrow(() -> new RuntimeException("Period not found"));
        
        if (period.getIsCompleted()) {
            throw new RuntimeException("Period already completed");
        }
        
        UserPrediction prediction = new UserPrediction();
        prediction.setUser(user);
        prediction.setPeriod(period);
        prediction.setChosenColor(color.toUpperCase());
        prediction.setChosenNumber(number);
        prediction.setStatus("PENDING");
        
        return predictionRepository.save(prediction);
    }
    
    public List<UserPrediction> getUserHistory(User user) {
        return predictionRepository.findByUserOrderByCreatedAtDesc(user);
    }
    
    public List<GamePeriod> getRecentHistory() {
        return periodRepository.findRecentCompletedPeriods(org.springframework.data.domain.PageRequest.of(0, 10));
    }
    
    private String generatePeriodId() {
        return String.format("%d%02d%02d%02d%02d%02d",
                LocalDateTime.now().getYear() % 100,
                LocalDateTime.now().getMonthValue(),
                LocalDateTime.now().getDayOfMonth(),
                LocalDateTime.now().getHour(),
                LocalDateTime.now().getMinute(),
                LocalDateTime.now().getSecond());
    }
    
    public long getTimeLeftSeconds(GamePeriod period) {
        if (period.getIsCompleted()) {
            return 0;
        }
        LocalDateTime endTime = period.getEndTime();
        LocalDateTime now = LocalDateTime.now();
        if (now.isAfter(endTime)) {
            return 0;
        }
        return java.time.Duration.between(now, endTime).getSeconds();
    }
}

