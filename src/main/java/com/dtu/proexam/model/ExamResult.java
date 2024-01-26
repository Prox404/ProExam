package com.dtu.proexam.model;

import java.sql.Date;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;

@Entity
public class ExamResult {
    @Id
    private String examResultID;
    private float score;
    private Date startTime;
    private Date endTime;

    @ManyToOne
    @JoinColumn(name = "userAnswerID")
    private UserAnswer userAnswer;

    @ManyToOne
    @JoinColumn(name = "examID")
    private Exam exam;

    public ExamResult() {
    }

    public ExamResult(String examResultID, float score, Date startTime, Date endTime, UserAnswer userAnswer, Exam exam) {
        this.examResultID = examResultID;
        this.score = score;
        this.startTime = startTime;
        this.endTime = endTime;
        this.userAnswer = userAnswer;
        this.exam = exam;
    }

    public ExamResult(float score, Date startTime, Date endTime, UserAnswer userAnswer, Exam exam) {
        this.score = score;
        this.startTime = startTime;
        this.endTime = endTime;
        this.userAnswer = userAnswer;
        this.exam = exam;
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
     * @return float return the score
     */
    public float getScore() {
        return score;
    }

    /**
     * @param score the score to set
     */
    public void setScore(float score) {
        this.score = score;
    }

    /**
     * @return Date return the startTime
     */
    public Date getStartTime() {
        return startTime;
    }

    /**
     * @param startTime the startTime to set
     */
    public void setStartTime(Date startTime) {
        this.startTime = startTime;
    }

    /**
     * @return Date return the endTime
     */
    public Date getEndTime() {
        return endTime;
    }

    /**
     * @param endTime the endTime to set
     */
    public void setEndTime(Date endTime) {
        this.endTime = endTime;
    }

    /**
     * @return UserAnswer return the userAnswer
     */
    public UserAnswer getUserAnswer() {
        return userAnswer;
    }

    /**
     * @param userAnswer the userAnswer to set
     */
    public void setUserAnswer(UserAnswer userAnswer) {
        this.userAnswer = userAnswer;
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
