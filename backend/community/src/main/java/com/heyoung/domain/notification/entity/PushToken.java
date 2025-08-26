package com.heyoung.domain.notification.entity;

import com.heyoung.global.entity.BaseEntity;
import com.heyoung.global.enums.InvalidType;
import com.heyoung.global.enums.NotificationChannel;
import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

/**
 * 사용자 별 fcmToken 저장하는 저장소.
 */
@Entity @Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@Table(
        name = "push_token",
        uniqueConstraints = {
                // 긴 token 대신 tokenHash 로 유니크 제약
                @UniqueConstraint(name = "uq_push_token_channel_hash", columnNames = {"channel", "tokenHash"})
        },
        indexes = {
                // 활성 토큰 조회 (userId + active 조합)
                @Index(name = "idx_push_token_user_active", columnList = "userId, active"),
                // 오래된/미사용 토큰 찾기
                @Index(name = "idx_push_token_last_seen", columnList = "lastSeenAt"),
                @Index(name = "idx_push_token_last_sent", columnList = "lastSentAt")
        }
)
public class PushToken extends BaseEntity {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private Long userId;

    @Column(nullable = false)
    @Enumerated(value = EnumType.STRING)
    private NotificationChannel channel;

    @Column(nullable = false, length = 1024)
    private String token;

    @Column(nullable = false, length = 64)
    private String tokenHash;

    @Column(nullable = false)
    private Boolean active;

    @Column(nullable = false)
    private int failCount = 0; // default 값 0

    @Column
    @Enumerated(value = EnumType.STRING)
    private InvalidType invalidType;

    @Column
    private LocalDateTime lastSeenAt; // 앱이 마지막으로 토큰을 보고한 시각
    @Column
    private LocalDateTime lastSentAt; // 우리가 마지막으로 발송 시도한 시각

    @Column(length = 32)
    private String appVersion;

    @Column(length = 32)
    private String osVersion;

    @Column(length = 64)
    private String deviceVersion;
}
