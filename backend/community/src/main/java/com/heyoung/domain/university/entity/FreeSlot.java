package com.heyoung.domain.university.entity;

import com.heyoung.global.entity.BaseEntity;
import com.heyoung.global.enums.Semester;
import com.heyoung.global.enums.Weekday;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalTime;

@Entity
@Table(
        name = "timetable_free_slot",
        uniqueConstraints = @UniqueConstraint(name="uq_free_slot", columnNames = {"user_id","day_of_week","start_time","end_time"}),
        indexes = @Index(name="idx_free_slot_user_day", columnList = "user_id, day_of_week, start_time")
)
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class FreeSlot extends BaseEntity {

    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name="user_id", nullable=false)
    private Long userId;

    @Enumerated(EnumType.STRING)
    @Column(name="day_of_week", length=16, nullable=false)
    private Weekday dayOfWeek;

    @Column(name="start_time", nullable=false)
    private LocalTime startTime;

    @Column(name="end_time", nullable=false)
    private LocalTime endTime;

    @Column(name="minutes", nullable=false)
    private int minutes;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Semester semester;

}
