package com.dtu.proexam.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.dtu.proexam.model.QuestionBank;

public interface QuestionBankRepository extends JpaRepository<QuestionBank, String> {

    List<QuestionBank> findByUserUserId(String userId);

}
