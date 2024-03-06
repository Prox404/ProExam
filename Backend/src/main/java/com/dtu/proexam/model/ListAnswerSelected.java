package com.dtu.proexam.model;

public class ListAnswerSelected {
    private String user_answer_selected;
    private String answer_text;
    private String question_text;
    private String question_id;
    private boolean is_correct;
    private String exam_result;
    private Answer answer_correct;

    public Answer getAnswer_correct() {
        return answer_correct;
    }

    public void setAnswer_correct(Answer answer_correct) {
        this.answer_correct = answer_correct;
    }

    public ListAnswerSelected(String user_answer_selected, String answer_text, String question_text, String question_id, boolean is_correct, String exam_result, Answer answer) {
        this.user_answer_selected = user_answer_selected;
        this.answer_text = answer_text;
        this.question_text = question_text;
        this.question_id = question_id;
        this.is_correct = is_correct;
        this.exam_result = exam_result;
        this.answer_correct = answer;
    }

    public String getUser_answer_selected() {
        return user_answer_selected;
    }

    public void setUser_answer_selected(String user_answer_selected) {
        this.user_answer_selected = user_answer_selected;
    }

    public String getAnswer_text() {
        return answer_text;
    }

    public String getExam_result() {
        return exam_result;
    }

    public void setExam_result(String exam_result) {
        this.exam_result = exam_result;
    }

    public void setAnswer_text(String answer_text) {
        this.answer_text = answer_text;
    }

    public String getQuestion_text() {
        return question_text;
    }

    public void setQuestion_text(String question_text) {
        this.question_text = question_text;
    }

    public String getQuestion_id() {
        return question_id;
    }

    public void setQuestion_id(String question_id) {
        this.question_id = question_id;
    }

    public boolean isIs_correct() {
        return is_correct;
    }

    public void setIs_correct(boolean is_correct) {
        this.is_correct = is_correct;
    }
}
