package com.colorprediction.repository;

import com.colorprediction.model.User;
import com.colorprediction.model.UserPrediction;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface UserPredictionRepository extends JpaRepository<UserPrediction, Long> {
    List<UserPrediction> findByUserOrderByCreatedAtDesc(User user);
    List<UserPrediction> findByUserAndPeriod_IsCompletedTrueOrderByCreatedAtDesc(User user);
    List<UserPrediction> findByPeriodAndStatus(com.colorprediction.model.GamePeriod period, String status);
}

