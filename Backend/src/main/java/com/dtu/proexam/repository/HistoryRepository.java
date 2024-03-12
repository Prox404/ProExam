package com.dtu.proexam.repository;
import com.dtu.proexam.model.Answer;
import com.dtu.proexam.model.CorrectAnswersResponse;
import com.dtu.proexam.model.Exam;
import com.dtu.proexam.model.History;
import com.dtu.proexam.model.ListAnswerSelected;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.stereotype.Repository;

import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

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

    public List<ListAnswerSelected> getAnswerList(String examId, String uid){
        String sql = "SELECT h.selected_answer_id, a.answer_text, q.question_text, q.question_id, a.is_correct, ar.exam_result_id," +
                " ca.answer_id as correct_answer_id, ca.answer_text as correct_answer_text, ca.is_correct as iscorrect_answer " +
                " FROM History h " +
                " JOIN exam_result ar ON ar.exam_result_id = h.exam_result_id AND ar.user_answer_id = ? " +
                " JOIN Answer a ON a.answer_id = h.selected_answer_id " +
                " JOIN Question q ON a.question_id = q.question_id " +
                " LEFT JOIN Answer ca ON q.question_id = ca.question_id AND ca.is_correct = 1 " +
                " WHERE ar.exam_id = ?";
        return jdbcTemplate.query(sql, (rs, rowNum) ->
                new ListAnswerSelected(
                        rs.getString("selected_answer_id"),
                        rs.getString("answer_text"),
                        rs.getString("question_text"),
                        rs.getString("question_id"),
                        rs.getBoolean("is_correct"),
                        rs.getString("exam_result_id"),
                        new Answer(
                                rs.getString("correct_answer_id"),
                                rs.getString("correct_answer_text"),
                                rs.getBoolean("iscorrect_answer")
                        )
                ), uid, examId);
    }


    public String getListHistoryQuestion(String examId) {
        String sql = "SELECT " +
                "E.user_answer_id," +
                "E.exam_result_id, " +
                "H.selected_answer_id, " +
                "CASE WHEN A.is_correct = 1 THEN 'true' ELSE 'false' END AS iscorrect " +
                "FROM " + "History H " +
                "INNER JOIN exam_result E ON H.exam_result_id = E.exam_result_id " +
                "INNER JOIN Answer A ON H.selected_answer_id = A.answer_id " +
                "WHERE E.exam_id = ?";

        List<Map<String, Object>> rows = jdbcTemplate.queryForList(sql, examId);

        List<Map<String, Object>> resultList = new ArrayList<>();
        Map<String, Object> result = new HashMap<>();

        String currentUserAnswerId = null;
        String currentExamResultId = null;
        List<Map<String, Object>> result1 = new ArrayList<>();

        for (Map<String, Object> row : rows) {
            String userAnswerId = (String) row.get("user_answer_id");
            String exam_result_id = (String) row.get("exam_result_id");
            if (!exam_result_id.equals(currentExamResultId)) {
                if (currentUserAnswerId != null && currentExamResultId !=null) {
                    result.put("user_answer_id", currentUserAnswerId);
                    result.put("exam_result_id", currentExamResultId);
                    result.put("result1", result1);
                    resultList.add(result);
                }
                result = new HashMap<>();
                result1 = new ArrayList<>();
                currentUserAnswerId = userAnswerId;
                currentExamResultId = exam_result_id;
            }

            Map<String, Object> answer = new HashMap<>();
            answer.put("selected_answer_id", row.get("selected_answer_id"));
            answer.put("iscorrect", row.get("iscorrect"));
            result1.add(answer);
        }

        if (currentUserAnswerId != null && currentExamResultId!=null) {
            result.put("user_answer_id", currentUserAnswerId);
            result.put("exam_result_id", currentExamResultId);
            result.put("result1", result1);
            resultList.add(result);
        }

        ObjectMapper objectMapper = new ObjectMapper();
        try {
            String jsonResult = objectMapper.writeValueAsString(resultList);
            return jsonResult;
        } catch (Exception e) {
            e.printStackTrace();
            return null;
        }
    }

    public List<History> findByExamExamId(String examId) {
        // TODO Auto-generated method stub
        String sql = "SELECT * FROM History where exam_result_id = '"+examId+"'";
        return jdbcTemplate.query(sql, (rs, rowNum) ->
                new History(
                        rs.getString("exam_result_id"),
                        rs.getString("selected_answer_id"),
                        rs.getString("question_id")
                ));
    }


//     public List<CorrectAnswersResponse> getNumberOfCorrectAnswers(String examId) {
// //        String sql = "SELECT COUNT(h.selected_answer_id) FROM History h JOIN Answer a ON h.selected_answer_id = a.answer_id JOIN exam_result e ON h.exam_result_id = e.exam_result_id WHERE e.user_answer_id = ? AND e.exam_id = ? AND a.is_correct = ?";
//         String sql = "SELECT er.exam_id, er.user_answer_id, u.user_answer_name, u.user_answer_email,er.score, " +
//                 "SUM(CASE WHEN a.is_correct = ? THEN 1 ELSE 0 END) AS correctAnswerCount, " +
//                 "SUM(CASE WHEN a.is_correct = ? THEN 1 ELSE 0 END) AS incorrectAnswerCount, " +
//                 "er.start_time, er.end_time " +
//                 "FROM exam_result er " +
//                 "JOIN Exam e ON er.exam_id = e.exam_id " +
//                 "JOIN History h ON er.exam_result_id = h.exam_result_id " +
//                 "JOIN Answer a ON h.selected_answer_id = a.answer_id " +
//                 "JOIN user_answer u ON er.user_answer_id = u.user_answer_id " +
//                 "WHERE e.exam_id = ? " +
//                 "GROUP BY er.exam_id, er.user_answer_id, u.user_answer_name, u.user_answer_email, er.start_time, er.end_time,er.score ";
//         return jdbcTemplate.query(sql, new Object[]{ true, false, examId}, new RowMapper<CorrectAnswersResponse>() {
//             @Override
//             public CorrectAnswersResponse mapRow(ResultSet rs, int rowNum) throws SQLException {
//                 CorrectAnswersResponse result = new CorrectAnswersResponse();
//                 result.setExamResultId(rs.getString("exam_id"));
//                 result.setUserAnswerId(rs.getString("user_answer_id"));
//                 result.setUserAnswerName(rs.getString("user_answer_name"));
//                 result.setUserAnswerEmail(rs.getString("user_answer_email"));
//                 result.setCorrectAnswerCount(rs.getInt("correctAnswerCount"));
//                 result.setIncorrectAnswerCount(rs.getInt("incorrectAnswerCount"));
//                 result.setEndTime(rs.getString("end_time"));
//                 result.setStartTime(rs.getString("start_time"));
//                 result.setScore(rs.getFloat("score"));
//                 return result;
//             }
//         });

    // }



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
