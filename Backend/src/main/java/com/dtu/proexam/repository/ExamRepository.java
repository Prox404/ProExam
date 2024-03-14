package com.dtu.proexam.repository;

import java.util.List;
import java.util.Optional;

import com.dtu.proexam.model.ExamResult;
import com.dtu.proexam.model.ExamWithParticipantCountDTO;
import com.dtu.proexam.model.Users;
import org.apache.catalina.User;
import org.springframework.data.jpa.repository.JpaRepository;

import com.dtu.proexam.model.Exam;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface ExamRepository extends JpaRepository<Exam, String> {

    List<Exam> findByKeyCode(int keyCode);

    List<Exam> findByExamId(String examId);

    @Query("SELECT er FROM Exam er WHERE er.user.userId = ?1")
    List<Exam> findByUser(String uid);

    List<Exam> findAllByUserUserIdOrderByExamStartTimeDesc(String userId);

}
