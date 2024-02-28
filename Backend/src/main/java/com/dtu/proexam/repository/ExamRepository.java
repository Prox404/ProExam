package com.dtu.proexam.repository;

import java.util.List;

import com.dtu.proexam.model.Users;
import org.apache.catalina.User;
import org.springframework.data.jpa.repository.JpaRepository;

import com.dtu.proexam.model.Exam;

public interface ExamRepository extends JpaRepository<Exam, String> {

    List<Exam> findByKeyCode(int keyCode);
    List<Exam> findByUser(Users uid);
}
