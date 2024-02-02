package com.dtu.proexam.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.dtu.proexam.model.ExamResult;

public interface ExamResultRepository extends JpaRepository<ExamResult, String> {

    List<ExamResult> findByExamResultId(String examResultId);
    
}
