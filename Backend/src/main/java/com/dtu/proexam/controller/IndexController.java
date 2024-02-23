package com.dtu.proexam.controller;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.stream.Collectors;

import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.dtu.proexam.util.LoggingUntil;

@RestController
@CrossOrigin(origins = "*", allowedHeaders = "*")
@RequestMapping("/")
public class IndexController {
    @GetMapping
    public ResponseEntity<String> index() {
        LoggingUntil loggingUntil = new LoggingUntil();
        loggingUntil.info("IndexController", "Hello World!");
        String filePath = "src/main/java/com/dtu/proexam/resources/document.txt";
        try {
            String content = readTextFile(filePath);
            HttpHeaders httpHeaders = new HttpHeaders();
            httpHeaders.setContentType(org.springframework.http.MediaType.TEXT_PLAIN);
            return new ResponseEntity<String>(content, httpHeaders, HttpStatus.OK);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.badRequest().body("Error reading file");
        }

    }

    private String readTextFile(String filePath) throws IOException {
        Path path = Paths.get(filePath);
        return Files.lines(path)
                .collect(Collectors.joining("\n"));
    }
}
