package com.heyoung.domain.recommendation.consumer;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.heyoung.domain.recommendation.dto.request.SaveUserCategoryRequest;
import com.heyoung.domain.recommendation.dto.request.SaveUserHourHistRequest;
import com.heyoung.domain.recommendation.dto.response.FailedResponseDto;
import com.heyoung.domain.recommendation.dto.response.SaveResponse;
import com.heyoung.domain.recommendation.service.RecommendationCommandService;
import com.heyoung.global.exception.BaseResponse;
import com.heyoung.global.exception.ResponseCode;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.mockito.ArgumentCaptor;

import java.time.Instant;
import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.verifyNoInteractions;
import static org.mockito.Mockito.when;

class RecommendationKafkaListenerTest {

    private RecommendationCommandService commandService;
    private RecommendationKafkaListener listener;

    @BeforeEach
    void setUp() {
        commandService = mock(RecommendationCommandService.class);
        // 실제 서비스가 Spring 에서 주입받는 것과 동일하게 JavaTimeModule(Instant) 등록된 ObjectMapper
        ObjectMapper objectMapper = new ObjectMapper().findAndRegisterModules();
        listener = new RecommendationKafkaListener(commandService, objectMapper);
    }

    @Test
    @DisplayName("카테고리 토픽 메시지를 SaveUserCategoryRequest 로 역직렬화해 receiveUserCategory 에 위임한다")
    void consumeUserCategory_delegatesWithDeserializedDto() {
        String json = """
                {"outboxId":10,"userId":42,"categoryId":7,"transactionDateTime":"2026-07-28T05:30:00Z"}
                """;
        when(commandService.receiveUserCategory(any()))
                .thenReturn(BaseResponse.onSuccess(new SaveResponse(null), ResponseCode.OK));

        listener.consumeUserCategory(json);

        @SuppressWarnings("unchecked")
        ArgumentCaptor<List<SaveUserCategoryRequest>> captor = ArgumentCaptor.forClass(List.class);
        verify(commandService).receiveUserCategory(captor.capture());

        List<SaveUserCategoryRequest> captured = captor.getValue();
        assertThat(captured).hasSize(1);
        SaveUserCategoryRequest dto = captured.get(0);
        assertThat(dto.outboxId()).isEqualTo(10L);
        assertThat(dto.userId()).isEqualTo(42L);
        assertThat(dto.categoryId()).isEqualTo(7L);
        assertThat(dto.transactionDateTime()).isEqualTo(Instant.parse("2026-07-28T05:30:00Z"));
    }

    @Test
    @DisplayName("시간대 토픽 메시지를 SaveUserHourHistRequest 로 역직렬화해 receiveUserHourHist 에 위임한다")
    void consumeUserHourHist_delegatesWithDeserializedDto() {
        String json = """
                {"outboxId":11,"userId":99,"transactionTime":"2026-07-28T21:15:00Z"}
                """;
        when(commandService.receiveUserHourHist(any()))
                .thenReturn(BaseResponse.onSuccess(new SaveResponse(null), ResponseCode.OK));

        listener.consumeUserHourHist(json);

        @SuppressWarnings("unchecked")
        ArgumentCaptor<List<SaveUserHourHistRequest>> captor = ArgumentCaptor.forClass(List.class);
        verify(commandService).receiveUserHourHist(captor.capture());

        List<SaveUserHourHistRequest> captured = captor.getValue();
        assertThat(captured).hasSize(1);
        SaveUserHourHistRequest dto = captured.get(0);
        assertThat(dto.outboxId()).isEqualTo(11L);
        assertThat(dto.userId()).isEqualTo(99L);
        assertThat(dto.transactionTime()).isEqualTo(Instant.parse("2026-07-28T21:15:00Z"));
    }

    @Test
    @DisplayName("역직렬화 불가능한 메시지는 예외를 전파하고 서비스를 호출하지 않는다(재소비 유도)")
    void consumeUserCategory_malformedMessage_throwsAndDoesNotDelegate() {
        String malformed = "{ not-a-valid-json ";

        assertThatThrownBy(() -> listener.consumeUserCategory(malformed))
                .isInstanceOf(IllegalStateException.class);

        verifyNoInteractions(commandService);
    }

    @Test
    @DisplayName("서비스가 실패 응답(BaseResponse.onFailure)을 반환하면 예외를 전파해 오프셋 커밋을 막는다")
    void consumeUserCategory_serviceReportsFailure_throws() {
        String json = """
                {"outboxId":10,"userId":42,"categoryId":7,"transactionDateTime":"2026-07-28T05:30:00Z"}
                """;
        // 실제 서비스가 실패 아이템 발생 시 반환하는 형태: onFailure + failed 목록
        BaseResponse<SaveResponse> failure = BaseResponse.onFailure(
                new SaveResponse(List.of(new FailedResponseDto(10L, "boom"))), ResponseCode.OK);
        when(commandService.receiveUserCategory(any())).thenReturn(failure);

        assertThatThrownBy(() -> listener.consumeUserCategory(json))
                .isInstanceOf(IllegalStateException.class);

        // 서비스에는 위임되었으나(멱등 처리), 실패가 전파되어 오프셋 커밋을 막는다.
        verify(commandService).receiveUserCategory(any());
    }
}
