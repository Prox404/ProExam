package com.dtu.proexam.controller;

import java.io.InputStream;
import java.util.ArrayList;
import java.util.Collections;
import java.util.Date;
import java.util.List;

import org.apache.poi.hwpf.HWPFDocument;
import org.apache.poi.hwpf.extractor.WordExtractor;
import org.springframework.http.ResponseEntity;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.dtu.proexam.model.Answer;
import com.dtu.proexam.model.Exam;
import com.dtu.proexam.model.ExamResult;
import com.dtu.proexam.model.History;
import com.dtu.proexam.model.Question;
import com.dtu.proexam.model.UserAnswer;
import com.dtu.proexam.model.Users;
import com.dtu.proexam.repository.AnswerRepository;
import com.dtu.proexam.repository.ExamRepository;
import com.dtu.proexam.repository.ExamResultRepository;
import com.dtu.proexam.repository.QuestionRepository;
import com.dtu.proexam.repository.UserAnswerRepository;
import com.dtu.proexam.repository.UserRepository;
import com.dtu.proexam.util.GlobalUtil;
import com.dtu.proexam.util.LoggingUntil;
import com.fasterxml.jackson.databind.node.ObjectNode;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;

@RestController
@RequestMapping("/exam")
public class ExamController {
    private JdbcTemplate jdbcTemplate;
    LoggingUntil loggingUntil;
    private final ExamRepository examRepository;
    private QuestionRepository questionRepository;
    private AnswerRepository answerRepository;
    private UserRepository userRepository;
    private UserAnswerRepository userAnswerRepository;
    private ExamResultRepository examResultRepository;

    public ExamController(JdbcTemplate jdbcTemplate, ExamRepository examRepository,
            QuestionRepository questionRepository, AnswerRepository answerRepository,
            UserRepository userRepository,
            UserAnswerRepository userAnswerRepository,
            ExamResultRepository examResultRepository) {
        this.jdbcTemplate = jdbcTemplate;
        loggingUntil = new LoggingUntil();
        this.examRepository = examRepository;
        this.questionRepository = questionRepository;
        this.answerRepository = answerRepository;
        this.userRepository = userRepository;
        this.userAnswerRepository = userAnswerRepository;
        this.examResultRepository = examResultRepository;
    }

    @PostMapping("/store")
    public ResponseEntity<?> storeExam(@RequestBody Exam exam) {
        if (exam.getUser() == null || exam.getUser().getUserId() == null
                || exam.getExamName() == null || exam.getExamName().isEmpty()
                || exam.getKeyCode() < 100000 || exam.getKeyCode() > 999999) {
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
                || exam.getKeyCode() < 100000 || exam.getKeyCode() > 999999) {
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
                if (answer.getAnswerId() == null || answer.getAnswerId().isEmpty()) {
                    answer.setAnswerId(GlobalUtil.getUUID());
                }
                answer.setQuestion(savedQuestion);
                answerRepository.save(answer);
            }
        }

