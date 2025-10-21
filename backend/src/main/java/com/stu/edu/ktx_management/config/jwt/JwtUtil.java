package com.stu.edu.ktx_management.config.jwt;

import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.JwtException;
import io.jsonwebtoken.security.Keys;

import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;
import java.util.Date;

@Component
public class JwtUtil {

    // THAY bằng giá trị mạnh hơn và lưu trong application.properties hoặc env var khi deploy
    private final String SECRET = "my-super-secret-key-for-jwt-1234567890";
    private final SecretKey key = Keys.hmacShaKeyFor(SECRET.getBytes(StandardCharsets.UTF_8));
    private final long EXPIRATION_MS = 24 * 60 * 60 * 1000; // 1 day

    public String generateToken(String username) {
        Date now = new Date();
        Date exp = new Date(now.getTime() + EXPIRATION_MS);

        return Jwts.builder()
                .setSubject(username)
                .claim("username", username)
                .setIssuedAt(now)
                .setExpiration(exp)
                .signWith(key)
                .compact();
    }

    public String extractUsername(String token) {
        return Jwts.parserBuilder().setSigningKey(key).build()
                .parseClaimsJws(token).getBody().getSubject();
    }

    public boolean isTokenValid(String token, String username) {
        try {
            final String tokenUsername = extractUsername(token);
            return (tokenUsername.equals(username) && !isTokenExpired(token));
        } catch (JwtException | IllegalArgumentException e) {
            return false;
        }
    }

    private boolean isTokenExpired(String token) {
        Date expiration = Jwts.parserBuilder().setSigningKey(key).build()
                .parseClaimsJws(token).getBody().getExpiration();
        return expiration.before(new Date());
    }
}

