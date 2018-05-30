package pl.edu.agh.io.rest.reservation;

import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;
import pl.edu.agh.io.model.reservation.PresentReservation;
import pl.edu.agh.io.request.BoughtStatusChangeRequest;
import pl.edu.agh.io.request.ReservationRequest;
import pl.edu.agh.io.service.ReservationService;
import pl.edu.agh.io.service.WishListService;

import java.util.List;

@RestController
@RequestMapping("${path.reservation}")
public class ReservationController {

    private final ReservationService reservationService;
    private final WishListService wishListService;

    public ReservationController(ReservationService reservationService, WishListService wishListService) {
        this.reservationService = reservationService;
        this.wishListService = wishListService;
    }

    @GetMapping("/list/{key}")
    public List<PresentReservation> getAll(@PathVariable String key) {
        Long listId = wishListService.getByKey(key).getWishListId();
        return reservationService.findAllByListId(listId);
    }

    @PostMapping
    public PresentReservation createReservation(@RequestBody ReservationRequest reservationRequest) {
        return reservationService.createReservation(reservationRequest);
    }

    @PostMapping("/update")
    public PresentReservation updateReservation(@RequestBody  PresentReservation presentReservation) {
        return reservationService.save(presentReservation);
    }

    @GetMapping("/{key}")
    public PresentReservation getByKey(@PathVariable String key) {
        return reservationService.findByKey(key);
    }


    @DeleteMapping("/{key}")
    @Transactional
    public void deleteByKey(@PathVariable String key) {
        reservationService.deleteByKey(key);
    }

    @GetMapping("/resign/{key}")
    public void resign(@PathVariable("key") String key){
        reservationService.deleteByKey(key);
    }

}
