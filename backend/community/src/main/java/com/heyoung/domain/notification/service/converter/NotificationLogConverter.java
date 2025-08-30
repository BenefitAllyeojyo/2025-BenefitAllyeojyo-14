package com.heyoung.domain.notification.service.converter;

import com.heyoung.domain.benefit.repository.PartnershipBranchRepository;
import com.heyoung.domain.notification.dto.response.GetNotificationByRemindResponseDto;
import com.heyoung.domain.notification.entity.Notification;
import com.heyoung.domain.notification.entity.NotificationLog;

public class NotificationLogConverter {

    public static GetNotificationByRemindResponseDto toNotificationByRemindResponse(PartnershipBranchRepository.NearbyBranchRow row, NotificationLog notificationLog) {
        return new GetNotificationByRemindResponseDto(
                row.getBranchId(), row.getPartnershipName(), notificationLog.getNotification().getContent(), row.getLat(), row.getLng()
        );
    }

}
