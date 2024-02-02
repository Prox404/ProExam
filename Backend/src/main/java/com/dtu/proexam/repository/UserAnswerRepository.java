package com.dtu.proexam.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.dtu.proexam.model.UserAnswer;

public interface UserAnswerRepository extends JpaRepository<UserAnswer, String> {

    List<UserAnswer> findByUserAnswerEmail(String email);

    List<UserAnswer> findByUserAnswerId(String userAnswerId);
    
}
