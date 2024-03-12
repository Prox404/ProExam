package com.dtu.proexam.repository;

import com.dtu.proexam.model.Question;

import java.util.List;

import jakarta.transaction.Transactional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface QuestionRepository extends JpaRepository<Question, String> {
    List<Question> findByExamExamId(String examId);


    void deleteQuestionsByExam_ExamId(String examId);

    long countByExam_ExamId(String examId);
}
