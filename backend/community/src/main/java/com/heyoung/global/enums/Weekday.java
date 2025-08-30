package com.heyoung.global.enums;

import java.time.DayOfWeek;
import java.time.LocalDate;
import java.util.Optional;

public enum Weekday {
    MONDAY, TUESDAY, WEDNESDAY, THURSDAY, FRIDAY, SATURDAY, SUNDAY;


    /** DayOfWeek -> Optional<Weekday> (일요일이면 empty) */
    public static Optional<Weekday> from(DayOfWeek dow) {
        return switch (dow) {
            case MONDAY    -> Optional.of(MONDAY);
            case TUESDAY   -> Optional.of(TUESDAY);
            case WEDNESDAY -> Optional.of(WEDNESDAY);
            case THURSDAY  -> Optional.of(THURSDAY);
            case FRIDAY    -> Optional.of(FRIDAY);
            case SATURDAY  -> Optional.of(SATURDAY);
            case SUNDAY    -> Optional.of(SUNDAY);
        };
    }
}
