package com.dtu.proexam.model;

import java.sql.Date;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;

@Entity
public class Exam {
    @Id
    private String examID;
    private String examName;
    private Date examStartTime;
    private Date examEndTime;
    private int numberSubmit;
    private int keyCode;

    @ManyToOne
    @JoinColumn(name = "userID")
    private Users user;

    public Exam() {
    }

    public Exam(String examID, String examName, Date examStartTime,
            Date examEndTime, int numberSubmit, int keyCode, Users user) {
        this.examID = examID;
        this.examName = examName;
        this.examStartTime = examStartTime;
        this.examEndTime = examEndTime;
        this.numberSubmit = numberSubmit;
        this.keyCode = keyCode;
        this.user = user;
    }

    public Exam( String examName, Date examStartTime,
            Date examEndTime, int numberSubmit, int keyCode, Users user) {
        this.examName = examName;
        this.examStartTime = examStartTime;
        this.examEndTime = examEndTime;
        this.numberSubmit = numberSubmit;
        this.keyCode = keyCode;
        this.user = user;
    }

    // Getters and setters
    /**
     * @return String return the examID
     */
    public String getExamID() {
        return examID;
    }

    /**
     * @param examID the examID to set
     */
    public void setExamID(String examID) {
        this.examID = examID;
    }

    /**
     * @return String return the examName
     */
    public String getExamName() {
        return examName;
    }

    /**
     * @param examName the examName to set
     */
    public void setExamName(String examName) {
        this.examName = examName;
    }

    /**
     * @return Date return the examStartTime
     */
    public Date getExamStartTime() {
        return examStartTime;
    }

    /**
     * @param examStartTime the examStartTime to set
     */
    public void setExamStartTime(Date examStartTime) {
        this.examStartTime = examStartTime;
    }

    /**
     * @return Date return the examEndTime
     */
    public Date getExamEndTime() {
        return examEndTime;
    }

    /**
     * @param examEndTime the examEndTime to set
     */
    public void setExamEndTime(Date examEndTime) {
        this.examEndTime = examEndTime;
    }

    /**
     * @return int return the numberSubmit
     */
    public int getNumberSubmit() {
        return numberSubmit;
    }

    /**
     * @param numberSubmit the numberSubmit to set
     */
    public void setNumberSubmit(int numberSubmit) {
        this.numberSubmit = numberSubmit;
    }

    /**
     * @return int return the keyCode
     */
    public int getKeyCode() {
        return keyCode;
    }

    /**
     * @param keyCode the keyCode to set
     */
    public void setKeyCode(int keyCode) {
        this.keyCode = keyCode;
    }

    /**
     * @return Users return the user
     */
    public Users getUser() {
        return user;
    }

    /**
     * @param user the user to set
     */
    public void setUser(Users user) {
        this.user = user;
    }

}
