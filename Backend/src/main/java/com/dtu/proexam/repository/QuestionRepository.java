package com.dtu.proexam.repository;

import com.dtu.proexam.model.Question;
import com.dtu.proexam.model.QuestionBank;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

public interface QuestionRepository extends JpaRepository<Question, String> {
    List<Question> findByExamExamId(String examId);
    void deleteQuestionsByExam_ExamId(String examId);
    long countByExam_ExamId(String examId);
    List<Question> findByQuestionBankBankId(String bankId);
    void deleteQuestionsByQuestionBank(QuestionBank questionBank);
}
