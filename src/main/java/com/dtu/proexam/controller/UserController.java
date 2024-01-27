package com.dtu.proexam.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/user")
public class UserController {
    private JdbcTemplate jdbcTemplate;
    private int numberUsersPerPage = 20;

    public UserController(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    
    @GetMapping("/")
    public ResponseEntity<?> getListOfUsers(@RequestParam(required = false) Integer page) {
        String sql = "SELECT UserID, UserName FROM users";
        if (page != null && page > 0)
            sql += " LIMIT " + numberUsersPerPage + " OFFSET " + (page - 1) * numberUsersPerPage;

        List<?> users = jdbcTemplate.queryForList(sql);

        return ResponseEntity.ok(users);
    }

}
