package app.app_server.auth.service;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;

import javax.crypto.SecretKey;
import java.util.Base64;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;
import java.util.function.Function;

/**
 * JWTService — Handles all JWT token operations: generation, parsing, and validation.
 *
 * KEY CHANGE from previous version:
 *   OLD: generateToken(Users user) — accepted the entire Users entity
 *        and put userPassword into the JWT claims (SECURITY VULNERABILITY!)
 *   NEW: generateToken(String username) — accepts only the username string
 *        No password is ever embedded in the token.
 *
 * WHY IS PUTTING PASSWORD IN JWT DANGEROUS?
 *   A JWT is base64-encoded, not encrypted. Anyone who intercepts the token
 *   can decode the payload and read the claims — including the password hash.
 *   A BCrypt hash, if cracked offline, exposes the original password.
 */
@Service
public class JWTService {

    @Value("${jwt.secret}")
    private String secretKey;

    @Value("${jwt.access.expiration}")
    private Long accessTokenDurationMs;

    public JWTService() {
        // No longer generating a random key here
    }

    /**
     * Public entry point: generates a JWT for the given username.
     *
     * CHANGE: Previously took (Users user). Now takes (String username) only.
     * This is the DTO pattern applied to the JWT layer — we pass only what's needed.
     *
     * @param username  the authenticated user's username (from DB)
     * @return          signed JWT string
     */
    public String generateToken(String username) {
        // Start with no extra claims — add more below if needed
        Map<String, Object> extraClaims = new HashMap<>();

        // You can safely add non-sensitive claims here, e.g., roles
        // extraClaims.put("role", ...) if needed in the future

        return buildToken(extraClaims, username);
    }

    /**
     * Internal method that builds the actual Access Token (JWT) string.
     * Expiration: 20 minutes.
     */
    private String buildToken(Map<String, Object> extraClaims, String username) {
        return Jwts.builder()
                .setClaims(extraClaims)
                .setSubject(username)           
                .setIssuedAt(new Date(System.currentTimeMillis()))
                .setExpiration(new Date(System.currentTimeMillis() + accessTokenDurationMs))
                .signWith(getKey(), SignatureAlgorithm.HS256)
                .compact();
    }

    /**
     * Returns the HMAC secret key object decoded from the base64 secret string.
     * Used for both signing tokens and verifying them.
     */
    public SecretKey getKey() {
        byte[] keyBytes = Decoders.BASE64.decode(secretKey);
        return Keys.hmacShaKeyFor(keyBytes);
    }

    // ──────────────────────────────────────────────────────────────────
    // Token parsing methods (unchanged logic, same as before)
    // ──────────────────────────────────────────────────────────────────

    /**
     * Step 3: Extract just the username (subject) from a token.
     * Called by JwtFilter to identify which user the request belongs to.
     */
    public String extractUserName(String token) {
        return extractClaim(token, Claims::getSubject);
    }

    /**
     * Step 2: Generic claim extractor — applies any function to the Claims object.
     * e.g., Claims::getSubject, Claims::getExpiration
     */
    private <T> T extractClaim(String token, Function<Claims, T> claimResolver) {
        final Claims claims = extractAllClaims(token);
        return claimResolver.apply(claims);
    }

    /**
     * Step 1: Parse and verify the token signature, then return all claims.
     * If the signature is invalid or the token is tampered, an exception is thrown.
     */
    public Claims extractAllClaims(String token) {
        return Jwts.parserBuilder()
                .setSigningKey(getKey())   // Verifies signature using secret key
                .build()
                .parseClaimsJws(token)    // Parses + validates the token
                .getBody();               // Returns the payload (claims)
    }

    /**
     * Validates the token: checks that the username matches and token is not expired.
     * Called from JwtFilter on every incoming request.
     */
    public boolean isValidateToken(String token, UserDetails userDetails) {
        final String userName = extractUserName(token);
        return (userName.equals(userDetails.getUsername()) && !isTokenExpired(token));
    }

    public boolean isTokenExpired(String token) {
        return extractExpiration(token).before(new Date());
    }

    public Date extractExpiration(String token) {
        return extractClaim(token, Claims::getExpiration);
    }
}
