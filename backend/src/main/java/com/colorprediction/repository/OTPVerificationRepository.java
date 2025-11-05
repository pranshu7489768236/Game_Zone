package com.colorprediction.repository;

import com.colorprediction.model.OTPVerification;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import java.time.LocalDateTime;
import java.util.Optional;

@Repository
public interface OTPVerificationRepository extends JpaRepository<OTPVerification, Long> {
    Optional<OTPVerification> findByMobileNumberAndOtpAndIsUsedFalse(String mobileNumber, String otp);
    
    @Modifying
    @Query("DELETE FROM OTPVerification o WHERE o.expirationTime < ?1")
    void deleteExpiredOTPs(LocalDateTime now);
}

