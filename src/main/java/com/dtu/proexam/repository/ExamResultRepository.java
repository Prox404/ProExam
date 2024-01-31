package com.dtu.proexam.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.dtu.proexam.model.ExamResult;

public interface ExamResultRepository extends JpaRepository<ExamResult, String> {
    
}
