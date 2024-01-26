package com.dtu.proexam.model;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;

@Entity
public class Answer {
    @Id
    private String answerID;
    private String answerText;
    private boolean isCorrect;

    @ManyToOne
    @JoinColumn(name = "questionID")
    private Question question;


    public Answer() {
    }

    public Answer(String answerID, String answerText, boolean isCorrect, Question question) {
        this.answerID = answerID;
        this.answerText = answerText;
        this.isCorrect = isCorrect;
        this.question = question;
    }

    public Answer(String answerText, boolean isCorrect, Question question) {
        this.answerText = answerText;
        this.isCorrect = isCorrect;
        this.question = question;
    }

    // Getters and setters

    /**
     * @return String return the answerID
     */
    public String getAnswerID() {
        return answerID;
    }

    /**
     * @param answerID the answerID to set
     */
    public void setAnswerID(String answerID) {
        this.answerID = answerID;
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