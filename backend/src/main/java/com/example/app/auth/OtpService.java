package com.example.app.auth;

import com.twilio.Twilio;
import com.twilio.rest.api.v2010.account.Message;
import com.twilio.type.PhoneNumber;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

@Service
public class OtpService {

    @Value("${app.twilio.enabled:false}")
    private boolean twilioEnabled;

    @Value("${app.twilio.accountSid:}")
    private String accountSid;

    @Value("${app.twilio.authToken:}")
    private String authToken;

    @Value("${app.twilio.fromNumber:+10000000000}")
    private String fromNumber;

    public void sendOtp(String toMobile, String otp) {
        String body = "Your OTP is: " + otp + " (valid for 5 minutes)";
        if (twilioEnabled) {
            Twilio.init(accountSid, authToken);
            Message.creator(new PhoneNumber("+91" + toMobile), new PhoneNumber(fromNumber), body).create();
        } else {
            System.out.println("[DEV] Sending OTP to +91" + toMobile + ": " + body);
        }
    }
}

