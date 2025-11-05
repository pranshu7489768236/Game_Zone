package com.colorprediction.repository;

import com.colorprediction.model.GamePeriod;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import java.util.Optional;

@Repository
public interface GamePeriodRepository extends JpaRepository<GamePeriod, Long> {
    Optional<GamePeriod> findByPeriodId(String periodId);
    
    @Query("SELECT g FROM GamePeriod g WHERE g.isCompleted = false ORDER BY g.createdAt DESC")
    Optional<GamePeriod> findCurrentPeriod();
    
    @Query("SELECT g FROM GamePeriod g WHERE g.isCompleted = true ORDER BY g.createdAt DESC")
    java.util.List<GamePeriod> findRecentCompletedPeriods(org.springframework.data.domain.Pageable pageable);
}

