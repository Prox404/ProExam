package com.dtu.proexam.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.dtu.proexam.model.ExamResultCheating;

public interface ExamResultCheatingRepository extends JpaRepository<ExamResultCheating, Long>{
    
}
