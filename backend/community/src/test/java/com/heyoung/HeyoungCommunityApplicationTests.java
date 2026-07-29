package com.heyoung;

import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.DynamicPropertyRegistry;
import org.springframework.test.context.DynamicPropertySource;
import org.testcontainers.containers.PostgreSQLContainer;
import org.testcontainers.junit.jupiter.Container;
import org.testcontainers.junit.jupiter.Testcontainers;
import org.testcontainers.utility.DockerImageName;

/**
 * 컨텍스트 로딩 스모크 테스트.
 *
 * <p>운영/CI 의 실제 DB 설정(secret)에 의존하지 않도록, Testcontainers 로 일회용 PostGIS PostgreSQL 을
 * 띄우고 write/read 데이터소스를 그 컨테이너로 덮어쓴다(community 는 geometry 컬럼 때문에 PostGIS 필요).
 * Kafka 리스너는 브로커 없이 컨텍스트만 검증하도록 auto-startup 을 끈다.
 */
@SpringBootTest
@Testcontainers
class HeyoungCommunityApplicationTests {

	@Container
	static final PostgreSQLContainer<?> POSTGRES = new PostgreSQLContainer<>(
			DockerImageName.parse("postgis/postgis:16-3.4").asCompatibleSubstituteFor("postgres"));

	@DynamicPropertySource
	static void properties(DynamicPropertyRegistry registry) {
		for (String role : new String[] {"write", "read"}) {
			registry.add("spring.datasource." + role + ".jdbc-url", POSTGRES::getJdbcUrl);
			registry.add("spring.datasource." + role + ".username", POSTGRES::getUsername);
			registry.add("spring.datasource." + role + ".password", POSTGRES::getPassword);
			registry.add("spring.datasource." + role + ".driver-class-name", () -> "org.postgresql.Driver");
		}
		// 브로커 없이 컨텍스트 로딩만 검증 — 리스너 컨테이너 자동 기동 비활성화
		registry.add("spring.kafka.listener.auto-startup", () -> "false");
	}

	@Test
	void contextLoads() {
	}
}
