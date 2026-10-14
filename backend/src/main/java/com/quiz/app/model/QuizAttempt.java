package com.quiz.app.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Entity
@Table(name = "quiz_attempts")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class QuizAttempt {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(nullable = false)
    private String nickname;
    
    @Column(nullable = false)
    private Integer score;
    
    @Column(nullable = false)
    private Long timeUsedSeconds; // Time taken to complete quiz in seconds
    
    @Column(nullable = false)
    private LocalDateTime attemptDate;
    
    @PrePersist
    protected void onCreate() {
        attemptDate = LocalDateTime.now();
    }
}
