package com.dtu.proexam.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import com.dtu.proexam.model.UserAnswer;

public interface UserAnswerRepository extends JpaRepository<UserAnswer, String> {

    UserAnswer findByUserAnswerEmail(String email);

    List<UserAnswer> findByUserAnswerId(String userAnswerId);
    
}
