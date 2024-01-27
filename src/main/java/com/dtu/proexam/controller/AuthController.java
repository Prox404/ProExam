package com.dtu.proexam.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.security.crypto.bcrypt.BCrypt;
import org.springframework.util.StringUtils;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.dtu.proexam.model.Users;
import com.dtu.proexam.util.GlobalUtil;
import com.dtu.proexam.util.LoggingUntil;
import com.dtu.proexam.util.UserUtil;

@RestController
@RequestMapping("/auth")
public class AuthController {
    private JdbcTemplate jdbcTemplate;
    LoggingUntil loggingUntil;

    public AuthController(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
        loggingUntil = new LoggingUntil();
        UserUtil.setJdbcTemplate(jdbcTemplate);
    }

    @GetMapping("/")
    public ResponseEntity<?> index() {
        return ResponseEntity.ok("Auth!");
    }

    @PostMapping("/register")
    public ResponseEntity<?> storeUser(@RequestBody Users user) {
        loggingUntil.info("AuthController", "Register");
        if (user.getUserEmail().trim() == null || user.getUserEmail().isEmpty()
                || user.getUserPassword().trim() == null || user.getUserPassword().isEmpty()
                || user.getUserName().trim() == null || user.getUserName().isEmpty()
        ) {
            return ResponseEntity.badRequest().body("Invalid user");
        }
        if (!UserUtil.isUserValid(user))
        return ResponseEntity.badRequest().body("Invalid user");
        if (UserUtil.hasEmail(user.getUserEmail())) {
            return ResponseEntity.badRequest().body("Email already exists");
        }
        String sql = "insert into users values(?,?,?,?)";
        String userId = GlobalUtil.getUUID();
        user.setUserId(userId);

        // bcrypt password
        user.setUserPassword(StringUtils.trimAllWhitespace(user.getUserPassword()));
        user.setUserPassword(BCrypt.hashpw(user.getUserPassword(), BCrypt.gensalt()));

        int result = jdbcTemplate.update(sql, user.getUserId(), user.getUserName(), user.getUserPassword(),
                user.getUserEmail());
        if (result > 0) {
            user.setUserPassword(null);
            // return user json
            return ResponseEntity.ok(user);
        } else
            return ResponseEntity.badRequest().body("Failed to store user");
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Users user) {
        if (user.getUserEmail() == null || user.getUserEmail().isEmpty()
                || user.getUserPassword() == null || user.getUserPassword().isEmpty()
        ) {
            return ResponseEntity.badRequest().body("Invalid user");
        }
        if (!UserUtil.hasEmail(user.getUserEmail())){
            return ResponseEntity.badRequest().body("Email does not exist");
        }
        String sql = "select UserID, UserName from users where userEmail = (?)";
        Users result = jdbcTemplate.queryForObject(sql, (rs, rowNum) -> {
            Users u = new Users();
            u.setUserId(rs.getString("UserID"));
            u.setUserName(rs.getString("UserName"));
            return u;
        }, user.getUserEmail());
        if (result == null)
            return ResponseEntity.badRequest().body("Failed to login");
        else {
            // check password
            sql = "select userPassword from users where userEmail = (?)";
            String password = jdbcTemplate.queryForObject(sql, String.class, user.getUserEmail());
            if (BCrypt.checkpw(user.getUserPassword(), password)) {
                return ResponseEntity.ok(result);
            } else
                return ResponseEntity.badRequest().body("Failed to login");
        }

    }
}
