package com.heyoung.global.infra.fcm;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.google.auth.oauth2.GoogleCredentials;
import com.google.firebase.FirebaseApp;
import com.google.firebase.FirebaseOptions;
import com.google.firebase.messaging.FirebaseMessaging;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.io.ByteArrayInputStream;
import java.io.InputStream;
import java.nio.charset.StandardCharsets;
import java.util.HashMap;
import java.util.Map;

@Configuration
@RequiredArgsConstructor
@Slf4j
public class FirebaseConfig {

    private final FirebaseCredentials credentials;
    private final ObjectMapper objectMapper;

    @Bean
    public FirebaseMessaging firebaseMessaging() throws Exception {

        Map<String, Object> credentialsMap = new HashMap<>();
        credentialsMap.put("type", credentials.getType());
        credentialsMap.put("project_id", credentials.getProjectId());
        credentialsMap.put("private_key_id", credentials.getPrivateKeyId());
        credentialsMap.put("private_key", credentials.getPrivateKey());
        credentialsMap.put("client_email", credentials.getClientEmail());
        credentialsMap.put("client_id", credentials.getClientId());
        credentialsMap.put("auth_uri", credentials.getAuthUri());
        credentialsMap.put("token_uri", credentials.getTokenUri());
        credentialsMap.put("auth_provider_x509_cert_url", credentials.getAuthProviderX509CertUrl());
        credentialsMap.put("client_x509_cert_url", credentials.getClientX509CertUrl());
        credentialsMap.put("universe_domain", credentials.getUniverseDomain());

        String credentialsJson = objectMapper.writeValueAsString(credentialsMap);

        // InputStream을 직접 사용 (FileInputStream 불필요)
        InputStream credentialsStream = new ByteArrayInputStream(
                credentialsJson.getBytes(StandardCharsets.UTF_8)
        );

        FirebaseOptions options = FirebaseOptions.builder()
                .setCredentials(GoogleCredentials.fromStream(credentialsStream))
                .build();

        if (FirebaseApp.getApps().isEmpty()) {
            FirebaseApp.initializeApp(options);
            log.info("Firebase App initialized successfully");
        }

        return FirebaseMessaging.getInstance();
    }


}
