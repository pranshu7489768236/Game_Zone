package com.colorprediction.service;

import com.colorprediction.model.User;
import com.colorprediction.model.Wallet;
import com.colorprediction.repository.UserRepository;
import com.colorprediction.repository.WalletRepository;
import com.colorprediction.util.JwtUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class AuthService {
    
    private final UserRepository userRepository;
    private final WalletRepository walletRepository;
    private final PasswordEncoder passwordEncoder;
    private final OTPService otpService;
    private final JwtUtil jwtUtil;
    
    public boolean registerUser(String mobileNumber, String password) {
        if (userRepository.existsByMobileNumber(mobileNumber)) {
            return false;
        }
        
        String otp = otpService.generateOTP();
        otpService.saveOTP(mobileNumber, otp);
        otpService.sendOTP(mobileNumber, otp);
        
        return true;
    }
    
    @Transactional
    public boolean verifyOTPAndCreateUser(String mobileNumber, String password, String otp) {
        if (!otpService.verifyOTP(mobileNumber, otp)) {
            return false;
        }
        
        if (userRepository.existsByMobileNumber(mobileNumber)) {
            return false;
        }
        
        User user = new User();
        user.setMobileNumber(mobileNumber);
        user.setPassword(passwordEncoder.encode(password));
        user.setIsVerified(true);
        user = userRepository.save(user);
        
        // Create wallet for user
        Wallet wallet = new Wallet();
        wallet.setUser(user);
        wallet.setBalance(java.math.BigDecimal.valueOf(1000.00)); // Initial balance
        walletRepository.save(wallet);
        
        return true;
    }
    
    public String login(String mobileNumber, String password) {
        return userRepository.findByMobileNumber(mobileNumber)
                .filter(user -> passwordEncoder.matches(password, user.getPassword()))
                .filter(User::getIsVerified)
                .map(user -> jwtUtil.generateToken(mobileNumber, user.getId()))
                .orElse(null);
    }
    
    public User getUserByMobileNumber(String mobileNumber) {
        return userRepository.findByMobileNumber(mobileNumber).orElse(null);
    }
}

