package com.dtu.proexam.repository;

import com.dtu.proexam.model.Question;
import org.springframework.data.jpa.repository.JpaRepository;

public interface QuestionRepository extends JpaRepository<Question, String> {
    
}
