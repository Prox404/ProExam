package com.dtu.proexam.model;

import java.util.Date;
import java.util.HashSet;
import java.util.Set;

import com.fasterxml.jackson.annotation.JsonFormat;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;

@Entity
@Table(name = "ExamResult")
public class ExamResult {
    @Id
    @Column(name = "exam_result_id")
    private String examResultId;

    @Column(name = "score")
    private float score;

    @Column(name = "start_time")
    @JsonFormat(pattern="MM/dd/yyyy HH:mm:ss", timezone="Asia/Ho_Chi_Minh")
    private Date startTime;

    @Column(name = "end_time")
    @JsonFormat(pattern="MM/dd/yyyy HH:mm:ss", timezone="Asia/Ho_Chi_Minh")
    private Date endTime;

    @ManyToOne
    @JoinColumn(name = "user_answer_id")
    private UserAnswer userAnswer;

    @ManyToOne
    @JoinColumn(name = "exam_id")
    private Exam exam;

    @OneToMany(mappedBy = "examResult")
    private Set<ExamResultCheating> examResultCheatings = new HashSet<ExamResultCheating>();

    // Constructors, getters, and setters

    public ExamResult() {
    }

    public ExamResult(String examResultId, float score, Date startTime, Date endTime, UserAnswer userAnswer, Exam exam) {
        this.examResultId = examResultId;
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

    /**
     * @return String return the examResultId
     */
    public String getExamResultId() {
        return examResultId;
    }

    /**
     * @param examResultId the examResultId to set
     */
    public void setExamResultId(String examResultId) {
        this.examResultId = examResultId;
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