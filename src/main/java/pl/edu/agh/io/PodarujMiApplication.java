package pl.edu.agh.io;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.PropertySource;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@PropertySource(value = {"classpath:props/path.properties", "classpath:props/database.properties",
        "classpath:props/application.properties"})
@EnableScheduling
public class PodarujMiApplication  {


    public static void main(String[] args) {
        SpringApplication.run(PodarujMiApplication.class, args);
    }

}
