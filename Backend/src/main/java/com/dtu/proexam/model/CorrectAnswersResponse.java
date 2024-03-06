package com.dtu.proexam.model;

public class CorrectAnswersResponse {
    private String examResultId;
    private String userAnswerId;

    public String getUserAnswerName() {
        return userAnswerName;
    }



    private String userAnswerName;
    private String userAnswerEmail;
    private String startTime;
    private String endTime;

    private int correctAnswerCount;
    private int incorrectAnswerCount;
    public void setUserAnswerName(String userAnswerName) {
        this.userAnswerName = userAnswerName;
    }

    public int getIncorrectAnswerCount() {
        return incorrectAnswerCount;
    }

    public void setIncorrectAnswerCount(int incorrectAnswerCount) {
        this.incorrectAnswerCount = incorrectAnswerCount;
    }

    public String getUserAnswerEmail() {
        return userAnswerEmail;
    }

    public void setUserAnswerEmail(String userAnswerEmail) {
        this.userAnswerEmail = userAnswerEmail;
    }

    public String getStartTime() {
        return startTime;
    }

    public void setStartTime(String startTime) {
        this.startTime = startTime;
    }

    public String getEndTime() {
        return endTime;
    }

    public void setEndTime(String endTime) {
        this.endTime = endTime;
    }
    public String getExamResultId() {
        return examResultId;
    }

    public void setExamResultId(String examResultId) {
        this.examResultId = examResultId;
    }

    public String getUserAnswerId() {
        return userAnswerId;
    }

    public void setUserAnswerId(String userAnswerId) {
        this.userAnswerId = userAnswerId;
    }

    public int getCorrectAnswerCount() {
        return correctAnswerCount;
    }

    public void setCorrectAnswerCount(int correctAnswerCount) {
        this.correctAnswerCount = correctAnswerCount;
    }
// Getters và setters
}