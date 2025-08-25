package com.heyoung.global.config;

import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.client.reactive.ReactorClientHttpConnector;
import org.springframework.web.reactive.function.client.ExchangeStrategies;
import org.springframework.web.reactive.function.client.WebClient;

import reactor.netty.http.client.HttpClient;

import java.time.Duration;

@Configuration
@RequiredArgsConstructor
public class WebClientConfig {

    private final int MAX_IN_MEMORY_SIZE = 4 * 1024 * 1024;

    @Bean("communityWebClient")
    public WebClient communityWebClient(CommunityProps communityProps) {

        String baseUrl = communityProps.getBaseUrl();

        HttpClient http = HttpClient.create()
                .responseTimeout(Duration.ofSeconds(10)) // 서버 응답 타임아웃
                .compress(true);

        return WebClient.builder()
                .baseUrl(baseUrl)
                .clientConnector(new ReactorClientHttpConnector(http))
                .exchangeStrategies(
                        ExchangeStrategies.builder()
                                .codecs(c -> c.defaultCodecs().maxInMemorySize(MAX_IN_MEMORY_SIZE))
                                .build()
                ).build();
    }
}
