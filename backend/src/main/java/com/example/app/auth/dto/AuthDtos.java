package com.example.app.auth.dto;

public class AuthDtos {
    public record SendOtpRequest(String mobileNumber) {}
    public record VerifyOtpRequest(String mobileNumber, String otp, String password) {}
    public record LoginRequest(String mobileNumber, String password) {}
    public record LoginResponse(String token) {}
    public record ApiMessage(String message) {}
}

