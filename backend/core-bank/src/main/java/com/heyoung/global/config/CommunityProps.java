package com.heyoung.global.config;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Configuration;
import org.springframework.stereotype.Component;

import java.util.Map;

@Component
@Setter @Getter
@ConfigurationProperties(prefix = "community")
public class CommunityProps {
    private String baseUrl;
    private Webhook webhook = new Webhook();

    @Getter @Setter
    public static class Webhook {
        private Map<String, String> endpoints;
    }

    // 편의 메서드 : 타입 키로 endpoint 가져오기.
    public String endpointOf(String typeKey) {
        return (webhook == null || webhook.getEndpoints() == null) ? null : webhook.getEndpoints().get(typeKey);
    }

}
