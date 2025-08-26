package com.heyoung;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;

@EnableJpaAuditing
@SpringBootApplication
public class HeyoungCommunityApplication {

	public static void main(String[] args) {
		SpringApplication.run(HeyoungCommunityApplication.class, args);
	}
}
