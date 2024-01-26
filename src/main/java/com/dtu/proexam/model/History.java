package com.dtu.proexam.model;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;

@Entity
public class History {
    @Id
    private String examResultID;

    @ManyToOne
    @JoinColumn(name = "selectedAnswerID")
    private Answer selectedAnswer;

    @ManyToOne
    @JoinColumn(name = "questionID")
    private Question question;

    public History() {
    }

    public History(String examResultID, Answer selectedAnswer, Question question) {
        this.examResultID = examResultID;
        this.selectedAnswer = selectedAnswer;
        this.question = question;
    }

    // Getters and setters

    /**
     * @return String return the examResultID
     */
    public String getExamResultID() {
        return examResultID;
    }

    /**
     * @param examResultID the examResultID to set
     */
    public void setExamResultID(String examResultID) {
        this.examResultID = examResultID;
    }

    /**
     * @return Answer return the selectedAnswer
     */
    public Answer getSelectedAnswer() {
        return selectedAnswer;
    }

    /**
     * @param selectedAnswer the selectedAnswer to set
     */
    public void setSelectedAnswer(Answer selectedAnswer) {
        this.selectedAnswer = selectedAnswer;
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