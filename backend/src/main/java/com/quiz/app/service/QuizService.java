package com.quiz.app.service;

import com.quiz.app.dto.*;
import com.quiz.app.model.Question;
import com.quiz.app.model.QuizAttempt;
import com.quiz.app.repository.QuestionRepository;
import com.quiz.app.repository.QuizAttemptRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class QuizService {
    
    @Autowired
    private QuestionRepository questionRepository;
    
    @Autowired
    private QuizAttemptRepository quizAttemptRepository;
    
    public List<QuestionDTO> getRandomQuestions() {
        List<Question> questions = questionRepository.findRandomQuestions();
        return questions.stream()
            .map(this::convertToDTO)
            .collect(Collectors.toList());
    }
    
    public QuizResultDTO submitQuiz(QuizSubmissionDTO submission) {
        int score = 0;
        int totalQuestions = submission.getAnswers().size();
        
        // Calculate score
        for (AnswerDTO answer : submission.getAnswers()) {
            Question question = questionRepository.findById(answer.getQuestionId())
                .orElse(null);
            if (question != null && question.getCorrectAnswer().equalsIgnoreCase(answer.getSelectedAnswer())) {
                score++;
            }
        }
        
        // Save quiz attempt
        QuizAttempt attempt = new QuizAttempt();
        attempt.setNickname(submission.getNickname());
        attempt.setScore(score);
        attempt.setTimeUsedSeconds(submission.getTimeUsedSeconds());
        quizAttemptRepository.save(attempt);
        
        // Prepare result
        String message = String.format("You scored %d out of %d!", score, totalQuestions);
        return new QuizResultDTO(score, totalQuestions, submission.getTimeUsedSeconds(), message);
    }
    
    public List<LeaderboardEntryDTO> getLeaderboard(Integer limit) {
        List<QuizAttempt> attempts;
        if (limit != null && limit > 0) {
            attempts = quizAttemptRepository.findLeaderboard().stream()
                .limit(limit)
                .collect(Collectors.toList());
        } else {
            attempts = quizAttemptRepository.findLeaderboard();
        }
        
        // Add rank to each entry
        List<LeaderboardEntryDTO> leaderboard = attempts.stream()
            .map(attempt -> {
                LeaderboardEntryDTO dto = new LeaderboardEntryDTO();
                dto.setId(attempt.getId());
                dto.setNickname(attempt.getNickname());
                dto.setScore(attempt.getScore());
                dto.setTimeUsedSeconds(attempt.getTimeUsedSeconds());
                dto.setAttemptDate(attempt.getAttemptDate());
                return dto;
            })
            .collect(Collectors.toList());
        
        for (int i = 0; i < leaderboard.size(); i++) {
            leaderboard.get(i).setRank(i + 1);
        }
        
        return leaderboard;
    }
    
    private QuestionDTO convertToDTO(Question question) {
        QuestionDTO dto = new QuestionDTO();
        dto.setId(question.getId());
        dto.setQuestionText(question.getQuestionText());
        dto.setOptionA(question.getOptionA());
        dto.setOptionB(question.getOptionB());
        dto.setOptionC(question.getOptionC());
        dto.setOptionD(question.getOptionD());
        return dto;
    }
}
