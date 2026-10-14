package com.quiz.app.repository;

import com.quiz.app.model.QuizAttempt;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface QuizAttemptRepository extends JpaRepository<QuizAttempt, Long> {
    // Get leaderboard: Order by score (descending), then by time used (ascending)
    @Query("SELECT qa FROM QuizAttempt qa ORDER BY qa.score DESC, qa.timeUsedSeconds ASC")
    List<QuizAttempt> findLeaderboard();
    
    // Get top 10 for leaderboard
    @Query("SELECT qa FROM QuizAttempt qa ORDER BY qa.score DESC, qa.timeUsedSeconds ASC")
    List<QuizAttempt> findTop10();
}
