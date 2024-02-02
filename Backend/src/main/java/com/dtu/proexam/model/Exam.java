package com.dtu.proexam.model;

import java.util.Date;


import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;

@Entity
@Table(name = "Exam")
public class Exam {
    @Id
    @Column(name = "exam_id")
    private String examId;

    @Column(name = "exam_name")
    private String examName;

    @Column(name = "exam_start_time")
    private Date examStartTime;

    @Column(name = "exam_end_time")
    private Date examEndTime;

    @Column(name = "number_submit")
    private int numberSubmit;

    @Column(name = "key_code")
    private int keyCode;

    @Column(name = "is_public")
    private int isPublic;

    @ManyToOne
    @JoinColumn(name = "user_id")
    private Users user;

    public Exam() {
    }

    public Exam(String examId, String examName, Date examStartTime, Date examEndTime, int numberSubmit, int keyCode,
            Users user) {
        this.examId = examId;
        this.examName = examName;
        this.examStartTime = examStartTime;
        this.examEndTime = examEndTime;
        this.numberSubmit = numberSubmit;
        this.keyCode = keyCode;
        this.user = user;
    }

    public Exam(String examName, Date examStartTime, Date examEndTime, int numberSubmit, int keyCode, Users user) {
        this.examName = examName;
        this.examStartTime = examStartTime;
        this.examEndTime = examEndTime;
        this.numberSubmit = numberSubmit;
        this.keyCode = keyCode;
        this.user = user;
    }


    /**
     * @return String return the examId
     */
    public String getExamId() {
        return examId;
    }

    /**
     * @param examId the examId to set
     */
    public void setExamId(String examId) {
        this.examId = examId;
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
     * @return User return the user
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


    /**
     * @return int return the isPublic
     */
    public int getIsPublic() {
        return isPublic;
    }

    /**
     * @param isPublic the isPublic to set
     */
    public void setIsPublic(int isPublic) {
        this.isPublic = isPublic;
    }

}