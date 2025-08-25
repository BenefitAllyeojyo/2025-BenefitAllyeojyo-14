package com.heyoung.global.utils;

import org.springframework.stereotype.Component;

import java.util.UUID;

@Component
public class UuidUtilImpl implements UuidUtil {
    @Override
    public String createUuid() {
        return UUID.randomUUID().toString();
    }
}
