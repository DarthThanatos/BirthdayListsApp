package pl.edu.agh.io.security.token;

import io.jsonwebtoken.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import pl.edu.agh.io.model.user.User;
import pl.edu.agh.io.service.AuthenticationService;

import java.time.Instant;
import java.util.Date;
import java.util.Optional;

@Service
public class TokenManagerService {

    @Value("${token.expiration}")
    private Long expiration;

    @Value("${token.secret}")
    private String secret;

    private static final String CREATED = "iat";

    private final AuthenticationService authenticationService;

    @Autowired
    protected TokenManagerService(AuthenticationService authenticationService) {
        this.authenticationService = authenticationService;
    }

    public boolean validateToken(String token, User account) {
        Optional<User> userId = this.getUserFromToken(token);
        Optional<Instant> tokenCreatedDate = getCreatedDateFromToken(token);
        return userId.isPresent() && tokenCreatedDate.isPresent()
                && userId.get().getUserId().equals(account.getUserId());
    }

    public String generateToken(User account) {
        return Jwts.builder()
                .setIssuer(account.getUserId().toString())
                .setIssuedAt(new Date())
                .setExpiration(this.generateExpirationDate())
                .signWith(SignatureAlgorithm.HS512, secret)
                .compact();
    }

    public Optional<User> getUserFromToken(String authToken) {
        if (authToken != null) {
            try {
                Claims claimsFromToken = this.getClaimsFromToken(authToken);
                return Optional.ofNullable(claimsFromToken.getIssuer())
                        .map(Long::parseLong)
                        .map(authenticationService::getUser);
            } catch (IllegalArgumentException | JwtException e) {
                return Optional.empty();
            }
        }
        return Optional.empty();
    }

    public boolean canTokenBeRefreshed(String token) {
        Optional<Instant> createdDate = this.getCreatedDateFromToken(token);
        return createdDate.isPresent();
    }

    private Date generateExpirationDate() {
        return new Date(Instant.now().toEpochMilli() + expiration * 1000);
    }

    private Claims getClaimsFromToken(String authToken) throws ExpiredJwtException, UnsupportedJwtException,
            MalformedJwtException, SignatureException, IllegalArgumentException {
        return Jwts.parser()
                .setSigningKey(secret)
                .parseClaimsJws(authToken)
                .getBody();
    }

    private Optional<Instant> getCreatedDateFromToken(String token) {
        try {
            final Claims claims = this.getClaimsFromToken(token);
            Integer created = (Integer) claims.get(CREATED);
            return Optional.of(Instant.ofEpochSecond(created));
        } catch (Exception e) {
            return Optional.empty();
        }
    }

}
