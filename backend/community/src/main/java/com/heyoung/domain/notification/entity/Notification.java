package com.heyoung.domain.notification.entity;

import com.heyoung.global.entity.BaseEntity;
import com.heyoung.global.enums.NotificationChannel;
import com.heyoung.global.enums.NotificationType;
import com.heyoung.global.enums.SendStatus;
import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;

/**
 * 알림 예약 저장소. 이 DB 의 send_at 을 조회하여 알림을 발송시키는 것.
 */
@Entity @Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class Notification extends BaseEntity {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Long userId;

    @Column(length = 200, nullable = false)
    private String title;

    @Column(columnDefinition = "text", nullable = false)
    private String content;

    @Enumerated(EnumType.STRING)
    @Column(length = 32, nullable = false)
    private NotificationType type;

    @Enumerated(EnumType.STRING)
    @Column(length = 8, nullable = false)
    private NotificationChannel channel;

    @Column(length = 500, nullable = false)
    private String clickUrl;

    @Column(length = 500, nullable = false)
    private String imagePath;

    @Enumerated(EnumType.STRING)
    @Column(length = 8, nullable = false)
    private SendStatus sendStatus;
}
