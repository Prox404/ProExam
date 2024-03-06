package com.dtu.proexam;

import java.util.TimeZone;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.jdbc.core.JdbcTemplate;

import jakarta.annotation.PostConstruct;

@SpringBootApplication
@ComponentScan("com.dtu.proexam")

public class ProexamApplication implements CommandLineRunner {

	private org.slf4j.Logger logger = org.slf4j.LoggerFactory.getLogger(ProexamApplication.class);

	@Autowired
	private JdbcTemplate jdbcTemplate;

	public static void main(String[] args) {
		SpringApplication.run(ProexamApplication.class, args);
	}

	@Override
	public void run(String... args) throws Exception {
		// db connected successfully
		String sql = "select * from test";
		int result = jdbcTemplate.query(sql, (rs) -> {
			int count = 0;
			while (rs.next( )) {
				count++;
			}
			return count;
		});
		if (result > 0)
			logger.info("Connected to database");
		else
			logger.info("Failed to connect to database");
	}

	@PostConstruct
	public void init() {
		// TimeZone.setDefault(TimeZone.getTimeZone("UTC"));
		logger.info("Spring boot application running in UTC timezone :" + new java.util.Date());
	}

}
