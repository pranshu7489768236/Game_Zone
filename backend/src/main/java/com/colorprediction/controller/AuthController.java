package com.colorprediction.controller;

import com.colorprediction.dto.*;
import com.colorprediction.service.AuthService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:4200")
public class AuthController {
    
    private final AuthService authService;
    
    @PostMapping("/register")
    public ResponseEntity<AuthResponse> register(@Valid @RequestBody RegisterRequest request) {
        boolean success = authService.registerUser(request.getMobileNumber(), request.getPassword());
        if (success) {
            return ResponseEntity.ok(new AuthResponse(null, "OTP sent to your mobile number", true));
        }
        return ResponseEntity.badRequest().body(new AuthResponse(null, "Mobile number already exists", false));
    }
    
    @PostMapping("/verify-otp")
    public ResponseEntity<AuthResponse> verifyOTP(@Valid @RequestBody VerifyOTPRequest request) {
        boolean success = authService.verifyOTPAndCreateUser(
                request.getMobileNumber(),
                request.getPassword(),
                request.getOtp()
        );
        if (success) {
            return ResponseEntity.ok(new AuthResponse(null, "Account created successfully", true));
        }
        return ResponseEntity.badRequest().body(new AuthResponse(null, "Invalid OTP or mobile number already exists", false));
    }
    
    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@Valid @RequestBody LoginRequest request) {
        String token = authService.login(request.getMobileNumber(), request.getPassword());
        if (token != null) {
            return ResponseEntity.ok(new AuthResponse(token, "Login successful", true));
        }
        return ResponseEntity.badRequest().body(new AuthResponse(null, "Invalid credentials", false));
    }
}

