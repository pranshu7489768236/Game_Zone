package com.example.app.auth;

import com.example.app.auth.dto.AuthDtos.*;
import com.example.app.security.JwtUtils;
import com.example.app.user.User;
import com.example.app.user.UserRepository;
import com.example.app.user.Wallet;
import com.example.app.user.WalletRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.Random;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final OtpVerificationRepository otpRepo;
    private final UserRepository userRepo;
    private final WalletRepository walletRepo;
    private final OtpService otpService;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtils jwtUtils;

    public AuthController(OtpVerificationRepository otpRepo, UserRepository userRepo, WalletRepository walletRepo,
                          OtpService otpService, PasswordEncoder passwordEncoder, JwtUtils jwtUtils) {
        this.otpRepo = otpRepo;
        this.userRepo = userRepo;
        this.walletRepo = walletRepo;
        this.otpService = otpService;
        this.passwordEncoder = passwordEncoder;
        this.jwtUtils = jwtUtils;
    }

    @PostMapping("/send-otp")
    public ResponseEntity<ApiMessage> sendOtp(@RequestBody SendOtpRequest req) {
        if (req.mobileNumber() == null || !req.mobileNumber().matches("\\d{10}")) {
            return ResponseEntity.badRequest().body(new ApiMessage("Invalid mobile number"));
        }
        String otp = String.format("%06d", new Random().nextInt(1_000_000));
        OtpVerification ov = new OtpVerification();
        ov.setMobileNumber(req.mobileNumber());
        ov.setOtp(otp);
        ov.setExpiryTime(Instant.now().plus(5, ChronoUnit.MINUTES));
        otpRepo.save(ov);
        otpService.sendOtp(req.mobileNumber(), otp);
        return ResponseEntity.ok(new ApiMessage("OTP sent"));
    }

    @PostMapping("/verify-otp")
    @Transactional
    public ResponseEntity<ApiMessage> verifyOtp(@RequestBody VerifyOtpRequest req) {
        var optOv = otpRepo.findTopByMobileNumberOrderByIdDesc(req.mobileNumber());
        if (optOv.isEmpty()) return ResponseEntity.badRequest().body(new ApiMessage("OTP not found"));
        var ov = optOv.get();
        if (!ov.getOtp().equals(req.otp()) || ov.getExpiryTime().isBefore(Instant.now())) {
            return ResponseEntity.badRequest().body(new ApiMessage("Invalid or expired OTP"));
        }
        if (userRepo.existsByMobileNumber(req.mobileNumber())) {
            return ResponseEntity.badRequest().body(new ApiMessage("Mobile already registered"));
        }
        User user = new User();
        user.setMobileNumber(req.mobileNumber());
        user.setPassword(passwordEncoder.encode(req.password()));
        user.setVerified(true);
        userRepo.save(user);
        Wallet wallet = new Wallet();
        wallet.setUser(user);
        wallet.setBalance(0.0);
        walletRepo.save(wallet);
        return ResponseEntity.ok(new ApiMessage("User registered"));
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest req) {
        var userOpt = userRepo.findByMobileNumber(req.mobileNumber());
        if (userOpt.isEmpty()) return ResponseEntity.status(401).body(new ApiMessage("Invalid credentials"));
        var user = userOpt.get();
        if (!user.isVerified()) return ResponseEntity.status(401).body(new ApiMessage("User not verified"));
        if (!passwordEncoder.matches(req.password(), user.getPassword())) {
            return ResponseEntity.status(401).body(new ApiMessage("Invalid credentials"));
        }
        String token = jwtUtils.generateToken(user.getMobileNumber());
        return ResponseEntity.ok(new LoginResponse(token));
    }
}

