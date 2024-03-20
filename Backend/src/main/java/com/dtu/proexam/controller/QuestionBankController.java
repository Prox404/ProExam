package com.dtu.proexam.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.dtu.proexam.model.QuestionBank;
import com.dtu.proexam.repository.AnswerRepository;
import com.dtu.proexam.repository.QuestionBankRepository;
import com.dtu.proexam.repository.QuestionRepository;
import com.dtu.proexam.util.GlobalUtil;
import com.dtu.proexam.util.LoggingUntil;
import com.dtu.proexam.util.UserUtil;
import com.fasterxml.jackson.databind.node.ObjectNode;

import jakarta.transaction.Transactional;

import java.util.List;
import java.util.ArrayList;

import com.dtu.proexam.model.Answer;
import com.dtu.proexam.model.Question;

@RestController
@CrossOrigin(origins = "*", allowedHeaders = "*")
@RequestMapping("/bank")
public class QuestionBankController {
    private JdbcTemplate jdbcTemplate;
    LoggingUntil loggingUntil;
    QuestionRepository questionRepository;
    QuestionBankRepository questionBankRepository;
    AnswerRepository answerRepository;

    public QuestionBankController(JdbcTemplate jdbcTemplate, QuestionRepository questionRepository, 
    AnswerRepository answerRepository,
    QuestionBankRepository questionBankRepository) {
        this.jdbcTemplate = jdbcTemplate;
        loggingUntil = new LoggingUntil();
        UserUtil.setJdbcTemplate(jdbcTemplate);
        this.questionRepository = questionRepository;
        this.questionBankRepository = questionBankRepository;
        this.answerRepository = answerRepository;
    }

    @PostMapping("/store")
    public ResponseEntity<?> storeQuestionBank(@RequestBody QuestionBank questionBank) {
        if (questionBank.getUser() == null || questionBank.getUser().getUserId().isEmpty()) {
            return ResponseEntity.badRequest().body(new BasicResponse("Invalid user", 400));
        }

        try {
            if (questionBank.getBankId() == null || questionBank.getBankId().isEmpty()){
                questionBank.setBankId(GlobalUtil.getUUID());
            }

            QuestionBank questionBank__ = questionBankRepository.save(questionBank);
            if (questionBank__ == null) {
                return ResponseEntity.badRequest().body(new BasicResponse("Failed to store question bank", 400));
            }else{
                questionBank__.setUser(null);
                return ResponseEntity.ok(new BasicResponse("Question bank stored", 200, questionBank__));
            }
            
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(new BasicResponse("Failed to store question bank", 400));
        }
    }

    @PostMapping("/storeQuestions/{bankId}")
    public ResponseEntity<?> postMethodName(@PathVariable String bankId, @RequestBody List<Question> questions) {

        QuestionBank bank = questionBankRepository.findById(bankId).orElse(null);
        if (bank == null) {
            return ResponseEntity.badRequest().body("Bank not found !");
        }

        for (Question question : questions) {
            loggingUntil.info("AuthController", question.toString());
            question.setQuestionBank(bank);
            if (question.getAnswers().size() == 0) {
                continue;
            }
            if (question.getQuestionId() == null || question.getQuestionId().isEmpty()) {
                question.setQuestionId(GlobalUtil.getUUID());
            }
            // check if number of correct answer is valid
            long correctAnswerCount = question.getAnswers().stream().filter(Answer::isIsCorrect).count();
            if (correctAnswerCount == 0) {
                return ResponseEntity.badRequest().body("Invalid number of correct answer !");
            }
            // set MULTIPLE_CHOICE if number of correct answer > 1
            if (correctAnswerCount > 1) {
                question.setQuestionType(Question.QuestionType.MULTIPLE_CHOICE);
            }

            Question savedQuestion = questionRepository.save(question);

            for (Answer answer : question.getAnswers()) {
                if (answer.getAnswerId() == null || answer.getAnswerId().isEmpty()) {
                    answer.setAnswerId(GlobalUtil.getUUID());
                }
                answer.setQuestion(savedQuestion);
                answerRepository.save(answer);
            }
        }

        return ResponseEntity.ok(questions);
    }

