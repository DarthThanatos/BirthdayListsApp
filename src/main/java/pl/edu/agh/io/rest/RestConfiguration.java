package pl.edu.agh.io.rest;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurerAdapter;

@Configuration
public class RestConfiguration {

    private static final String PATH_PATTERN = "/**";
    private static final String ALLOWED_METHODS_PATTERN = "*";

    @Bean
    public WebMvcConfigurer corsConfigurer() {
        return new WebMvcConfigurerAdapter() {
            @Override
            public void addCorsMappings(CorsRegistry registry) {
                registry.addMapping(PATH_PATTERN)
                        .allowedMethods(ALLOWED_METHODS_PATTERN);
            }
        };
    }

}
