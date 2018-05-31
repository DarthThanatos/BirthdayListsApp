package pl.edu.agh.io.rest.guictrl;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class ReservationGUIController {

    @GetMapping(value = "/react")
    public String homeReact(){
        return "index_react";
    }


    @GetMapping(value = "/react_guest")
    public String guestHomeReact(){
        return "index_react_guest";
    }

    @GetMapping(value = "/angular")
    public String homeAngular() {return "index_angular";}

    @GetMapping(value = "/angular_guest")
    public String guestHomeAngular() {return "index_angular_guest";}
}
