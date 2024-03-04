package com.dtu.proexam.repository;
import com.dtu.proexam.model.CorrectAnswersResponse;
import com.dtu.proexam.model.History;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.stereotype.Repository;

import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.List;

@Repository
public class HistoryRepository {

    private final JdbcTemplate jdbcTemplate;

    @Autowired
    public HistoryRepository(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    public List<History> getAllHistories() {
        return jdbcTemplate.query("SELECT * FROM History", (rs, rowNum) ->
                new History(
                        rs.getString("exam_result_id"),
                        rs.getString("selected_answer_id"),
                        rs.getString("question_id")
                )
        );
    }
    public List<CorrectAnswersResponse> getNumberOfCorrectAnswers(String examId) {
//        String sql = "SELECT COUNT(h.selected_answer_id) FROM History h JOIN Answer a ON h.selected_answer_id = a.answer_id JOIN exam_result e ON h.exam_result_id = e.exam_result_id WHERE e.user_answer_id = ? AND e.exam_id = ? AND a.is_correct = ?";
        String sql = "SELECT er.exam_id, er.user_answer_id, u.user_answer_name, u.user_answer_email, " +
                "SUM(CASE WHEN a.is_correct = ? THEN 1 ELSE 0 END) AS correctAnswerCount, " +
                "SUM(CASE WHEN a.is_correct = ? THEN 1 ELSE 0 END) AS incorrectAnswerCount, " +
                "er.start_time, er.end_time " +
                "FROM exam_result er " +
                "JOIN Exam e ON er.exam_id = e.exam_id " +
                "JOIN History h ON er.exam_result_id = h.exam_result_id " +
                "JOIN Answer a ON h.selected_answer_id = a.answer_id " +
                "JOIN user_answer u ON er.user_answer_id = u.user_answer_id " +
                "WHERE e.exam_id = ? " +
                "GROUP BY er.exam_id, er.user_answer_id, u.user_answer_name, u.user_answer_email, er.start_time, er.end_time";
        return jdbcTemplate.query(sql, new Object[]{ true, false, examId}, new RowMapper<CorrectAnswersResponse>() {
            @Override
            public CorrectAnswersResponse mapRow(ResultSet rs, int rowNum) throws SQLException {
                CorrectAnswersResponse result = new CorrectAnswersResponse();
                result.setExamResultId(rs.getString("exam_id"));
                result.setUserAnswerId(rs.getString("user_answer_id"));
                result.setUserAnswerName(rs.getString("user_answer_name"));
                result.setUserAnswerEmail(rs.getString("user_answer_email"));
                result.setCorrectAnswerCount(rs.getInt("correctAnswerCount"));
                result.setIncorrectAnswerCount(rs.getInt("incorrectAnswerCount"));
                result.setEndTime(rs.getString("end_time"));
                result.setStartTime(rs.getString("start_time"));
                return result;
            }
        });
    }



//public  int getNumberOfCorrectAnswers() {
//    try (Connection conn = DriverManager.getConnection(DB_URL, USER, PASS);
//         PreparedStatement stmt = conn.prepareStatement(
//                 "SELECT examResult.uid, COUNT(answer.isCorrect) AS total_correct_answers " +
//                         "FROM history " +
//                         "JOIN examResult ON history.exam_result_id = examResult.examResultId " +
//                         "JOIN answer ON history.user_answer_selected = answer.answerId AND answer.isCorrect = 1 " +
//                         "GROUP BY examResult.uid");
//         ResultSet rs = stmt.executeQuery()) {
//
//        while (rs.next()) {
//            int uid = rs.getInt("uid");
//            int totalCorrectAnswers = rs.getInt("total_correct_answers");
//            System.out.println("UID: " + uid + ", Total Correct Answers: " + totalCorrectAnswers);
//        }
//    } catch (SQLException e) {
//        e.printStackTrace();
//    }

}

//@Query("SELECT COUNT(h.selectedAnswerId) FROM History h JOIN Answer a ON h.selectedAnswerId = a.answerId JOIN ExamResult e ON h.examResultId = e.examResultId WHERE e.userAnswer.userAnswerId = ?1 AND e.exam.examId = ?2 AND a.isCorrect = true")
////    int getNumberOfCorrectAnswers(String userId, String  examId);
