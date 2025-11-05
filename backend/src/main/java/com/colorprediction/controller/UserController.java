package com.colorprediction.controller;

import com.colorprediction.dto.UserProfileResponse;
import com.colorprediction.model.User;
import com.colorprediction.model.Wallet;
import com.colorprediction.repository.UserRepository;
import com.colorprediction.repository.WalletRepository;
import com.colorprediction.service.AuthService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;

@RestController
@RequestMapping("/api/user")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:4200")
public class UserController {
    
    private final AuthService authService;
    private final WalletRepository walletRepository;
    
    @GetMapping("/profile")
    public ResponseEntity<UserProfileResponse> getProfile(Authentication authentication) {
        String mobileNumber = authentication.getName();
        User user = authService.getUserByMobileNumber(mobileNumber);
        
        if (user == null) {
            return ResponseEntity.notFound().build();
        }
        
        Wallet wallet = walletRepository.findByUser(user)
                .orElse(new Wallet());
        
        BigDecimal balance = wallet.getBalance() != null ? wallet.getBalance() : BigDecimal.ZERO;
        
        return ResponseEntity.ok(new UserProfileResponse(
                user.getId(),
                user.getMobileNumber(),
                balance
        ));
    }
}

