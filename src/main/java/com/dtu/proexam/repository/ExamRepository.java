package com.dtu.proexam.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.dtu.proexam.model.Exam;

public interface ExamRepository extends JpaRepository<Exam, String> {

}
