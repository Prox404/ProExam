package com.dtu.proexam.util;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import org.springframework.stereotype.Component;

import com.dtu.proexam.model.Users;

import java.util.Date;
import java.util.HashMap;
import java.util.Map;
import java.util.function.Function;
import org.springframework.beans.factory.annotation.Value;

@Component
public class JwtUtil {

    @Value("${jwt.secret.key}")
    private String SECRET_KEY = "skhjkasdhfhaFJIAHIFAhdaoisjdoiaohFYSDGAHFBS73464hsgfuysgfuisghyugFHSFHSUIdasiouha";

    @Value("${jwt.expiration.time}")
    private long EXPIRATION_TIME = 86400000;

    public String generateToken(Users user) {
        Map<String, Object> claims = new HashMap<>();
        // add user details to claims if needed
        return createToken(claims, user.getUserEmail());
    }

    private String createToken(Map<String, Object> claims, String subject) {
        return Jwts.builder()
                .setClaims(claims)
                .setSubject(subject)
                .setIssuedAt(new Date(System.currentTimeMillis()))
                .setExpiration(new Date(System.currentTimeMillis() + EXPIRATION_TIME))
                .signWith(SignatureAlgorithm.HS256, SECRET_KEY)
                .compact();
    }

    public boolean validateToken(String token) {
        return extractClaim(token, Claims::getExpiration).after(new Date());
    }

    public <T> T extractClaim(String token, Function<Claims, T> claimsResolver) {
        final Claims claims = extractAllClaims(token);
        return claimsResolver.apply(claims);
    }

    private Claims extractAllClaims(String token) {
        return Jwts.parser().setSigningKey(SECRET_KEY).parseClaimsJws(token).getBody();
    }
}
