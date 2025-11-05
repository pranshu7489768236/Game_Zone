package com.colorprediction.service;

import com.colorprediction.model.OTPVerification;
import com.colorprediction.repository.OTPVerificationRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import java.time.LocalDateTime;
import java.util.Random;

@Service
@Slf4j
public class OTPService {
    
    private final OTPVerificationRepository otpRepository;
    
    @Value("${otp.length:6}")
    private int otpLength;
    
    @Value("${otp.expiration.minutes:5}")
    private int expirationMinutes;
    
    @Value("${twilio.enabled:false}")
    private boolean twilioEnabled;
    
    public OTPService(OTPVerificationRepository otpRepository) {
        this.otpRepository = otpRepository;
    }
    
    public String generateOTP() {
        Random random = new Random();
        StringBuilder otp = new StringBuilder();
        for (int i = 0; i < otpLength; i++) {
            otp.append(random.nextInt(10));
        }
        return otp.toString();
    }
    
    public void saveOTP(String mobileNumber, String otp) {
        OTPVerification otpVerification = new OTPVerification();
        otpVerification.setMobileNumber(mobileNumber);
        otpVerification.setOtp(otp);
        otpVerification.setExpirationTime(LocalDateTime.now().plusMinutes(expirationMinutes));
        otpVerification.setIsUsed(false);
        otpRepository.save(otpVerification);
    }
    
    public boolean verifyOTP(String mobileNumber, String otp) {
        return otpRepository.findByMobileNumberAndOtpAndIsUsedFalse(mobileNumber, otp)
                .map(otpVerification -> {
                    if (otpVerification.getExpirationTime().isBefore(LocalDateTime.now())) {
                        return false;
                    }
                    otpVerification.setIsUsed(true);
                    otpRepository.save(otpVerification);
                    return true;
                })
                .orElse(false);
    }
    
    public void sendOTP(String mobileNumber, String otp) {
        if (twilioEnabled) {
            // TODO: Implement Twilio SMS/WhatsApp sending
            // For now, just log to console
            log.info("=== OTP for {}: {} ===", mobileNumber, otp);
        } else {
            // Development mode: Log OTP to console
            log.info("=== OTP for {}: {} ===", mobileNumber, otp);
            log.info("=== OTP sent to {}: {} ===", mobileNumber, otp);
        }
    }
}

