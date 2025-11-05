package com.colorprediction;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@EnableScheduling
public class ColorPredictionApplication {
    public static void main(String[] args) {
        SpringApplication.run(ColorPredictionApplication.class, args);
    }
}

