package com.quiz.app.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class QuizSubmissionDTO {
    private String nickname;
    private List<AnswerDTO> answers;
    private Long timeUsedSeconds;
}
