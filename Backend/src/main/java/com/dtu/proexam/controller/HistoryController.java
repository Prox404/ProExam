package com.dtu.proexam.controller;

import com.dtu.proexam.model.CorrectAnswersResponse;
import com.dtu.proexam.model.Exam;
import com.dtu.proexam.model.ExamResult;
import com.dtu.proexam.model.History;
import com.dtu.proexam.model.ListAnswerSelected;
import com.dtu.proexam.model.Question;
import com.dtu.proexam.repository.ExamRepository;
import com.dtu.proexam.repository.ExamResultRepository;
import com.dtu.proexam.repository.HistoryRepository;
import com.dtu.proexam.repository.QuestionRepository;
import com.dtu.proexam.util.LoggingUntil;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;

@RestController
@RequestMapping("/history")
public class HistoryController {

    private final HistoryRepository historyRepository;
    private final ExamRepository examRepository;
    private final LoggingUntil loggingUntil;
    private final JdbcTemplate jdbcTemplate;

    public HistoryController(HistoryRepository historyRepository, ExamRepository examRepository,
            JdbcTemplate jdbcTemplate) {
        this.historyRepository = historyRepository;
        this.examRepository = examRepository;
        loggingUntil = new LoggingUntil();
        this.jdbcTemplate = jdbcTemplate;
    }

    @GetMapping("/list")
    public List<History> getAllHistories() {
        return historyRepository.getAllHistories();
    }

    @GetMapping("/numbercorrect/{examId}")
    public ResponseEntity<?> getAllHistories(@PathVariable String examId) {
        // return historyRepository.getNumberOfCorrectAnswers(examId);
        Exam exam = examRepository.findById(examId).orElse(null);
        if (exam == null) {
            return ResponseEntity.badRequest()
                    .body(new BasicResponse(examId, 0, new ArrayList<CorrectAnswersResponse>()));
        }
        String query = "SELECT exam_result.*, count(question.question_id) as number_question, exam.exam_name, exam.key_code, exam.number_submit, user_answer.user_answer_name, user_answer.user_answer_email "
                +
                "FROM exam_result, user_answer, exam, question " +
                "WHERE exam_result.exam_id = exam.exam_id AND exam.exam_id = question.exam_id " +
                "AND exam.exam_id = '" + examId + "' " +
                "AND user_answer.user_answer_id = exam_result.user_answer_id " +
                "GROUP BY user_answer.user_answer_name,user_answer.user_answer_email, exam_result.exam_result_id, exam_result.score, " +
                "exam_result.start_time, exam_result.start_time, exam_result.end_time, exam_result.exam_id, exam_result.user_answer_id, "
                +
                "exam.exam_name, exam.key_code, exam.number_submit";
        
        List<NumberCorrectResponse> numberCorrectResponses = jdbcTemplate.query(query, (rs, rowNum) -> {
            return new NumberCorrectResponse(
                    rs.getString("exam_id"),
                    rs.getString("exam_result_id"),
                    rs.getString("user_answer_name"),
                    rs.getString("user_answer_email"),
                    rs.getInt("number_question"),
                    rs.getString("exam_name"),
                    rs.getTimestamp("start_time"),
                    rs.getTimestamp("end_time"),
                    rs.getInt("key_code"),
                    rs.getInt("score")
            );
        });
        return ResponseEntity.ok(new BasicResponse("Successful !", 200, numberCorrectResponses));

    }

    @GetMapping("/listQuestion/{examId}")
    public String getlistQuestion(@PathVariable String examId) {
        return historyRepository.getListHistoryQuestion(examId);
    }

    @GetMapping("/getListAnswer/{examId}/{uid}")
    public List<ListAnswerSelected> getListAnswer(@PathVariable String examId, @PathVariable String uid) {
        return historyRepository.getAnswerList(examId, uid);
    }

    public class NumberCorrectResponse{
        public String examId = "";
        public String examResultId = "";
        public String userAnswerName= "";
        public String userAnswerEmail= "";
        public int numberQuestion = 0;
        public String examName = "";
        public Date startTime = new Date();
        public Date endTime = new Date();
        public int keyCode = 0;
        public int score = 0;

        public NumberCorrectResponse(String examId, String examResultId, String userAnswerName, String userAnswerEmail, int numberQuestion, String examName, Date startTime, Date endTime, int keyCode, int score) {
            this.examId = examId;
            this.examResultId = examResultId;
            this.userAnswerName = userAnswerName;
            this.userAnswerEmail = userAnswerEmail;
            this.numberQuestion = numberQuestion;
            this.examName = examName;
            this.startTime = startTime;
            this.endTime = endTime;
            this.keyCode = keyCode;
            this.score = score;
        }
    }

    public class BasicResponse {
        public String message;
        public int status;
        public Object data;

        public BasicResponse(String message, int status, Object data) {
            this.message = message;
            this.status = status;
            this.data = data;
        }

        public BasicResponse(String message, int status) {
            this.message = message;
            this.status = status;
        }
    }
}
