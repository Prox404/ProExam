package com.dtu.proexam.model;

import com.fasterxml.jackson.annotation.JsonBackReference;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;

@Entity
@Table(name = "Answer")
public class Answer {
    @Id
    @Column(name = "answer_id")
    private String answerId;

    @Column(name = "answer_text", columnDefinition = "nvarchar")
    private String answerText;

    @Column(name = "is_correct")
    private boolean isCorrect;

    @ManyToOne
    @JoinColumn(name = "question_id")
    @JsonBackReference
    private Question question;

    public Answer() {
    }

    public Answer(String answerId, String answerText, boolean isCorrect, Question question) {
        this.answerId = answerId;
        this.answerText = answerText;
        this.isCorrect = isCorrect;
        this.question = question;
    }

    public Answer(String answerText, boolean isCorrect, Question question) {
        this.answerText = answerText;
        this.isCorrect = isCorrect;
        this.question = question;
    }

    public Answer(String answerText, boolean isCorrect) {
        this.answerText = answerText;
        this.isCorrect = isCorrect;
    }

    public Answer(String answerId, String answerText, boolean isCorrect) {
        this.answerText = answerText;
        this.isCorrect = isCorrect;
        this.answerId = answerId;
    }

    // Getters and setters

    /**
     * @return String return the answerId
     */
    public String getAnswerId() {
        return answerId;
    }

    /**
     * @param answerId the answerId to set
     */
    public void setAnswerId(String answerId) {
        this.answerId = answerId;
    }

    /**
     * @return String return the answerText
     */
    public String getAnswerText() {
        return answerText;
    }

    /**
     * @param answerText the answerText to set
     */
    public void setAnswerText(String answerText) {
        this.answerText = answerText;
    }

    /**
     * @return boolean return the isCorrect
     */
    public boolean isIsCorrect() {
        return isCorrect;
    }

    /**
     * @param isCorrect the isCorrect to set
     */
    public void setIsCorrect(boolean isCorrect) {
        this.isCorrect = isCorrect;
    }

    /**
     * @return Question return the question
     */
    public Question getQuestion() {
        return question;
    }

    /**
     * @param question the question to set
     */
    public void setQuestion(Question question) {
        this.question = question;
    }

}