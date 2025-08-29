package com.heyoung.domain.notification.controller;

import com.heyoung.domain.notification.dto.request.PushTokenDtos;
import com.heyoung.domain.notification.entity.PushToken;
import com.heyoung.domain.notification.service.PushTokenService;
import com.heyoung.global.exception.BaseResponse;
import com.heyoung.global.exception.ResponseCode;
import com.heyoung.global.webconfig.ManagerId;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@Tag(name="알림 토큰을 저장하는 API 입니다.", description = "프론트에서 제휴 토큰을 넘겨주면 저장하는 API 입니다.")
@RestController
@RequestMapping("/token")
@RequiredArgsConstructor
public class PushTokenController {

    private final PushTokenService pushTokenService;

    @PostMapping("/register")
    @Operation(summary="사용자 토큰을 저장하는 API", description = "NotificationChannel 은 PUSH(FCM), EXPO 가 존재")
    public BaseResponse<PushTokenDtos.TokenResponse> register(@ManagerId Long userId, @Valid @RequestBody PushTokenDtos.RegisterRequest request) {
        PushToken pt = pushTokenService.register(userId, request);
        return BaseResponse.onSuccess(new PushTokenDtos.TokenResponse(
                pt.getId(), pt.getChannel(), pt.getActive()
        ), ResponseCode.OK);
    }

    @PostMapping("/deactivate")
    @Operation(summary="사용자 토큰을 비활성화하는 API", description = "NotificationChannel 은 PUSH(FCM), EXPO 가 존재")
    public BaseResponse<PushTokenDtos.TokenResponse> deactivate(@ManagerId Long userId, @Valid @RequestBody PushTokenDtos.DeactivateRequest req) {
        PushToken pt = pushTokenService.deactivate(userId, req.channel(), req.token());
        return BaseResponse.onSuccess(new PushTokenDtos.TokenResponse(
                pt.getId(), pt.getChannel(), pt.getActive()
        ), ResponseCode.OK);
    }

}
