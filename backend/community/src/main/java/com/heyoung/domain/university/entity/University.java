package com.heyoung.domain.university.entity;

import com.heyoung.global.entity.BaseEntity;
import com.heyoung.global.enums.UniversityAccess;
import com.heyoung.global.enums.UniversityType;
import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;
import org.locationtech.jts.geom.Point;

@Entity @Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class University extends BaseEntity {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(length = 200, nullable = false)
    private String name;

    @Enumerated(EnumType.STRING)
    @Column(length = 50, nullable = false)
    private UniversityType type;

    @Column(length = 100, nullable = false)
    private String campusName;

    @Column(length = 300, nullable = false)
    private String address;

    @Column(columnDefinition = "geometry(Point, 4326)")
    @JdbcTypeCode(SqlTypes.GEOMETRY)
    private Point location;

    @Column(length = 20, nullable = false)
    private String postalCode;

    @Column(length = 20, nullable = false)
    private String mainPhone;

    @Column(length = 200, nullable = false)
    private String website;

    @Column(length = 100, nullable = false)
    private String domain;

    @Enumerated(EnumType.STRING)
    @Column(length = 16, nullable = false)
    private UniversityAccess access;

}