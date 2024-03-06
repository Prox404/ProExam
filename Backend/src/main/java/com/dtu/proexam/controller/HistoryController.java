package com.dtu.proexam.controller;

import com.dtu.proexam.model.CorrectAnswersResponse;
import com.dtu.proexam.model.History;
import com.dtu.proexam.model.ListAnswerSelected;
import com.dtu.proexam.repository.HistoryRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/history")
public class HistoryController {

    private final HistoryRepository historyRepository;

    @Autowired
    public HistoryController(HistoryRepository historyRepository) {
        this.historyRepository = historyRepository;
    }

    @GetMapping("/list")
    public List<History> getAllHistories() {
        return historyRepository.getAllHistories();
    }
    @GetMapping("/numbercorrect/{examId}")
    public List<CorrectAnswersResponse> getAllHistories(@PathVariable String examId) {
        return historyRepository.getNumberOfCorrectAnswers(examId);
    }
    @GetMapping("/listQuestion/{examId}")
    public String getlistQuestion(@PathVariable String examId) {
        return historyRepository.getListHistoryQuestion(examId);
    }
    @GetMapping("/getListAnswer/{examId}/{uid}")
    public List<ListAnswerSelected> getListAnswer(@PathVariable String examId, @PathVariable String uid) {
        return historyRepository.getAnswerList(examId,uid);
    }
}
