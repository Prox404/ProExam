package com.dtu.proexam.controller;


import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.dtu.proexam.model.Answer;
import com.dtu.proexam.model.Exam;
import com.dtu.proexam.model.Question;
import com.dtu.proexam.repository.AnswerRepository;
import com.dtu.proexam.repository.ExamRepository;
import com.dtu.proexam.repository.QuestionRepository;
import com.dtu.proexam.util.GlobalUtil;
import com.dtu.proexam.util.LoggingUntil;

@RestController
@RequestMapping("/exam")
public class ExamController {
    private JdbcTemplate jdbcTemplate;
    LoggingUntil loggingUntil;
    private final ExamRepository examRepository;
    private QuestionRepository questionRepository;
    private AnswerRepository answerRepository;
    
    public ExamController(JdbcTemplate jdbcTemplate, ExamRepository examRepository, QuestionRepository questionRepository, AnswerRepository answerRepository) {
        this.jdbcTemplate = jdbcTemplate;
        loggingUntil = new LoggingUntil();
        this.examRepository = examRepository;
        this.questionRepository = questionRepository;
        this.answerRepository = answerRepository;
    }
    

    @PostMapping("/store")
    public ResponseEntity<?> storeExam(@RequestBody Exam exam) {
        if (exam.getUser() == null || exam.getUser().getUserId() == null
            || exam.getExamName() == null || exam.getExamName().isEmpty()
            || exam.getKeyCode() < 100000 || exam.getKeyCode() > 999999
        ) {
            return ResponseEntity.badRequest().body("Unstable data !");
        }

        String uuid = GlobalUtil.getUUID();
        exam.setExamId(uuid);

        examRepository.save(exam);
        return ResponseEntity.ok(exam);
    }

    @PostMapping("/update")
    public ResponseEntity<?> updateExam(@RequestBody Exam exam) {
        if (exam.getUser() == null || exam.getUser().getUserId() == null
            || exam.getExamId() == null || exam.getExamId().isEmpty()
            || exam.getExamName() == null || exam.getExamName().isEmpty()
            || exam.getKeyCode() < 100000 || exam.getKeyCode() > 999999
        ) {
            return ResponseEntity.badRequest().body("Unstable data !");
        }
        examRepository.save(exam);
        return ResponseEntity.ok(exam);
    }

    @PostMapping("/storeQuestions/{examId}")
    public ResponseEntity<?> postMethodName(@PathVariable String examId, @RequestBody List<Question> questions) {
        
        Exam exam = examRepository.findById(examId).orElse(null);
        if (exam == null) {
            return ResponseEntity.badRequest().body("Exam not found !");
        }

        for (Question question : questions) {
            loggingUntil.info("AuthController", question.toString());
            question.setExam(exam);
            if (question.getAnswers().size() == 0) {
                continue;
            }
            if (question.getQuestionId() == null || question.getQuestionId().isEmpty()) {
                question.setQuestionId(GlobalUtil.getUUID());
            }
            
            Question savedQuestion = questionRepository.save(question);

            for (Answer answer : question.getAnswers()) {
                if (answer.getAnswerId() == null || answer.getAnswerId().isEmpty()){
                    answer.setAnswerId(GlobalUtil.getUUID());
                }
                answer.setQuestion(savedQuestion);
                answerRepository.save(answer);
            }
        }

        
        return ResponseEntity.ok(questions);
    }
    
    
}