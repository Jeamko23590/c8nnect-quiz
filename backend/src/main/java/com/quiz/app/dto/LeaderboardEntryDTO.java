package com.quiz.app.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class LeaderboardEntryDTO {
    private Long id;
    private String nickname;
    private Integer score;
    private Long timeUsedSeconds;
    private LocalDateTime attemptDate;
    private Integer rank;
}
