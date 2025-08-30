package com.heyoung.domain.notification.batch.scheduler;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.batch.core.Job;
import org.springframework.batch.core.JobParameters;
import org.springframework.batch.core.JobParametersBuilder;
import org.springframework.batch.core.explore.JobExplorer;
import org.springframework.batch.core.launch.JobLauncher;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.context.annotation.Configuration;
import org.springframework.scheduling.annotation.EnableScheduling;
import org.springframework.scheduling.annotation.Scheduled;

@Slf4j
@Configuration
@EnableScheduling
@RequiredArgsConstructor
public class NightlyNotificationJobLauncher {

    private final JobLauncher jobLauncher;
    private final JobExplorer jobExplorer;

    @Qualifier("notificationsReservationJob") private final Job notificationsReservationJob; // 새벽 2시 10분
    @Qualifier("timetableGapReservationsJob") private final Job timetableGapReservationsJob; // 새벽 5시

    @Scheduled(cron = "0 10 2 * * *", zone = "Asia/Seoul")
    public void runReservationsCreateJob() { runOnce("notificationsReservationJob", notificationsReservationJob); }

    @Scheduled(cron = "0 0 5 * * *", zone = "Asia/Seoul")
    public void runTimetableGapReservationsJob() { runOnce("timetableGapReservationsJob", timetableGapReservationsJob); }

    private void runOnce(String name, Job job) {
        try {
            var running = jobExplorer.findRunningJobExecutions(name);
            if (running != null && !running.isEmpty()) {
                log.warn("[{}] already running. skip.", name);
                return;
            }
            JobParameters params = new JobParametersBuilder()
                    .addLong("run.id", System.currentTimeMillis())
                    .toJobParameters();
            log.info("[{}] launching...", name);
            jobLauncher.run(job, params);
            log.info("[{}] launched.", name);
        } catch (Exception e) {
            log.error("[{}] launch failed: {}", name, e.getMessage(), e);
        }
    }
}
