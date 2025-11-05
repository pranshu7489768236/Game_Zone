package com.example.app.user;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequestMapping("/api/user")
public class UserController {

    private final UserRepository userRepository;
    private final WalletRepository walletRepository;

    public UserController(UserRepository userRepository, WalletRepository walletRepository) {
        this.userRepository = userRepository;
        this.walletRepository = walletRepository;
    }

    @GetMapping("/me")
    public ResponseEntity<?> me(Authentication auth) {
        String mobile = auth.getName();
        var user = userRepository.findByMobileNumber(mobile).orElseThrow();
        var wallet = walletRepository.findByUser(user).orElseThrow();
        return ResponseEntity.ok(Map.of(
                "mobileNumber", user.getMobileNumber(),
                "walletBalance", wallet.getBalance()
        ));
    }
}

