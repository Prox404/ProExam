package com.dtu.proexam.repository;

import java.util.List;

import com.dtu.proexam.model.Exam;
import org.springframework.data.jpa.repository.JpaRepository;

import com.dtu.proexam.model.ExamResult;
import org.springframework.data.jpa.repository.Query;

public interface ExamResultRepository extends JpaRepository<ExamResult, String> {

    List<ExamResult> findByExamResultId(String examResultId);
    @Query("SELECT er FROM ExamResult er WHERE er.exam.examId = ?1")
    List<ExamResult> findByExam(String examid);
    @Query("SELECT AVG(er.score) FROM ExamResult er WHERE er.exam.examId = ?1")
    Double findAverageScoreByExamId(String examId);
}
