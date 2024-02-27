package com.dtu.proexam.controller;

import java.io.InputStream;
import java.util.ArrayList;
import java.util.Collections;
import java.util.Date;
import java.util.List;
import java.util.concurrent.atomic.AtomicReference;

import org.apache.poi.hwpf.HWPFDocument;
import org.apache.poi.hwpf.extractor.WordExtractor;
import org.springframework.http.ResponseEntity;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import com.dtu.proexam.model.Answer;
import com.dtu.proexam.model.Exam;
import com.dtu.proexam.model.ExamResult;
import com.dtu.proexam.model.History;
import com.dtu.proexam.model.Question;
import com.dtu.proexam.model.UserAnswer;
import com.dtu.proexam.repository.AnswerRepository;
import com.dtu.proexam.repository.ExamRepository;
import com.dtu.proexam.repository.ExamResultRepository;
import com.dtu.proexam.repository.QuestionRepository;
import com.dtu.proexam.repository.UserAnswerRepository;
import com.dtu.proexam.repository.UserRepository;
import com.dtu.proexam.util.GlobalUtil;
import com.dtu.proexam.util.LoggingUntil;
import com.fasterxml.jackson.databind.node.ObjectNode;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;

@RestController
@CrossOrigin(origins = "*", allowedHeaders = "*")
@RequestMapping("/exam")
public class ExamController {
    private JdbcTemplate jdbcTemplate;
    LoggingUntil loggingUntil;
    private final ExamRepository examRepository;
    private QuestionRepository questionRepository;
    private AnswerRepository answerRepository;
    private UserAnswerRepository userAnswerRepository;
    private ExamResultRepository examResultRepository;
    private final float MAX_SCORE = 10;

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
        this.userAnswerRepository = userAnswerRepository;
        this.examResultRepository = examResultRepository;
    }

    private boolean isUniqueKeyCode(int keyCode) {
        return examRepository.findByKeyCode(keyCode).size() == 0;
    }

    @PostMapping("/store")
    public ResponseEntity<?> storeExam(@RequestBody Exam exam) {
        if (exam.getUser() == null || exam.getUser().getUserId() == null
                || exam.getExamName() == null || exam.getExamName().isEmpty()
                || exam.getKeyCode() < 100000 || exam.getKeyCode() > 999999) {
            return ResponseEntity.badRequest().body("Unstable data !");
        }

        if (!isUniqueKeyCode(exam.getKeyCode())) {
            return ResponseEntity.badRequest().body("Key code is not unique !");
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

    @PostMapping("/uploadQuestions/{examId}")
    public ResponseEntity<?> uploadQuestions(@PathVariable String examId, @RequestBody List<Question> questions) {
        Exam exam = examRepository.findById(examId).orElse(null);
        if(exam == null) {
            return ResponseEntity.badRequest().body("Exam not found !");
        }

        for(Question question : questions) {
            question.setExam(exam);
            if (question.getAnswers().isEmpty()) continue;
            if (question.getQuestionId() == null || question.getQuestionId().isEmpty()) question.setQuestionId(GlobalUtil.getUUID());
            if (question.getAnswers().stream().filter(Answer::isIsCorrect).count() > 1)
                question.setQuestionType(Question.QuestionType.MULTIPLE_CHOICE);
            questionRepository.save(question);
            for (Answer answer : question.getAnswers()) {
                if (answer.getAnswerId() == null || answer.getAnswerId().isEmpty())
                    answer.setAnswerId(GlobalUtil.getUUID());
                answer.setQuestion(question);
                answerRepository.save(answer);
            }
        }
        return ResponseEntity.ok(questions);
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

    @GetMapping("/getAnswer")
    public ResponseEntity<?> getMethodName(@RequestParam String questionId) {
        List<Answer> answers = answerRepository.findByQuestionQuestionId(questionId);
        return ResponseEntity.ok(answers);
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
            if (!file.getContentType().equals("application/msword")) {
                return ResponseEntity.badRequest().body("Only .doc files are allowed.");
            }

            Exam exam = examRepository.findById(examId).orElse(null);
            if (exam == null) {
                return ResponseEntity.badRequest().body("Exam not found !");
            }

            InputStream inputStream = file.getInputStream();
            HWPFDocument doc = new HWPFDocument(inputStream);
            WordExtractor extractor = new WordExtractor(doc);
            String text = extractor.getText();
            extractor.close();

            List<Question> questions = parseQuestions(text, exam);

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

    @PostMapping("/chooseAnwser/{examResultId}")
    public ResponseEntity<?> chooseAnwser(
            @PathVariable(required = true) String examResultId,
            @RequestBody ObjectNode objectNode) {

        try {

            String questionId = objectNode.get("questionId").asText();
            String selectedAnswerId = objectNode.get("selectedAnswerId").asText();

            loggingUntil.info("chooseAnwser", "examResultId: " + examResultId + " questionId: " + questionId
                    + " selectedAnswerId: " + selectedAnswerId);

            if (examResultId == null || examResultId.isEmpty() || questionId == null || questionId.isEmpty()
                    || selectedAnswerId == null || selectedAnswerId.isEmpty()) {
                return ResponseEntity.badRequest().body("Invalid Account !");
            }

            List<ExamResult> examResults = examResultRepository.findByExamResultId(examResultId);
            loggingUntil.info("chooseAnwser", "examResults: " + examResults.size());
            if (examResults.size() == 0) {
                return ResponseEntity.badRequest().body("Exam not found !");
            }

            ExamResult examResult = examResults.get(0);

            if (examResult == null) {
                return ResponseEntity.badRequest().body("Exam not found !");
            }

            jdbcTemplate.execute("Exec CreateOrAlterHistory '" + examResultId + "', '" + questionId + "', '"
                    + selectedAnswerId + "'");

            BasicResponse basicResponse = new BasicResponse();
            basicResponse.message = "Success";
            basicResponse.status = 200;

            return ResponseEntity.ok(basicResponse);
        } catch (Exception e) {
            e.printStackTrace();
            BasicResponse basicResponse = new BasicResponse();
            basicResponse.message = "Error";
            basicResponse.status = 400;
            return ResponseEntity.badRequest().body(basicResponse);
        }
    }

    @GetMapping("/isValidKeyCode")
    public ResponseEntity<?> isValidKeyCode(@RequestParam int keyCode) {
        if (keyCode > 999999 || keyCode < 100000) {
            return ResponseEntity.badRequest().body("Invalid KeyCode !");
        }
        List<Exam> exams = examRepository.findByKeyCode(keyCode);
        loggingUntil.info("isValidKeyCode", "exams: " + exams.size());
        BasicResponse basicResponse = new BasicResponse();
        if (exams.size() > 0) {
            basicResponse.message = "Valid KeyCode";
            basicResponse.status = 200;
            return ResponseEntity.ok(basicResponse);
        }
        basicResponse.message = "Invalid KeyCode";
        basicResponse.status = 400;
        return ResponseEntity.badRequest().body(basicResponse);
    }
    

    @PostMapping("/submitExam/{examResultId}")
    public ResponseEntity<?> submitExam(
            @PathVariable(required = true) String examResultId) {

        try {

            loggingUntil.info("submitExam", "examResultId: " + examResultId);

            if (examResultId == null || examResultId.isEmpty()) {
                return ResponseEntity.badRequest().body("Invalid Account !");
            }

            List<ExamResult> examResults = examResultRepository.findByExamResultId(examResultId);
            loggingUntil.info("submitExam", "examResults: " + examResults.size());
            if (examResults.size() == 0) {
                return ResponseEntity.badRequest().body("Exam not found !");
            }

            ExamResult examResult = examResults.get(0);

            if (examResult == null) {
                return ResponseEntity.badRequest().body("Exam not found !");
            }

            List<Question> questions = questionRepository.findByExamExamId(examResult.getExam().getExamId());

            String sqlGetHistory = "Select * from History where exam_result_id = '" + examResultId + "'";
            List<History> histories = jdbcTemplate.query(sqlGetHistory,
                    (rs, rowNum) -> new History(rs.getString("exam_result_id"),
                            rs.getString("selected_answer_id"), rs.getString("question_id")));

            float scorePerQuestion = MAX_SCORE / questions.size();
            AtomicReference<Float> score = new AtomicReference<>(0.0f);

            questions.forEach(question -> {
                boolean isMultipleChoice = question.getAnswers().stream().filter(Answer::isIsCorrect).count() > 1;
                // skip if any answer incorrect in question

                if (histories.stream().anyMatch(history -> history.getQuestionId().equals(question.getQuestionId())
                        && !question.getAnswers().stream()
                                .filter(answer -> answer.isIsCorrect())
                                .anyMatch(answer -> answer.getAnswerId().equals(history.getSelectedAnswerId())))) {
                    return;
                }

                question.getAnswers().forEach(answer -> {
                    if (isMultipleChoice) {
                        if (answer.isIsCorrect() && histories.stream()
                                .anyMatch(history -> history.getQuestionId().equals(question.getQuestionId())
                                        && history.getSelectedAnswerId().equals(answer.getAnswerId()))) {
                            score.updateAndGet(currentScore -> currentScore + scorePerQuestion);
                        }
                    } else {
                        if (histories.stream()
                                .anyMatch(history -> history.getQuestionId().equals(question.getQuestionId())
                                        && history.getSelectedAnswerId().equals(answer.getAnswerId()))) {
                            score.updateAndGet(currentScore -> currentScore + scorePerQuestion);
                        }
                    }
                });
            });

            double finalScore = Math.round(score.get() * 100.0) / 100.0;
            examResult.setScore((float) finalScore);
            examResult.setEndTime(new Date());
            examResultRepository.save(examResult);

            return ResponseEntity.ok(examResult);

        } catch (Exception e) {
            e.printStackTrace();
            BasicResponse basicResponse = new BasicResponse();
            basicResponse.message = "Error";
            basicResponse.status = 400;
            return ResponseEntity.badRequest().body(basicResponse);
        }
    }

    @GetMapping("/getExamResult/{examResultId}")
    public ResponseEntity<?> getExamResult(
            @PathVariable(required = true) String examResultId) {

        try {

            loggingUntil.info("getExamResult", "examResultId: " + examResultId);

            if (examResultId == null || examResultId.isEmpty()) {
                return ResponseEntity.badRequest().body("Invalid Account !");
            }

            List<ExamResult> examResults = examResultRepository.findByExamResultId(examResultId);
            loggingUntil.info("getExamResult", "examResults: " + examResults.size());
            if (examResults.size() == 0) {
                return ResponseEntity.badRequest().body("Exam not found !");
            }

            ExamResult examResult = examResults.get(0);

            if (examResult == null) {
                return ResponseEntity.badRequest().body("Exam not found !");
            }

            Exam exam = examResult.getExam();
            if (exam.getExamEndTime() == null || exam.getExamEndTime().after(new Date())) {
                String sqlGetHistory = "Select * from History where exam_result_id = '" + examResultId + "'";
                List<History> histories = jdbcTemplate.query(sqlGetHistory,
                        (rs, rowNum) -> new History(rs.getString("exam_result_id"),
                                rs.getString("selected_answer_id"), rs.getString("question_id")));
                
                ExamResultResponse examResultResponse = new ExamResultResponse();
                examResultResponse.message = "Success";
                examResultResponse.status = 200;
                examResultResponse.examResult = examResult;
                examResultResponse.questions = questionRepository.findByExamExamId(exam.getExamId());
                examResultResponse.histories = histories;
                return ResponseEntity.ok(examResultResponse);

            } else {
                BasicResponse basicResponse = new BasicResponse();
                basicResponse.message = "Exam is not ended";
                basicResponse.status = 400;
                return ResponseEntity.badRequest().body(basicResponse);
            }

        } catch (Exception e) {
            e.printStackTrace();
            BasicResponse basicResponse = new BasicResponse();
            basicResponse.message = "Error";
            basicResponse.status = 400;
            return ResponseEntity.badRequest().body(basicResponse);
        }
    }

    public class AnswerWithQuestion extends Answer {
        private String questionId;

        public AnswerWithQuestion(String answerId, String answerText, boolean isCorrect, String questionId) {
            super(answerId, answerText, isCorrect);
            this.questionId = questionId;
        }

        public String getQuestionId() {
            return questionId;
        }

        public void setQuestionId(String questionId) {
            this.questionId = questionId;
        }

    }

    public class ExamResultResponse {
        public String message;
        public int status;
        public ExamResult examResult;
        public List<Question> questions;
        public List<History> histories;
    }

    public class BasicResponse {
        public String message;
        public int status;
    }

    public class TakeExamResponse {
        public String message;
        public List<Question> questions;
        public int status;
        public UserAnswer userAnswer;
        public String ExamResultId;
    }

}