package com.dtu.proexam.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "History")
public class History {
    @Id
    @Column(name = "exam_result_id")
    private String examResultId;

    @Id
    @Column(name = "selected_answer_id")
    private String selectedAnswerId;

    @Id
    @Column(name = "question_id")
    private String questionId;

    // Constructors, getters, and setters

    public History() {
    }

    public History(String examResultId, String selectedAnswerId, String questionId) {
        this.examResultId = examResultId;
        this.selectedAnswerId = selectedAnswerId;
        this.questionId = questionId;
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
     * @return String return the selectedAnswerId
     */
    public String getSelectedAnswerId() {
        return selectedAnswerId;
    }

    /**
     * @param selectedAnswerId the selectedAnswerId to set
     */
    public void setSelectedAnswerId(String selectedAnswerId) {
        this.selectedAnswerId = selectedAnswerId;
    }

    /**
     * @return String return the questionId
     */
    public String getQuestionId() {
        return questionId;
    }

    /**
     * @param questionId the questionId to set
     */
    public void setQuestionId(String questionId) {
        this.questionId = questionId;
    }

}