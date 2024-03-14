package com.dtu.proexam.model;

import java.sql.Timestamp;
import java.util.Date;

public class ExamWithParticipantCountDTO {
    public String examId;
    public String examName;
    public Date examStartTime;
    public Date examEndTime;
    public int numberSubmit;
    public int keyCode;
    public int isPublic;
    public int duration;
    public int totalParticipants;

    public ExamWithParticipantCountDTO() {
    }

    public ExamWithParticipantCountDTO(String examId, String examName, Date examStartTime, Date examEndTime, int numberSubmit, int keyCode, int isPublic, int duration, int totalParticipants) {
        this.examId = examId;
        this.examName = examName;
        this.examStartTime = examStartTime;
        this.examEndTime = examEndTime;
        this.numberSubmit = numberSubmit;
        this.keyCode = keyCode;
        this.isPublic = isPublic;
        this.duration = duration;
        this.totalParticipants = totalParticipants;
    }

    public ExamWithParticipantCountDTO(String examId, String examName, Timestamp examStartTime, Timestamp examEndTime, Integer numberSubmit, Integer keyCode, Integer isPublic, Integer duration, Long totalParticipants) {
        this.examId = examId;
        this.examName = examName;
        this.examStartTime = new Date(examStartTime.getTime());
        this.examEndTime = new Date(examEndTime.getTime());
        this.numberSubmit = numberSubmit;
        this.keyCode = keyCode;
        this.isPublic = isPublic;
        this.duration = duration;
        this.totalParticipants = totalParticipants.intValue();
    }
}
