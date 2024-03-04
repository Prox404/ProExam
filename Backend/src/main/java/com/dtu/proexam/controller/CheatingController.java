package com.dtu.proexam.controller;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.dtu.proexam.model.Cheating;
import com.dtu.proexam.model.ExamResult;
import com.dtu.proexam.model.ExamResultCheating;
import com.dtu.proexam.repository.CheatingRopository;
import com.dtu.proexam.repository.ExamResultCheatingRepository;
import com.dtu.proexam.repository.ExamResultRepository;
import com.fasterxml.jackson.databind.node.ObjectNode;

import org.springframework.web.bind.annotation.RequestBody;

import java.util.List;
import java.util.Optional;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;

@RestController
@CrossOrigin(origins = "*", allowedHeaders = "*")
@RequestMapping("/cheating")
public class CheatingController {
    CheatingRopository cheatingRopository;
    ExamResultCheatingRepository examResultCheatingRepository;
    ExamResultRepository examResultRepository;

    public CheatingController(CheatingRopository cheatingRopository,
            ExamResultCheatingRepository examResultCheatingRepository,
            ExamResultRepository examResultRepository) {
        this.cheatingRopository = cheatingRopository;
        this.examResultCheatingRepository = examResultCheatingRepository;
        this.examResultRepository = examResultRepository;
    }

    @PostMapping("/detected")
    public ResponseEntity<?> detectedCheating(@RequestBody ObjectNode objectNode) {
        try {
            int cheatingCode = Integer.parseInt(objectNode.get("cheatingCode").asText());
            String examResultId = objectNode.get("examResultId").asText();
            Optional<Cheating> cheating = cheatingRopository.findById(cheatingCode);
            if (!cheating.isPresent()) {
                return ResponseEntity.badRequest().body("Cheating not found");
            }
            List<ExamResult> exam_results = examResultRepository.findByExamResultId(examResultId);
            ExamResult examResult = exam_results.get(0);
            if (examResult == null) {
                return ResponseEntity.badRequest().body("Exam result not found");
            }

            ExamResultCheating examResultCheating = new ExamResultCheating();
            examResultCheating.setCheating(cheating.get());
            examResultCheating.setExamResult(examResult);

            examResultCheatingRepository.save(examResultCheating);
        
            SimpleResponse simpleResponse = new SimpleResponse();
            simpleResponse.status = 200;
            simpleResponse.message = "Cheating detected";

            return ResponseEntity.ok(simpleResponse);

        } catch (Exception e) {
            SimpleResponse simpleResponse = new SimpleResponse();
            simpleResponse.status = 400;
            simpleResponse.message = "Invalid request";
            return ResponseEntity.badRequest().body(simpleResponse);
        }
    }

    @PostMapping("/store")
    public ResponseEntity<?> storeCheatingRule(@RequestBody ObjectNode objectNode) {
        int cheatingCode = Integer.parseInt(objectNode.get("cheatingCode").asText());
        String cheatingName = objectNode.get("cheatingType").asText();
        Cheating cheating = new Cheating(cheatingCode, cheatingName);
        cheatingRopository.save(cheating);
        return ResponseEntity.ok(cheating);
    }

    public class SimpleResponse {
        public int status;
        public String message;
    }

}
