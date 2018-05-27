package pl.edu.agh.io.rest.auth;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import pl.edu.agh.io.model.user.User;
import pl.edu.agh.io.request.LoginRequest;
import pl.edu.agh.io.request.RegisterRequest;
import pl.edu.agh.io.response.TokenResponse;
import pl.edu.agh.io.rest.exceptions.BadCredentials;
import pl.edu.agh.io.rest.exceptions.UserAlreadyExists;
import pl.edu.agh.io.security.token.TokenManagerService;
import pl.edu.agh.io.service.AuthenticationService;
import pl.edu.agh.io.service.EmailService;


@RestController
@RequestMapping("${path.auth}")
public class AuthenticationController {

    private final AuthenticationService authenticationService;
    private final TokenManagerService tokenManagerService;
    private final EmailService emailService;

    @Autowired
    public AuthenticationController(AuthenticationService authenticationService, TokenManagerService tokenManagerService, EmailService emailService) {
        this.authenticationService = authenticationService;
        this.tokenManagerService = tokenManagerService;
        this.emailService = emailService;
    }

    @PostMapping("/register")
    private User registerUser(@RequestBody RegisterRequest registerRequest) {
        try {
            User user = authenticationService.registerUser(registerRequest);
            emailService.sendSimpleMessage(user.getEmail(), "Podaruj mi", "Witaj w Podaruj mi");
            return user;
        } catch (Exception e) {
            throw new UserAlreadyExists(registerRequest.getEmail());
        }
    }

    @PostMapping("/login")
    private TokenResponse loginUser(@RequestBody LoginRequest loginRequest) {
        try {
            User user = authenticationService.loginUser(loginRequest);
            String token = tokenManagerService.generateToken(user);
            return new TokenResponse(token);
        } catch (Exception e) {
            throw new BadCredentials();
        }
    }

}
