package com.heyoung;

import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.DynamicPropertyRegistry;
import org.springframework.test.context.DynamicPropertySource;
import org.testcontainers.containers.PostgreSQLContainer;
import org.testcontainers.junit.jupiter.Container;
import org.testcontainers.junit.jupiter.Testcontainers;

/**
 * 컨텍스트 로딩 스모크 테스트.
 *
 * <p>운영/CI 의 실제 DB 설정(secret)에 의존하지 않도록, Testcontainers 로 일회용 PostgreSQL 을
 * 띄우고 write/read 데이터소스를 그 컨테이너로 덮어쓴다. 덕분에 어떤 환경에서도 자립적으로 통과한다.
 */
@SpringBootTest
@Testcontainers
class HeyoungCoreBankApplicationTests {

	@Container
	static final PostgreSQLContainer<?> POSTGRES = new PostgreSQLContainer<>("postgres:16");

	@DynamicPropertySource
	static void datasourceProperties(DynamicPropertyRegistry registry) {
		for (String role : new String[] {"write", "read"}) {
			registry.add("spring.datasource." + role + ".jdbc-url", POSTGRES::getJdbcUrl);
			registry.add("spring.datasource." + role + ".username", POSTGRES::getUsername);
			registry.add("spring.datasource." + role + ".password", POSTGRES::getPassword);
			registry.add("spring.datasource." + role + ".driver-class-name", () -> "org.postgresql.Driver");
		}
	}

	@Test
	void contextLoads() {
	}
}
