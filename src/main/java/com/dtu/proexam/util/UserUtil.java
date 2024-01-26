package com.dtu.proexam.util;

import org.springframework.jdbc.core.JdbcTemplate;

import com.dtu.proexam.model.Users;

public final class UserUtil {
    private static JdbcTemplate jdbcTemplate;

    private UserUtil() {
    }
    
    public static void setJdbcTemplate(JdbcTemplate jdbcTemplate) {
        UserUtil.jdbcTemplate = jdbcTemplate;
    }

    public static boolean isUserValid(Users user) {
        if (user == null)
            return false;
        if (user.getUserName() == null || user.getUserName().isEmpty())
            return false;
        if (user.getUserPassword() == null || user.getUserPassword().isEmpty())
            return false;
        if (user.getUserEmail() == null || user.getUserEmail().isEmpty())
            return false;
        return true;
    }

    public static boolean hasEmail(String userEmail) {
        String sql = "select count(1) from users where userEmail = (?)";
        int result = jdbcTemplate.queryForObject(sql, Integer.class, userEmail);
        if (result > 0)
            return true;
        else
            return false;
    }
}
