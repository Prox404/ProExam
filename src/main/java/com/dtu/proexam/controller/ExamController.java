package com.dtu.proexam.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.dtu.proexam.model.Exam;
import com.dtu.proexam.repository.ExamRepository;
import com.dtu.proexam.util.GlobalUtil;
import com.dtu.proexam.util.LoggingUntil;

@RestController
@RequestMapping("/exam")
public class ExamController {
    private JdbcTemplate jdbcTemplate;
    LoggingUntil loggingUntil;
    private final ExamRepository examRepository;
    
    public ExamController(JdbcTemplate jdbcTemplate, ExamRepository examRepository) {
        this.jdbcTemplate = jdbcTemplate;
        loggingUntil = new LoggingUntil();
        this.examRepository = examRepository;
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
    
}