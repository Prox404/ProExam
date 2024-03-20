package com.dtu.proexam.model;

import java.util.Date;

import com.fasterxml.jackson.annotation.JsonFormat;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;

@Entity
@Table(name = "question_bank")
public class QuestionBank {
    @Id
    @Column(name = "bank_id")
    private String bankId;

    @Column(name = "bank_name", columnDefinition = "nvarchar(255)")
    private String bankName;

    @Column(name = "bank_created_at")
    @JsonFormat(pattern="dd/MM/yyyy HH:mm:ss", timezone="Asia/Ho_Chi_Minh")
    private Date bankCreatedAt;

    @ManyToOne
    @JoinColumn(name = "user_id")
    private Users user;

    public QuestionBank() {
        this.bankCreatedAt = new Date();
    }

    public QuestionBank(String bankId, String bankName, Users user) {
        this.bankId = bankId;
        this.bankName = bankName;
        this.user = user;
        this.bankCreatedAt = new Date();
    }

    public QuestionBank(String bankId, String bankName, Users user, Date bankCreatedAt) {
        this.bankId = bankId;
        this.bankName = bankName;
        this.user = user;
        this.bankCreatedAt = bankCreatedAt;
    }

    // Getters and setters

    /**
     * @return String return the bankId
     */
    public String getBankId() {
        return bankId;
    }

    /**
     * @param bankId the bankId to set
     */
    public void setBankId(String bankId) {
        this.bankId = bankId;
    }

    /**
     * @return String return the bankName
     */
    public String getBankName() {
        return bankName;
    }

    /**
     * @param bankName the bankName to set
     */
    public void setBankName(String bankName) {
        this.bankName = bankName;
    }

    /**
     * @return Date return the bankCreatedAt
     */
    public Date getBankCreatedAt() {
        return bankCreatedAt;
    }

    /**
     * @param bankCreatedAt the bankCreatedAt to set
     */
    public void setBankCreatedAt(Date bankCreatedAt) {
        this.bankCreatedAt = bankCreatedAt;
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
