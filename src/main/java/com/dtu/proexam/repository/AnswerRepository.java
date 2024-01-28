package com.dtu.proexam.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.dtu.proexam.model.Answer;

public interface AnswerRepository extends JpaRepository<Answer, String> {
    
}
