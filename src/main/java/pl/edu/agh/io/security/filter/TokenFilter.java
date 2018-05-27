package pl.edu.agh.io.security.filter;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.filter.GenericFilterBean;
import pl.edu.agh.io.model.user.User;
import pl.edu.agh.io.security.authentication.UserAuthentication;
import pl.edu.agh.io.security.token.TokenManagerService;

import javax.servlet.FilterChain;
import javax.servlet.ServletException;
import javax.servlet.ServletRequest;
import javax.servlet.ServletResponse;
import javax.servlet.http.HttpServletRequest;
import java.io.IOException;
import java.util.Optional;

public class TokenFilter extends GenericFilterBean {

    private final TokenManagerService tokenManagerService;
    private final String tokenHeader;

    @Autowired
    public TokenFilter(TokenManagerService tokenManagerService, String tokenHeader) {
        super();
        this.tokenManagerService = tokenManagerService;
        this.tokenHeader = tokenHeader;
    }

    @Override
    public void doFilter(ServletRequest request, ServletResponse response, FilterChain chain) throws IOException, ServletException {

        HttpServletRequest httpRequest = (HttpServletRequest) request;
        String authToken = httpRequest.getHeader(this.tokenHeader);
        Optional<User> user = this.tokenManagerService.getUserFromToken(authToken);

        if (user.isPresent()) {
            if (this.tokenManagerService.validateToken(authToken, user.get())) {
                UserAuthentication authentication = new UserAuthentication(user.get());
                SecurityContextHolder.getContext().setAuthentication(authentication);
            }
        }

        chain.doFilter(request, response);
    }

}
