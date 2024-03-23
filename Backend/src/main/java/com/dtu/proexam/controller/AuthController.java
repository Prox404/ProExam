package com.dtu.proexam.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.security.crypto.bcrypt.BCrypt;
import org.springframework.util.StringUtils;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.dtu.proexam.model.Users;
import com.dtu.proexam.util.GlobalUtil;
import com.dtu.proexam.util.JwtUtil;
import com.dtu.proexam.util.LoggingUntil;
import com.dtu.proexam.util.UserUtil;

@RestController
@CrossOrigin(origins = "*", allowedHeaders = "*")
@RequestMapping("/auth")
public class AuthController {
    private JdbcTemplate jdbcTemplate;
    LoggingUntil loggingUntil;
    JwtUtil jwtUtil;

    public AuthController(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
        loggingUntil = new LoggingUntil();
        UserUtil.setJdbcTemplate(jdbcTemplate);
        jwtUtil = new JwtUtil();
    }

    @GetMapping("/")
    public ResponseEntity<?> index() {
        return ResponseEntity.ok("Auth!");
    }

    @PostMapping("/register")
    public ResponseEntity<?> storeUser(@RequestBody Users user) {
        loggingUntil.info("AuthController", "Register");
        SimpleResponse simpleResponse = new SimpleResponse();
        if (user.getUserEmail().trim() == null || user.getUserEmail().isEmpty()
                || user.getUserPassword().trim() == null || user.getUserPassword().isEmpty()
                || user.getUserName().trim() == null || user.getUserName().isEmpty()) {
            return ResponseEntity.badRequest().body(new SimpleResponse(400, "Invalid user", null));
        }
        if (!UserUtil.isUserValid(user))
            return ResponseEntity.badRequest().body(new SimpleResponse(400, "Invalid user", null));
        if (UserUtil.hasEmail(user.getUserEmail())) {
            return ResponseEntity.badRequest().body(new SimpleResponse(400, "Email already exists", null));
        }
        String sql = "insert into users(user_id, user_name, user_password, user_email) values(?,?,?,?)";
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
            simpleResponse.status = 200;
            simpleResponse.message = "User stored";
            simpleResponse.data = user;
            return ResponseEntity.ok(simpleResponse);
        } else {
            simpleResponse.status = 400;
            simpleResponse.message = "Failed to store user";
            return ResponseEntity.badRequest().body(simpleResponse);
        }
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Users user) {
        if (user.getUserEmail() == null || user.getUserEmail().isEmpty()
                || user.getUserPassword() == null || user.getUserPassword().isEmpty()) {
            return ResponseEntity.badRequest().body(new SimpleResponse(400, "Invalid user", null));
        }
        if (!UserUtil.hasEmail(user.getUserEmail())) {
            return ResponseEntity.badRequest().body(new SimpleResponse(400, "Email not found", null));
        }
        String sql = "select user_id, user_name, user_email from users where user_email = (?)";
        Users result = jdbcTemplate.queryForObject(sql, (rs, rowNum) -> {
            Users u = new Users();
            u.setUserId(rs.getString("user_id"));
            u.setUserName(rs.getString("user_name"));
            return u;
        }, user.getUserEmail());
        
        if (result == null)
            return ResponseEntity.badRequest().body(new SimpleResponse(400, "Failed to login", null));
        else {
            // check password
            sql = "select user_password from users where user_email = (?)";
            String password = jdbcTemplate.queryForObject(sql, String.class, user.getUserEmail());
            if (BCrypt.checkpw(user.getUserPassword(), password)) {
                result.setUserEmail(user.getUserEmail());
                SimpleResponse simpleResponse = new SimpleResponse();
                simpleResponse.status = 200;
                simpleResponse.message = "Login success";
                simpleResponse.data = result;
                simpleResponse.token = jwtUtil.generateToken(result);
                return ResponseEntity.ok(simpleResponse);
            } else {
                SimpleResponse simpleResponse = new SimpleResponse();
                simpleResponse.status = 400;
                simpleResponse.message = "Failed to login";
                return ResponseEntity.badRequest().body(simpleResponse);
            }
        }

    }

    public class SimpleResponse {
        public int status;
        public String message;
        public Object data;
        public String token;

        public SimpleResponse(int status,
                String message,
                Object data,
                String token) {
            this.status = status;
            this.message = message;
            this.data = data;
            this.token = token;
        }

        public SimpleResponse(int status,
                String message,
                Object data) {
            this.status = status;
            this.message = message;
            this.data = data;
        }

        public SimpleResponse() {
        }
    }
}
