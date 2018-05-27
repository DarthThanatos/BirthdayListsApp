package pl.edu.agh.io.security.configuration;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.annotation.Order;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.method.configuration.EnableGlobalMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import pl.edu.agh.io.security.filter.TokenFilter;
import pl.edu.agh.io.security.token.TokenManagerService;

@Order(1)
@Configuration
@EnableGlobalMethodSecurity(prePostEnabled = true)
public class ApiSecurityConfiguration extends WebSecurityConfigurerAdapter {

    private static final String API_PATH = "/api/**";

    private final TokenManagerService tokenManagerService;

    @Value("${token.header}")
    protected String tokenHeader;

    @Autowired
    public ApiSecurityConfiguration(TokenManagerService tokenManagerService) {
        this.tokenManagerService = tokenManagerService;
    }

    @Override
    protected void configure(HttpSecurity http) throws Exception {
        http.formLogin().disable();
        http.csrf().disable()
                .antMatcher(API_PATH)
                .authorizeRequests()
                .antMatchers(HttpMethod.OPTIONS, "/**").permitAll()
                .antMatchers("/api/list/key/**").permitAll()
                .antMatchers(HttpMethod.POST, "/api/list/{key}/present/suggestions").permitAll()
                .antMatchers("/api/reservation/**").permitAll()
                .anyRequest().authenticated()
                .and()
                .antMatcher("/**")
                .authorizeRequests().anyRequest().permitAll().and()
                .sessionManagement().sessionCreationPolicy(SessionCreationPolicy.STATELESS);
        http.addFilterBefore(new TokenFilter(tokenManagerService, tokenHeader), UsernamePasswordAuthenticationFilter.class);
    }

}
