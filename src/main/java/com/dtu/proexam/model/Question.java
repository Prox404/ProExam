package com.dtu.proexam.model;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;

@Entity
public class Question {
    @Id
    private String questionID;
    private String questionText;

    @ManyToOne
    @JoinColumn(name = "examID")
    private Exam exam;

    public Question() {
    }

    public Question(String questionID, String questionText, Exam exam) {
        this.questionID = questionID;
        this.questionText = questionText;
        this.exam = exam;
    }

    public Question(String questionText, Exam exam) {
        this.questionText = questionText;
        this.exam = exam;
    }

    // Getters and setters

    /**
     * @return String return the questionID
     */
    public String getQuestionID() {
        return questionID;
    }

    /**
     * @param questionID the questionID to set
     */
    public void setQuestionID(String questionID) {
        this.questionID = questionID;
    }

    /**
     * @return String return the questionText
     */
    public String getQuestionText() {
        return questionText;
    }

    /**
     * @param questionText the questionText to set
     */
    public void setQuestionText(String questionText) {
        this.questionText = questionText;
    }

    /**
     * @return Exam return the exam
     */
    public Exam getExam() {
        return exam;
    }

    /**
     * @param exam the exam to set
     */
    public void setExam(Exam exam) {
        this.exam = exam;
    }

}
