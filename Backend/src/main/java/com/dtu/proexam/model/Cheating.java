package com.dtu.proexam.model;

import java.util.HashSet;
import java.util.Set;

import com.fasterxml.jackson.annotation.JsonManagedReference;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;

@Entity
@Table(name = "Cheating")
public class Cheating {
    @Id
    @Column(name = "cheating_code")
    private int cheatingCode;

    @Column(name = "cheating_type")
    private String cheatingType;

    @OneToMany(mappedBy = "cheating")
    @JsonManagedReference
    private Set<ExamResultCheating> examResultCheatings = new HashSet<ExamResultCheating>() {
        
    };

    public Cheating() {
    }

    public Cheating(int cheatingCode, String cheatingType) {
        this.cheatingCode = cheatingCode;
        this.cheatingType = cheatingType;
    }

    /**
     * @return int return the cheatingCode
     */
    public int getCheatingCode() {
        return cheatingCode;
    }

    /**
     * @param cheatingCode the cheatingCode to set
     */
    public void setCheatingCode(int cheatingCode) {
        this.cheatingCode = cheatingCode;
    }

    /**
     * @return String return the cheatingType
     */
    public String getCheatingType() {
        return cheatingType;
    }

    /**
     * @param cheatingType the cheatingType to set
     */
    public void setCheatingType(String cheatingType) {
        this.cheatingType = cheatingType;
    }

    /**
     * @return Set<ExamResultCheating> return the examResultCheatings
     */
    public Set<ExamResultCheating> getExamResultCheatings() {
        return examResultCheatings;
    }

    /**
     * @param examResultCheatings the examResultCheatings to set
     */
    public void setExamResultCheatings(Set<ExamResultCheating> examResultCheatings) {
        this.examResultCheatings = examResultCheatings;
    }

}
