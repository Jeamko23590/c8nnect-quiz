package com.quiz.app.controller;

import com.quiz.app.dto.*;
import com.quiz.app.service.QuizService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/quiz")
@CrossOrigin(origins = "http://localhost:3000")
public class QuizController {
    
    @Autowired
    private QuizService quizService;
    
    @GetMapping("/questions")
    public ResponseEntity<List<QuestionDTO>> getQuestions() {
        List<QuestionDTO> questions = quizService.getRandomQuestions();
        return ResponseEntity.ok(questions);
    }
    
    @PostMapping("/submit")
    public ResponseEntity<QuizResultDTO> submitQuiz(@RequestBody QuizSubmissionDTO submission) {
        QuizResultDTO result = quizService.submitQuiz(submission);
        return ResponseEntity.ok(result);
    }
    
    @GetMapping("/leaderboard")
    public ResponseEntity<List<LeaderboardEntryDTO>> getLeaderboard(
            @RequestParam(required = false, defaultValue = "10") Integer limit) {
        List<LeaderboardEntryDTO> leaderboard = quizService.getLeaderboard(limit);
        return ResponseEntity.ok(leaderboard);
    }
}
