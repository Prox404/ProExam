package com.dtu.proexam.repository;

import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

import com.dtu.proexam.model.Exam;

public interface ExamRepository extends JpaRepository<Exam, String> {

    List<Exam> findByKeyCode(int keyCode);

    List<Exam> findAllByUserUserIdOrderByExamStartTimeDesc(String userId);
}
