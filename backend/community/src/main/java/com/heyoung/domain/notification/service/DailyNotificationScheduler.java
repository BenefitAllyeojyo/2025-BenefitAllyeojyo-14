package com.heyoung.domain.notification.service;

import java.time.ZoneId;

public interface DailyNotificationScheduler {
    void scheduleTodayTop3(Long userId, ZoneId userZone);
}
