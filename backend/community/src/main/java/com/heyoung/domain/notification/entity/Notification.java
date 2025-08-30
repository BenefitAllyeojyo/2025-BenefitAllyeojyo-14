package com.heyoung.domain.notification.entity;

import com.heyoung.domain.benefit.entity.Partnership;
import com.heyoung.global.entity.BaseEntity;
import com.heyoung.global.enums.NotificationChannel;
import com.heyoung.global.enums.NotificationType;
import com.heyoung.global.enums.SendStatus;
import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.Instant;

/**
 * 알림 예약 저장소. 이 DB 의 send_at 을 조회하여 알림을 발송시키는 것.
 */
@Entity @Getter @Setter
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
    @Column(length = 32, nullable = false)
    private NotificationChannel channel;

    @Column(length = 500, nullable = false)
    private String clickUrl;

    @Column(length = 500, nullable = false)
    private String imagePath;

    @Enumerated(EnumType.STRING)
    @Column(length = 32, nullable = false)
    private SendStatus sendStatus;

    @Column(nullable = false)
    private Instant scheduledAt; // 발송 예약 시각

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "partnership_id")
    private Partnership partnership;

    public static Notification createReservation(
            Long userId, Partnership p,
            String title, String content,
            NotificationType type, NotificationChannel channel,
            String clickUrl, String imagePath,
            Instant scheduledAt
    ) {
        Notification n = new Notification();
        n.userId = userId;
        n.partnership = p;
        n.title = title;
        n.content = content;
        n.type = type;
        n.channel = channel;
        n.clickUrl = clickUrl;
        n.imagePath = imagePath;
        n.scheduledAt = scheduledAt;
        n.sendStatus = SendStatus.SCHEDULED;
        return n;
    }

    public void markSent()   { this.sendStatus = SendStatus.SENT; }
    public void markFailed() { this.sendStatus = SendStatus.FAILED; }
}
