package com.dtu.proexam.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "UserAnswer")
public class UserAnswer {
    @Id
    @Column(name = "user_answer_id")
    private String userAnswerId;

    @Column(name = "user_answer_name")
    private String userAnswerName;

    @Column(name = "user_answer_email", unique = true)
    private String userAnswerEmail;

    // Constructors, getters, and setters

    public UserAnswer() {
    }

    public UserAnswer(String userAnswerId, String userAnswerName, String userAnswerEmail) {
        this.userAnswerId = userAnswerId;
        this.userAnswerName = userAnswerName;
        this.userAnswerEmail = userAnswerEmail;
    }

    public UserAnswer(String userAnswerName, String userAnswerEmail) {
        this.userAnswerName = userAnswerName;
        this.userAnswerEmail = userAnswerEmail;
    }

    /**
     * @return String return the userAnswerId
     */
    public String getUserAnswerId() {
        return userAnswerId;
    }

    /**
     * @param userAnswerId the userAnswerId to set
     */
    public void setUserAnswerId(String userAnswerId) {
        this.userAnswerId = userAnswerId;
    }

    /**
     * @return String return the userAnswerName
     */
    public String getUserAnswerName() {
        return userAnswerName;
    }

    /**
     * @param userAnswerName the userAnswerName to set
     */
    public void setUserAnswerName(String userAnswerName) {
        this.userAnswerName = userAnswerName;
    }

    /**
     * @return String return the userAnswerEmail
     */
    public String getUserAnswerEmail() {
        return userAnswerEmail;
    }

    /**
     * @param userAnswerEmail the userAnswerEmail to set
     */
    public void setUserAnswerEmail(String userAnswerEmail) {
        this.userAnswerEmail = userAnswerEmail;
    }

}