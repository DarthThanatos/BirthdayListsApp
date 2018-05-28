package pl.edu.agh.io.rest.guictrl;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class ReactController {

    @GetMapping("/react")
    public String homeReact(){
        return "index_react";
    }


    @GetMapping("/react_guest")
    public String guestHomeReact(){
        return "index_react_guest";
    }
}
