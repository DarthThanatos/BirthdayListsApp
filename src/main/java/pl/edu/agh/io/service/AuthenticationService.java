package pl.edu.agh.io.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import pl.edu.agh.io.model.user.User;
import pl.edu.agh.io.model.user.UserRepository;
import pl.edu.agh.io.request.LoginRequest;
import pl.edu.agh.io.request.RegisterRequest;

@Service
public class AuthenticationService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Autowired
    public AuthenticationService(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    public User registerUser(RegisterRequest registerRequest) {
        String password = passwordEncoder.encode(registerRequest.getPassword());
        User user = new User(registerRequest.getEmail(), password);
        return userRepository.save(user);
    }

    public User loginUser(LoginRequest loginRequest) {
        return userRepository.findByEmail(loginRequest.getEmail())
                .filter(u -> passwordEncoder.matches(loginRequest.getPassword(), u.getPassword()))
                .orElseThrow(() -> new BadCredentialsException("Bad credentials"));
    }

    public User getUser(Long id) {
        return userRepository.findOne(id);
    }
}
