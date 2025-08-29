package com.heyoung.domain.notification.batch.scheduler;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.batch.core.Job;
import org.springframework.batch.core.JobParametersBuilder;
import org.springframework.batch.core.launch.JobLauncher;
import org.springframework.context.annotation.Configuration;
import org.springframework.scheduling.annotation.EnableScheduling;
import org.springframework.scheduling.annotation.Scheduled;

@Slf4j
@Configuration
@EnableScheduling
@RequiredArgsConstructor
public class NightlyNotificationJobLauncher {

    private final JobLauncher jobLauncher;
    private final Job notificationsReservationJob;

    // 매일 새벽(2:10 KST)에 예약 등록 배치 수행
    // 서버가 UTC 일 경우, KST 기준으로 트리거됨.
    @Scheduled(cron = "0 10 2 * * *", zone = "Asia/Seoul")
    public void runNightly() {
        try {
            jobLauncher.run(
                    notificationsReservationJob,
                    new JobParametersBuilder()
                            .addLong("run.id", System.currentTimeMillis()) // 재실행 구분
                            .toJobParameters()
            );
            log.info("[NightlyNotificationJob] triggered");
        } catch (Exception e) {
            log.error("[NightlyNotificationJob] launch failed : {}", e.getMessage(), e);
        }
    }
}
