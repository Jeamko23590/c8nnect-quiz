package com.quiz.app.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class QuizResultDTO {
    private Integer score;
    private Integer totalQuestions;
    private Long timeUsedSeconds;
    private String message;
}
