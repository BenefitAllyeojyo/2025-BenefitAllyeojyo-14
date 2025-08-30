package com.heyoung.global.enums;

public enum InvalidType {

    NONE,                   // 정상
    // ── 영구 불가(Do-Not-Retry) ──
    UNREGISTERED,           // 기기에서 앱 삭제/토큰 만료(FCM: NotRegistered/UNREGISTERED)
    INVALID_TOKEN,          // 토큰 포맷/프로젝트 불일치(SENDER_ID_MISMATCH/INVALID_ARGUMENT)
    USER_DISABLED,          // 사용자가 알림 off/로그아웃
    // ── 일시 오류(Retryable) ──
    TEMP_UNAVAILABLE,       // 일시적 서버/네트워크(UNAVAILABLE/INTERNAL)
    RATE_LIMITED            // 쿼터/레이트 제한(QUOTA_EXCEEDED)

}
