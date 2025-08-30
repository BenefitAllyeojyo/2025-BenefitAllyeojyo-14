package com.heyoung.domain.notification.batch.config;

import com.heyoung.domain.notification.repository.PushTokenRepository;
import com.heyoung.domain.notification.service.DailyNotificationScheduler;
import com.heyoung.domain.notification.service.TimetableGapNotificationScheduler;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.batch.core.Job;
import org.springframework.batch.core.Step;
import org.springframework.batch.core.job.builder.JobBuilder;
import org.springframework.batch.core.repository.JobRepository;
import org.springframework.batch.core.step.builder.StepBuilder;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.jdbc.datasource.DataSourceTransactionManager;
import org.springframework.transaction.PlatformTransactionManager;
import org.springframework.transaction.TransactionManager;

import java.time.ZoneId;
import java.util.List;

@Slf4j
@Configuration
@RequiredArgsConstructor
public class NotificationBatchConfig {

    private final PushTokenRepository pushTokenRepository;
    private final DailyNotificationScheduler dailyNotificationScheduler;
    private final TimetableGapNotificationScheduler timetableGapNotificationScheduler;

    // KST 기준으로 사용자 시간대를 지정할 기본 값
    private static final ZoneId DEFAULT_ZONE = ZoneId.of("Asia/Seoul");

    // === 예약 생성 Job ===
    @Bean(name = "notificationsReservationJob")
    public Job notificationsReservationJob(
            JobRepository jobRepository,
            @Qualifier("notificationReservationStep") Step notificationReservationStep
    ) {
        return new JobBuilder("notificationsReservationJob", jobRepository)
                .start(notificationReservationStep)
                .build();
    }

    // === 시간표 공강 기반 예약 Job ===
    @Bean(name = "timetableGapReservationsJob")
    public Job timetableGapReservationsJob(
            JobRepository jobRepository,
            @Qualifier("timetableGapReservationStep") Step timetableGapReservationStep
    ) {
        return new JobBuilder("timetableGapReservationsJob", jobRepository)
                .start(timetableGapReservationStep)
                .build();
    }

    @Bean("notificationReservationStep")
    public Step notificationReservationStep(JobRepository jobRepository,
                                            PlatformTransactionManager transactionManager) {
        return new StepBuilder("notificationsReservationStep", jobRepository)
                .tasklet((contribution, chunkContext) -> {
                    // 활성 사용자 집합 조회
                    List<Long> candidates = pushTokenRepository.findDistinctByActiveUserIds();

                    int total = 0, success = 0, skipped = 0, failed = 0;

                    for(Long userId : candidates) {
                        total++;

                        try {
                            // 사용자별 하루 3건 예약 로직 실행
                            dailyNotificationScheduler.scheduleTodayTop3(userId, DEFAULT_ZONE);
                            success++;
                        } catch (Exception e) {
                            failed++;
                            log.warn("[notificationsReservations] userId = {} 예약 실패 : {}", userId, e.getMessage(), e);
                        }
                    }

                    log.info("[notificationsReservation] done. total={}, success={}, skipped={}, failed={}",
                            total, success, skipped, failed);

                    return org.springframework.batch.repeat.RepeatStatus.FINISHED;
                }, transactionManager).build();

    }

    // 공강 기반 예약 생성
    @Bean("timetableGapReservationStep")
    public Step timetableGapReservationStep(JobRepository jobRepository, PlatformTransactionManager transactionManager) {
        return new StepBuilder("timetableGapReservationStep", jobRepository)
                .tasklet((contribution, chunkContext) -> {
                    // 활성 사용자 집합 조회
                    List<Long> candidates = pushTokenRepository.findDistinctByActiveUserIds();

                    int total = 0, success = 0, skipped = 0, failed = 0;

                    for(Long userId : candidates) {
                        total++;

                        try {
                            // 사용자별 하루 3건 예약 로직 실행
                            timetableGapNotificationScheduler.scheduleForToday(userId, DEFAULT_ZONE);
                            success++;
                        } catch (Exception e) {
                            failed++;
                            log.warn("[notificationsReservations] userId = {} 예약 실패 : {}", userId, e.getMessage(), e);
                        }
                    }

                    log.info("[notificationsReservation] done. total={}, success={}, skipped={}, failed={}",
                            total, success, skipped, failed);

                    return org.springframework.batch.repeat.RepeatStatus.FINISHED;
                }, transactionManager).build();
    }

}
