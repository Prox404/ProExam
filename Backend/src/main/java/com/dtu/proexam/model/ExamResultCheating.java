package com.dtu.proexam.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import java.util.Date;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

@Entity
@Table(name = "exam_result_cheating")
public class ExamResultCheating {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "exam_result_cheating_id")
    private Long examResultCheatingId;

    @ManyToOne
    @JoinColumn(name = "exam_result_id")
    @JsonBackReference
    private ExamResult examResult;

    @ManyToOne
    // @JsonBackReference
    @JsonIgnoreProperties("examResultCheatings")
    @JoinColumn(name = "cheating_code")
    private Cheating cheating;

    @Column(name = "cheating_time")
    @JsonFormat(pattern="dd/MM/yyyy HH:mm:ss", timezone="Asia/Ho_Chi_Minh")
    private Date cheatingTime;

    public ExamResultCheating() {
        this.cheatingTime = new Date();
    }

    public ExamResultCheating(ExamResult examResult, Cheating cheating) {
        this.examResult = examResult;
        this.cheating = cheating;
        this.cheatingTime = new Date();
    }

    /**
     * @return Long return the examResultCheatingId
     */
    public Long getExamResultCheatingId() {
        return examResultCheatingId;
    }

    /**
     * @param examResultCheatingId the examResultCheatingId to set
     */
    public void setExamResultCheatingId(Long examResultCheatingId) {
        this.examResultCheatingId = examResultCheatingId;
    }

    /**
     * @return ExamResult return the examResult
     */
    public ExamResult getExamResult() {
        return examResult;
    }

    /**
     * @param examResult the examResult to set
     */
    public void setExamResult(ExamResult examResult) {
        this.examResult = examResult;
    }

    /**
     * @return Cheating return the cheating
     */
    public Cheating getCheating() {
        return cheating;
    }

    /**
     * @param cheating the cheating to set
     */
    public void setCheating(Cheating cheating) {
        this.cheating = cheating;
    }


    /**
     * @return Date return the cheatingTime
     */
    public Date getCheatingTime() {
        return cheatingTime;
    }

    /**
     * @param cheatingTime the cheatingTime to set
     */
    public void setCheatingTime(Date cheatingTime) {
        this.cheatingTime = cheatingTime;
    }

}
