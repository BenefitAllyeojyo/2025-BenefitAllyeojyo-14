package com.heyoung.global.config;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;
import org.springframework.stereotype.Component;
import org.springframework.beans.factory.annotation.Value;
import java.security.Key;
import java.util.Date;

@Component
public class JwtUtil {

    private final Key secretKey;
    private final long qrTokenExpirationMs;

    public JwtUtil(
            @Value("${jwt.secret.key}") String secret,
            @Value("${jwt.qr.expiration.ms}") long expirationMs) {
        this.secretKey = Keys.hmacShaKeyFor(secret.getBytes());
        this.qrTokenExpirationMs = expirationMs;
    }

    // JWT 생성
    public String generateQrToken(Long userId, String accountNumber) {
        Claims claims = Jwts.claims();
        claims.put("userId", userId);
        claims.put("accountNumber", accountNumber);

        Date now = new Date();
        Date expiryDate = new Date(now.getDate() + qrTokenExpirationMs);

        return Jwts.builder()
                .setClaims(claims)
                .setIssuedAt(now)
                .setExpiration(expiryDate)
                .signWith(secretKey, SignatureAlgorithm.HS256)
                .compact();
    }

    //
}
