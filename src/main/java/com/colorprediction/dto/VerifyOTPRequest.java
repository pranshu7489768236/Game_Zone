package com.colorprediction.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class VerifyOTPRequest {
    @NotBlank(message = "Mobile number is required")
    private String mobileNumber;
    
    @NotBlank(message = "Password is required")
    private String password;
    
    @NotBlank(message = "OTP is required")
    private String otp;
}

