package com.heyoung.domain.outbox.client;

import com.heyoung.domain.outbox.dto.request.SaveUserCategoryRequest;
import com.heyoung.domain.outbox.dto.request.SaveUserHourHistRequest;
import com.heyoung.domain.outbox.dto.response.SaveResponse;
import com.heyoung.domain.outbox.exception.advice.OutboxControllerAdvice;
import com.heyoung.global.config.CommunityProps;
import com.heyoung.global.enums.OutboxType;
import com.heyoung.global.exception.BaseResponse;
import com.heyoung.global.exception.ResponseCode;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Component;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.core.publisher.Mono;

import java.time.Duration;
import java.util.List;
import java.util.Map;

@Component
@RequiredArgsConstructor
public class CommunityWebHookClient {

    @Qualifier("communityWebClient")
    private final WebClient communityWebClient; // base-url 적용
    private final CommunityProps communityProps; // 타입-경로 매핑

    private static final Duration TIMEOUT = Duration.ofSeconds(20);

    private static final ParameterizedTypeReference<BaseResponse<SaveResponse>> BASE_SAVE_RESP =
            new ParameterizedTypeReference<>() {};

    // 카테고리 배치 전송(JSON 배열)
    public BaseResponse<SaveResponse> sendCategoryBatch(List<SaveUserCategoryRequest> items) {
        String path = resolvePath(OutboxType.TRANSACTION_COMPLETED.toString());
        return postJsonArray(path, items);
    }

    // 계좌 연동 배치 전송(JSON 배열)
    public BaseResponse<SaveResponse> sendHourBatch(List<SaveUserHourHistRequest> items) {
        String path = resolvePath(OutboxType.PAYMENT_METHOD_LINKED.toString());
        return postJsonArray(path, items);
    }


    // Json 배열 바디를 POST 로 전송하고 BaseResponse<SaveResponse>로 받는다.
    private <T> BaseResponse<SaveResponse> postJsonArray(String path, List<T> items) {
        return communityWebClient.post()
                .uri(path)
                .contentType(MediaType.APPLICATION_JSON)
                .accept(MediaType.APPLICATION_JSON)
                .bodyValue(items)
                .exchangeToMono(resp -> {
                    return resp.bodyToMono(BASE_SAVE_RESP)
                            .defaultIfEmpty(new BaseResponse<>(true, "HTTP_" + resp.statusCode(), "empty body", null));
                })
                .timeout(TIMEOUT)
                .onErrorResume(e -> Mono.just(new BaseResponse<>(false, "NETWORK", safeMsg(e), null)))
                .block();
    }

    private String resolvePath(String typeKey) {
        Map<String, String> map = communityProps.getWebhook() != null ? communityProps.getWebhook().getEndpoints() : null;

        String path = (map != null) ? map.get(typeKey) : null;

        if(path == null || path.isBlank()) {
            throw new OutboxControllerAdvice(ResponseCode.PATH_NOT_FOUND);
        }

        return path;
    }

    private String safeMsg(Throwable e) {
        String m = e.getMessage();
        return (m == null) ? "오류 메시지가 없습니다." : (m.length()) <= 200 ? m : m.substring(0, 200);
    }
}
