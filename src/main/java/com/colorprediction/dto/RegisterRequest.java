package com.colorprediction.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import lombok.Data;

@Data
public class RegisterRequest {
    @NotBlank(message = "Mobile number is required")
    @Pattern(regexp = "^[0-9]{10}$", message = "Mobile number must be 10 digits")
    private String mobileNumber;
    
    @NotBlank(message = "Password is required")
    @Pattern(regexp = "^.{6,}$", message = "Password must be at least 6 characters")
    private String password;
}

