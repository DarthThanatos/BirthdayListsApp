package pl.edu.agh.io.rest.exceptions;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(value = HttpStatus.UNAUTHORIZED)
public class BadCredentials extends RuntimeException {
    public BadCredentials() {
        super("Invalid credentials");
    }
}
