package com.heyoung.global.enums;

import com.heyoung.domain.recommendation.exception.UserCategoryControllerAdvice;
import com.heyoung.global.exception.ResponseCode;

public enum HourBucket {

    HOUR_00(0), HOUR_01(1), HOUR_02(2), HOUR_03(3), HOUR_04(4), HOUR_05(5),
    HOUR_06(6), HOUR_07(7), HOUR_08(8), HOUR_09(9), HOUR_10(10), HOUR_11(11),
    HOUR_12(12), HOUR_13(13), HOUR_14(14), HOUR_15(15), HOUR_16(16), HOUR_17(17),
    HOUR_18(18), HOUR_19(19), HOUR_20(20), HOUR_21(21), HOUR_22(22), HOUR_23(23);

    private final int hour;
    HourBucket(int hour) { this.hour = hour; }
    public int value() { return hour; }

    private static final HourBucket[] VALUES = values();

    public static HourBucket of(int hour) {
        if (hour < 0 || hour > 23) throw new UserCategoryControllerAdvice(ResponseCode.HOUR_OUT_OF_RANGE);
        return VALUES[hour];
    }

    public static HourBucket of(java.time.Instant instant, java.time.ZoneId zone) {
        int h = instant.atZone(zone).getHour();
        return VALUES[h];
    }

    /** 다음/이전 시간 버킷 */
    public HourBucket next() { return VALUES[(hour + 1) % 24]; }
    public HourBucket prev() { return VALUES[(hour + 23) % 24]; }

}