    @GetMapping("/get/{userId}")
    public ResponseEntity<?> getQuestionBank(@PathVariable String userId) {
        if (userId == null || userId.isEmpty()) {
            return ResponseEntity.badRequest().body(new BasicResponse("Invalid user", 400));
        }
        try {
            List<QuestionBank> questionBanks = questionBankRepository.findByUserUserId(userId);
            List<BankAndQuestions> mergeEntities = new ArrayList<>();
            questionBanks.forEach(qb -> {
                qb.setUser(null);
                List<Question> questions = questionRepository.findByQuestionBankBankId(qb.getBankId());
                questions.forEach(q -> {
                    q.setQuestionBank(null);
                });
                mergeEntities.add(new BankAndQuestions(qb, questions));
            });
            return ResponseEntity.ok(new BasicResponse("successfully !", 200, mergeEntities));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(new BasicResponse("Failed to store question bank", 400));
        }
    }

    @DeleteMapping("/removeQuestion/{questionId}")
    @Transactional
    public ResponseEntity<?> removeQuestion(@PathVariable String questionId) {
        if (questionId == null || questionId.isEmpty()) {
            return ResponseEntity.badRequest().body(new BasicResponse("Invalid question", 400));
        }
        try {
            loggingUntil.info("AuthController", "Remove question");
            Question question = questionRepository.findById(questionId).orElse(null);
            if (question == null) {
                return ResponseEntity.badRequest().body(new BasicResponse("Question not found", 400));
            }
            answerRepository.deleteAnswersByQuestion(question);
            questionRepository.deleteById(questionId);
            return ResponseEntity.ok(new BasicResponse("Question removed", 200));
        } catch (Exception e) {
            loggingUntil.error("AuthController", e.getMessage());
            return ResponseEntity.badRequest().body(new BasicResponse("Failed to remove question", 400));
        }
    }

    @DeleteMapping("/delete/{bankId}")
    @Transactional
    public ResponseEntity<?> deleteQuestionBank(@PathVariable String bankId) {
        if (bankId == null || bankId.isEmpty()) {
            return ResponseEntity.badRequest().body(new BasicResponse("Invalid question bank", 400));
        }
        try {
            loggingUntil.info("AuthController", "Remove question bank");
            QuestionBank questionBank = questionBankRepository.findById(bankId).orElse(null);
            if (questionBank == null) {
                return ResponseEntity.badRequest().body(new BasicResponse("Question bank not found", 400));
            }
            List<Question> questions = questionRepository.findByQuestionBankBankId(bankId);
            questions.forEach(q -> {
                answerRepository.deleteAnswersByQuestion(q);
            });
            questionRepository.deleteQuestionsByQuestionBank(questionBank);
            questionBankRepository.deleteById(bankId);
            return ResponseEntity.ok(new BasicResponse("Question bank removed", 200));
        } catch (Exception e) {
            loggingUntil.error("AuthController", e.getMessage());
            return ResponseEntity.badRequest().body(new BasicResponse("Failed to remove question bank", 400));
        }
    }

    @PostMapping("/updateBankName/{bankId}")
    public ResponseEntity<?> updateBankName(@PathVariable String bankId, @RequestBody ObjectNode objectNode) {
        String bankName = objectNode.get("bankName").asText();
        if (bankId == null || bankId.isEmpty()) {
            return ResponseEntity.badRequest().body(new BasicResponse("Invalid question bank", 400));
        }
        try {
            QuestionBank questionBank = questionBankRepository.findById(bankId).orElse(null);
            if (questionBank == null) {
                return ResponseEntity.badRequest().body(new BasicResponse("Question bank not found", 400));
            }
            questionBank.setBankName(bankName);
            questionBankRepository.save(questionBank);
            return ResponseEntity.ok(new BasicResponse("Question bank name updated", 200));
        } catch (Exception e) {
            loggingUntil.error("AuthController", e.getMessage());
            return ResponseEntity.badRequest().body(new BasicResponse("Failed to update question bank name", 400));
        }
    }
    

    public class BankAndQuestions {
        public Object  bank;
        public Object question;

        public BankAndQuestions(Object bank, Object question) {
            this.bank = bank;
            this.question = question;
        }
    }

    public class BasicResponse {
        public String message;
        public int status;
        public Object data;

        public BasicResponse() {
        }

        public BasicResponse(String message, int status) {
            this.message = message;
            this.status = status;
        }

        public BasicResponse(String message, int status, Object data) {
            this.message = message;
            this.status = status;
            this.data = data;
        }

    }
}
