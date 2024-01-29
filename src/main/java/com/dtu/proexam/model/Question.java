package com.dtu.proexam.model;


import java.util.ArrayList;
import java.util.List;


import com.fasterxml.jackson.annotation.JsonManagedReference;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;

@Entity
@Table(name = "Question")
public class Question {
    @Id
    @Column(name = "question_id")
    private String questionId;

    @Column(name = "question_text")
    private String questionText;

    @ManyToOne
    @JoinColumn(name = "exam_id")
    private Exam exam;

    @OneToMany(mappedBy = "question")
    @JsonManagedReference
    private List<Answer> answers = new ArrayList<>();

    // Constructors, getters, and setters

    public Question() {
    }

    public Question(String questionId, String questionText, Exam exam) {
        this.questionId = questionId;
        this.questionText = questionText;
        this.exam = exam;
    }

    public Question(String questionText, Exam exam) {
        this.questionText = questionText;
        this.exam = exam;
    }

    public Question(String questionId, String questionText, Exam exam, List<Answer> answers) {
        this.questionId = questionId;
        this.questionText = questionText;
        this.exam = exam;
        if (answers != null) {
            this.answers = answers;
        }
    }

    public Question( String questionText, Exam exam, List<Answer> answers) {
        this.questionText = questionText;
        this.exam = exam;
        if (answers != null) {
            this.answers = answers;
        }
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

    /**
     * @return String return the questionText
     */
    public String getQuestionText() {
        return questionText;
    }

    /**
     * @param questionText the questionText to set
     */
    public void setQuestionText(String questionText) {
        this.questionText = questionText;
    }

    /**
     * @return Exam return the exam
     */
    public Exam getExam() {
        return exam;
    }

    /**
     * @param exam the exam to set
     */
    public void setExam(Exam exam) {
        this.exam = exam;
    }


    /**
     * @return List<Answer> return the answers
     */
    public List<Answer> getAnswers() {
        return answers;
    }

    /**
     * @param answers the answers to set
     */
    public void setAnswers(List<Answer> answers) {
        this.answers = answers;
    }

    public String toString() {
        return "Question [questionId=" + questionId + ", questionText=" + questionText + ", exam=" + exam + "]";
    }

}
