package com.heyoung.domain.notification.repository;

import com.heyoung.domain.notification.entity.PushToken;
import com.heyoung.global.enums.InvalidType;
import com.heyoung.global.enums.NotificationChannel;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

public interface PushTokenRepository extends JpaRepository<PushToken, Long> {

    @Query("select distinct pt.userId from PushToken pt where pt.active = true")
    List<Long> findDistinctByActiveUserIds();

    // PushToken 에서 활성 사용자 뽑기(배치 대상)
    List<PushToken> findByUserIdAndChannelAndActiveTrue(Long userId, NotificationChannel channel);

    @Modifying
    @Query("update PushToken t set t.lastSentAt = :ts, t.failCount = 0 where t.id in :ids")
    int touchSuccess(List<Long> ids, LocalDateTime ts);

    @Modifying
    @Query("update PushToken t set t.failCount = t.failCount + 1 where t.id = :id")
    int increaseFailCount(Long id);

    Optional<PushToken> findByChannelAndTokenHash(NotificationChannel channel, String tokenHash);

    Optional<PushToken> findByUserIdAndChannelAndTokenHash(Long userId, NotificationChannel channel, String tokenHash);

    List<PushToken> findAllByUserIdAndChannelAndActive(Long userId, NotificationChannel channel, Boolean active);


    @Modifying
    @Query("update PushToken t set t.active = false where t.id = :id")
    int deactivate(Long id);

    /** 특정 유저의 활성화된 채널별 토큰만 조회 */
    @Query("""
        select t.token
        from PushToken t
        where t.userId = :userId
          and t.channel = :channel
          and t.active = true
    """)
    List<String> findActiveTokensByUserIdAndChannel(@Param("userId") Long userId,
                                                    @Param("channel") NotificationChannel channel);

    /** 잘못된(등록 해제 등) 토큰을 비활성화 처리 */
    @Modifying(clearAutomatically = true, flushAutomatically = true)
    @Query("""
        update PushToken t
           set t.active = false,
               t.invalidType = :invalid
         where t.token = :token
           and t.channel = :channel
    """)
    int markInactiveByToken(@Param("token") String token,
                            @Param("channel") NotificationChannel channel,
                            @Param("invalid") InvalidType invalidType);
}