        return ResponseEntity.ok(questions);
    }

    @GetMapping("/getRandomQuestion")
    public ResponseEntity<?> getRandom(@RequestParam String examId) {

        Exam exam = examRepository.findById(examId).orElse(null);
        if (exam == null) {
            return ResponseEntity.badRequest().body("Exam not found !");
        }

        List<Question> questions = questionRepository.findByExamExamId(examId);
        questions.forEach(
                question -> {
                    List<Answer> answers = question.getAnswers();
                    Collections.shuffle(answers);
                    answers.forEach(
                            answer -> {
                                answer.setIsCorrect(false);
                            });
                });
        // random question
        Collections.shuffle(questions);

        return ResponseEntity.ok(questions);
    }

    @PostMapping("/uploadQuestionList/{examId}")
    public ResponseEntity<?> uploadQuestionList(@PathVariable String examId, @RequestParam("file") MultipartFile file) {

        try {
            // Kiểm tra xem tệp có phải là tệp .doc không
            if (!file.getContentType().equals("application/msword")) {
                return ResponseEntity.badRequest().body("Only .doc files are allowed.");
            }

            Exam exam = examRepository.findById(examId).orElse(null);
            if (exam == null) {
                return ResponseEntity.badRequest().body("Exam not found !");
            }

            // Đọc nội dung từ tệp .doc
            InputStream inputStream = file.getInputStream();
            HWPFDocument doc = new HWPFDocument(inputStream);
            WordExtractor extractor = new WordExtractor(doc);
            String text = extractor.getText();
            extractor.close();

            // Phân tích nội dung tệp .doc
            List<Question> questions = parseQuestions(text, exam);

            // Trả về nội dung của tệp .doc
            return ResponseEntity.ok(questions);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.badRequest().body("Error reading the DOC file.");
        }
    }

    public static List<Question> parseQuestions(String input, Exam exam) {
        List<Question> questions = new ArrayList<>();
        String[] blocks = input.split("Question: ");
        for (String block : blocks) {
            if (block.trim().isEmpty()) {
                continue;
            }
            String[] lines = block.split("\n");
            String questionText = lines[0];
            questionText = questionText.replace("\r", "");
            Question question = new Question();
            question.setExam(exam);
            question.setQuestionId(GlobalUtil.getUUID());
            question.setQuestionText(questionText);
            for (int i = 1; i < lines.length; i++) {
                String line = lines[i];
                if (line.startsWith("Answer: ")) {
                    String answerText = line.substring("Answer: ".length());
                    boolean isCorrect = answerText.endsWith(" *\r");
                    answerText = answerText.replace("\r", "");
                    if (isCorrect) {
                        answerText = answerText.substring(0, answerText.length() - 2);
                    }
                    Answer answer = new Answer(answerText, isCorrect);
                    answer.setAnswerId(GlobalUtil.getUUID());
                    ;
                    question.getAnswers().add(answer);
                }
            }
            questions.add(question);
        }
        return questions;
    }

    @PostMapping("/takeExam/{keyCode}")
    public ResponseEntity<?> takeExam(
            @PathVariable(required = true) int keyCode,
            @RequestBody ObjectNode objectNode) {

        String userEmail = objectNode.get("userEmail").asText();
        String userName = objectNode.get("userName").asText();

        loggingUntil.info("takeExam", "keyCode: " + keyCode + " userEmail: " + userEmail + " userName: " + userName);

        if (userEmail == null || userEmail.isEmpty() || userName == null || userName.isEmpty()) {
            return ResponseEntity.badRequest().body("Invalid Account !");
        }

        List<Exam> exams = examRepository.findByKeyCode(keyCode);
        if (exams.size() == 0) {
            return ResponseEntity.badRequest().body("Exam not found !");
        }

        Exam exam = exams.get(0);

        if (exam == null) {
            return ResponseEntity.badRequest().body("Exam not found !");
        }

        if (exam.getExamStartTime() == null || exam.getExamStartTime().after(new Date())
                || exam.getExamEndTime() != null && exam.getExamEndTime().before(new Date())) {
            return ResponseEntity.badRequest().body("Exam not started !");
        }

        List<Question> questions = questionRepository.findByExamExamId(exam.getExamId());
        questions.forEach(
                question -> {
                    List<Answer> answers = question.getAnswers();
                    Collections.shuffle(answers);
                    answers.forEach(
                            answer -> {
                                answer.setIsCorrect(false);
                            });
                });
        // random question
        Collections.shuffle(questions);

        List<UserAnswer> userAnswers = userAnswerRepository.findByUserAnswerEmail(userEmail);

        TakeExamResponse takeExamResponse = new TakeExamResponse();
        UserAnswer userAnswer = new UserAnswer();

        if (userAnswers.size() > 0) {
            userAnswer = userAnswers.get(0);

            takeExamResponse.message = "Valid Account";
            takeExamResponse.questions = questions;
            takeExamResponse.status = 201;
            takeExamResponse.userAnswer = userAnswer;

        } else {
            userAnswer.setUserAnswerEmail(userEmail);
            userAnswer.setUserAnswerName(userName);
            userAnswer.setUserAnswerId(GlobalUtil.getUUID());
            userAnswerRepository.save(userAnswer);

            takeExamResponse.message = "Invalid Account";
            takeExamResponse.questions = questions;
            takeExamResponse.status = 200;
            takeExamResponse.userAnswer = userAnswer;

        }

        ExamResult examResult = new ExamResult();
        examResult.setExam(exam);
        examResult.setExamResultId(GlobalUtil.getUUID());
        examResult.setScore(0);
        examResult.setStartTime(new Date());
        examResult.setUserAnswer(userAnswer);

        examResultRepository.save(examResult);
        takeExamResponse.ExamResultId = examResult.getExamResultId();

        return ResponseEntity.ok(takeExamResponse);

    }

    public class TakeExamResponse {
        public String message;
        public List<Question> questions;
        public int status;
        public UserAnswer userAnswer;
        public String ExamResultId;
    }

}