package com.dtu.proexam.repository;

import com.dtu.proexam.model.Question;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.dtu.proexam.model.Answer;

public interface AnswerRepository extends JpaRepository<Answer, String> {

    Answer findByAnswerIdAndQuestion(String answerId, Question question);

    List<Answer> findByQuestionQuestionId(String questionId);

    void deleteAnswersByQuestion(Question question);
}
