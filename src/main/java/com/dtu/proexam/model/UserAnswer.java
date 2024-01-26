package com.dtu.proexam.model;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;

@Entity
public class UserAnswer {
    @Id
    private String userAnswerID;
    private String userAnswerName;
    private String userAnswerEmail;

    public UserAnswer() {
    }

    public UserAnswer(String userAnswerID, String userAnswerName, String userAnswerEmail) {
        this.userAnswerID = userAnswerID;
        this.userAnswerName = userAnswerName;
        this.userAnswerEmail = userAnswerEmail;
    }

    public UserAnswer(String userAnswerName, String userAnswerEmail) {
        this.userAnswerName = userAnswerName;
        this.userAnswerEmail = userAnswerEmail;
    }

    // Getters and setters

    /**
     * @return String return the userAnswerID
     */
    public String getUserAnswerID() {
        return userAnswerID;
    }

    /**
     * @param userAnswerID the userAnswerID to set
     */
    public void setUserAnswerID(String userAnswerID) {
        this.userAnswerID = userAnswerID;
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