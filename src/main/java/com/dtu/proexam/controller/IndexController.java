package com.dtu.proexam.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.dtu.proexam.util.LoggingUntil;

@RestController
@RequestMapping("/")
public class IndexController {
    @GetMapping
    public ResponseEntity<?> index() {
        LoggingUntil loggingUntil = new LoggingUntil();
        loggingUntil.info("IndexController", "Hello World!");
        return ResponseEntity.ok("Hello World!");
    }
}
