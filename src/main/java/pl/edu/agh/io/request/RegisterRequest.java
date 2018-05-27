package pl.edu.agh.io.request;

import com.fasterxml.jackson.annotation.JsonProperty;

public class RegisterRequest {

    private String email;
    private String password;

    public RegisterRequest(@JsonProperty("email") String email,
                           @JsonProperty("password") String password) {
        this.email = email;
        this.password = password;
    }

    public String getEmail() {
        return email;
    }

    public String getPassword() {
        return password;
    }
}
