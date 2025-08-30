package com.heyoung.domain.notification.service;

import com.heyoung.domain.notification.dto.request.PushTokenDtos;
import com.heyoung.domain.notification.entity.PushToken;
import com.heyoung.domain.notification.repository.PushTokenRepository;
import com.heyoung.global.enums.NotificationChannel;
import com.heyoung.global.util.TokenHash;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class PushTokenServiceImpl implements PushTokenService {
    private final PushTokenRepository pushTokenRepository;

    @Override
    @Transactional
    public PushToken register(Long userId, PushTokenDtos.RegisterRequest request) {
        String hash = TokenHash.sha256Hex(request.token());
        LocalDateTime now = LocalDateTime.now();

        // channel + token_hash 유니크로 조회
        var existing = pushTokenRepository.findByChannelAndTokenHash(request.channel(), hash).orElse(null);
        if (existing != null) {
            existing.refresh(userId, request.token(), request.appVersion(), request.osVersion(), request.deviceVersion(), now);
            return existing;
        }

        // 신규 생성
        PushToken created = PushToken.create(
                userId, request.channel(),
                request.token(), hash,
                request.appVersion(), request.osVersion(), request.deviceVersion(),
                now
        );
        return pushTokenRepository.save(created);
    }

    @Transactional
    public PushToken deactivate(Long userId, NotificationChannel channel, String token) {
        String hash = TokenHash.sha256Hex(token);
        var pt = pushTokenRepository.findByUserIdAndChannelAndTokenHash(userId, channel, hash)
                .orElseThrow(() -> new IllegalArgumentException("token not found"));
        pt.deactivate(LocalDateTime.now());
        return pt;
    }
}
