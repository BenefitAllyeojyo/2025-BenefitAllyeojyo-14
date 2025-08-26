package com.heyoung.domain.university.entity;

import com.heyoung.global.entity.BaseEntity;
import com.heyoung.global.enums.Weekday;
import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalTime;

@Entity @Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class Timetable extends BaseEntity {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Long userId;

    @Column(length = 10, nullable = false)
    private String semester;

    @Column(nullable = false)
    private Integer years;

    @Column(length = 20, nullable = false)
    private String courseCode;

    @Column(length = 100, nullable = false)
    private String courseName;

    private Integer credit;

    @Enumerated(EnumType.STRING)
    @Column(length = 10, nullable = false)
    private Weekday dayOfWeek;

    @Column(nullable = false)
    private LocalTime startTime;

    @Column(nullable = false)
    private LocalTime endTime;

    @Column(nullable = false)
    private String classroom;

    @Column(length = 50, nullable = false)
    private String professorName;

    @Column(nullable = false)
    private Boolean current;
}
