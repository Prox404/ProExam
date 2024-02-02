package com.dtu.proexam.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;

@Entity
@Table(name = "exam_result_cheating")
public class ExamResultCheating {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "exam_result_cheating_id")
    private Long examResultCheatingId;

    @ManyToOne
    @JoinColumn(name = "exam_result_id")
    private ExamResult examResult;

    @ManyToOne
    @JoinColumn(name = "cheating_code")
    private Cheating cheating;

    public ExamResultCheating() {
    }

    public ExamResultCheating(ExamResult examResult, Cheating cheating) {
        this.examResult = examResult;
        this.cheating = cheating;
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

}
