package com.heyoung.global.enums;

import lombok.AllArgsConstructor;

@AllArgsConstructor
public enum Semester {

    FIRST_1(1, 1), FIRST_2(1, 2), SECOND_1(2, 1), SECOND_2(2, 2),
    THIRD_1(3, 1), THIRD_2(3, 2), FOURTH_1(4, 1), FOURTH_2(4, 2);

    private final int year;
    private final int semester;
}
