package com.heyoung.global.infra.expo;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.heyoung.domain.notification.entity.Notification;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpHeaders;
import org.springframework.stereotype.Component;

import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.nio.charset.StandardCharsets;
import java.time.Duration;
import java.util.*;
import java.util.stream.Collectors;

@Component
@RequiredArgsConstructor
@Slf4j
public class ExpoPushSender {

    private static final String EXPO_ENDPOINT = "https://exp.host/--/api/v2/push/send";
    private static final int CHUNK_SIZE = 90; // Expo 가이드: 100 이하 권장 (여유있게 90)

    private final ObjectMapper om = new ObjectMapper();

    @Value("${expo.push.access-token:}")
    private String expoAccessToken;

    public Map<String, Boolean> sendMulticast(Notification n, List<String> expoTokens) throws Exception {
        Map<String, Boolean> result = new LinkedHashMap<>();
        if (expoTokens == null || expoTokens.isEmpty()) return result;

        // 유효한 Expo 토큰만 선별
        List<String> tokens = expoTokens.stream()
                .filter(ExpoPushSender::looksLikeExpoToken)
                .distinct()
                .toList();

        if (tokens.isEmpty()) return result;

        // 90개 단위로 쪼개서 보냄
        for (int i = 0; i < tokens.size(); i += CHUNK_SIZE) {
            List<String> chunk = tokens.subList(i, Math.min(tokens.size(), i + CHUNK_SIZE));
            Map<String, Boolean> chunkResult = sendChunk(n, chunk);
            result.putAll(chunkResult);
        }
        return result;
    }

    private Map<String, Boolean> sendChunk(Notification n, List<String> tokens) throws Exception {
        // 메시지 배열 만들기
        List<Map<String, Object>> messages = new ArrayList<>(tokens.size());
        for (String t : tokens) {
            Map<String, Object> msg = new LinkedHashMap<>();
            msg.put("to", t);
            msg.put("title", n.getTitle());
            msg.put("body", n.getContent());
            msg.put("sound", "default");
            msg.put("priority", "high");
            // 앱에서 클릭 시 열 페이지/딥링크가 있으면 data로
            msg.put("data", Map.of(
                    "clickUrl", n.getClickUrl(),
                    "notificationId", n.getId()
            ));
            // 필요하면 badge, ttl, channelId 등 추가 가능
            messages.add(msg);
        }

        String json = om.writeValueAsString(messages);

        HttpRequest.Builder rb = HttpRequest.newBuilder()
                .uri(URI.create(EXPO_ENDPOINT))
                .timeout(Duration.ofSeconds(10))
                .header(HttpHeaders.ACCEPT, "application/json")
                .header(HttpHeaders.CONTENT_TYPE, "application/json; charset=utf-8")
                .header("Accept-encoding", "gzip, deflate")
                .POST(HttpRequest.BodyPublishers.ofString(json, StandardCharsets.UTF_8));

        if (expoAccessToken != null && !expoAccessToken.isBlank()) {
            rb.header(HttpHeaders.AUTHORIZATION, "Bearer " + expoAccessToken.trim());
        }

        HttpClient client = HttpClient.newHttpClient();
        HttpResponse<String> res = client.send(rb.build(), HttpResponse.BodyHandlers.ofString(StandardCharsets.UTF_8));

        if (res.statusCode() / 100 != 2) {
            log.warn("Expo HTTP error status={}, body={}", res.statusCode(), res.body());
            // 전체 실패로 간주
            return tokens.stream().collect(Collectors.toMap(t -> t, t -> false, (a, b) -> a, LinkedHashMap::new));
        }

        // {"data":[{"status":"ok","id":"..."} , {"status":"error","message":"...","details":{"error":"DeviceNotRegistered"}}]}
        Map<String, Object> body = om.readValue(res.body(), new TypeReference<>() {});
        Object data = body.get("data");
        if (!(data instanceof List<?> list)) {
            log.warn("Expo response has no data array: {}", res.body());
            return tokens.stream().collect(Collectors.toMap(t -> t, t -> false, (a, b) -> a, LinkedHashMap::new));
        }

        Map<String, Boolean> tokenResult = new LinkedHashMap<>();
        for (int i = 0; i < list.size(); i++) {
            Object elem = list.get(i);
            String token = tokens.get(i); // 요청 순서 == 응답 순서
            boolean ok = false;

            if (elem instanceof Map<?,?> m) {
                String status = String.valueOf(m.get("status"));
                if ("ok".equalsIgnoreCase(status)) {
                    ok = true;
                } else {
                    // 상세 로그
                    Object message = m.get("message");
                    Object details = m.get("details");
                    String err = (details instanceof Map<?,?> dm) ? String.valueOf(dm.get("error")) : null;
                    log.warn("Expo FAIL token={} status={} err={} msg={}", token, status, err, message);
                }
            }
            tokenResult.put(token, ok);
        }
        return tokenResult;
    }

    private static boolean looksLikeExpoToken(String token) {
        return token != null && token.startsWith("ExponentPushToken[") && token.endsWith("]");
    }
}
