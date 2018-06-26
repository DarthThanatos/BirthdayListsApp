package pl.edu.agh.io.rest.present;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.web.bind.annotation.*;
import pl.edu.agh.io.model.present.Present;
import pl.edu.agh.io.model.reservation.PresentReservation;
import pl.edu.agh.io.model.suggestion.Suggestion;
import pl.edu.agh.io.service.EmailService;
import pl.edu.agh.io.service.PresentService;
import pl.edu.agh.io.service.ReservationService;
import pl.edu.agh.io.service.WishListService;

import javax.transaction.Transactional;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("${path.present}")
public class PresentController {

    private final PresentService presentService;
    private final WishListService wishListService;
    private final EmailService emailService;
    private final ReservationService reservationService;

    @Autowired
    public PresentController(PresentService presentService, WishListService wishListService, EmailService emailService, ReservationService reservationService) {
        this.presentService = presentService;
        this.wishListService = wishListService;
        this.emailService = emailService;
        this.reservationService = reservationService;
    }

    @GetMapping("/{id}")
    public Present getPresent(Long id) {
        return presentService.get(id);
    }

    @GetMapping
    public List<PresentInfoResponse> getPresents(@PathVariable("key") String key) {
        Long listId = wishListService.getByKey(key).getWishListId();
        List<Present> presents = wishListService.getPresents(listId);
        List<Present> reservedPresents = reservationService.findAllByListId(listId)
                .stream()
                .map(r -> r.getMapping().getPresent())
                .collect(Collectors.toList());
        return presents.stream().map(present -> {
            PresentInfoResponse presentInfoResponse = new PresentInfoResponse();
            presentInfoResponse.setDescription(present.getDescription());
            presentInfoResponse.setName(present.getName());
            presentInfoResponse.setPresentId(present.getPresentId());
            presentInfoResponse.setCategory(present.getCategory());
            presentInfoResponse.setShopLink(present.getShopLink());
            presentInfoResponse.setImageUrl(present.getImageUrl());
            presentInfoResponse.setBoughtOrReserved(reservedPresents.contains(present));
            presentInfoResponse.setWishListKey(key);
            return presentInfoResponse;
        }).collect(Collectors.toList());
    }

    @PostMapping
    public Present updatePresent(@RequestBody Present present) {
        return presentService.save(present);
    }

    @PostMapping("/add")
    public Present addPresent(@RequestBody Present present, @PathVariable("key") String key) {
        Long listId = wishListService.getByKey(key).getWishListId();
        present.setWishListKey(key);
        return wishListService.addPresent(listId, present);
    }

    @DeleteMapping(("{id}"))
    @Transactional
    public void delete(@PathVariable Long id) {
        wishListService.deletePresent(id);
        presentService.delete(id);
    }

    @GetMapping("/suggestions")
    public List<Suggestion> getSuggestions(@PathVariable("key") String key) {
        return presentService.getAllSuggestionsForList(key);
    }

    @PostMapping("/suggestions")
    public Suggestion createSuggestion(@RequestBody Suggestion suggestion) {
        return presentService.saveSuggestion(suggestion);
    }

    @GetMapping("/suggestions/{sId}")
    public void acceptOrDiscardSuggestion(@RequestParam("apply") boolean apply,@PathVariable("key") String key, @PathVariable("sId") Long sId){
        Suggestion suggestion = presentService.getSuggestion(sId);
        Present present = new Present(suggestion);
        if(apply){
            Long listId = wishListService.getByKey(key).getWishListId();
            wishListService.addPresent(listId, present);
        }
        presentService.deleteSuggestion(sId);
    }

    @GetMapping(value="/paged")
    List<Present> list(Pageable pageable, @PathVariable("key") String key){
        Page<Present> presentsPage = presentService.findByWishListKey(pageable, key);
        Long listId = wishListService.getByKey(key).getWishListId();

        List<Present> reservedPresents = reservationService.findAllByListId(listId)
                .stream()
                .map(r -> r.getMapping().getPresent())
                .collect(Collectors.toList());

        return pageToList(presentsPage).stream().map(present -> {
            PresentInfoResponse presentInfoResponse = new PresentInfoResponse();
            presentInfoResponse.setDescription(present.getDescription());
            presentInfoResponse.setName(present.getName());
            presentInfoResponse.setPresentId(present.getPresentId());
            presentInfoResponse.setCategory(present.getCategory());
            presentInfoResponse.setShopLink(present.getShopLink());
            presentInfoResponse.setImageUrl(present.getImageUrl());
            presentInfoResponse.setBoughtOrReserved(reservedPresents.contains(present));
            presentInfoResponse.setWishListKey(key);
            return presentInfoResponse;
        }).collect(Collectors.toList());
    }

    @GetMapping("/paged/reserved")
    List<Present> getReservedPage(Pageable pageable, @PathVariable("key") String key){
        Long listId = wishListService.getByKey(key).getWishListId();
        List<Present> reservedPresents = pageToList(reservationService.findAllByListId(listId, pageable))
                .stream()
                .map(r -> r.getMapping().getPresent())
                .collect(Collectors.toList());
        return reservedPresents.stream().map(present -> {
            PresentInfoResponse presentInfoResponse = new PresentInfoResponse();
            presentInfoResponse.setDescription(present.getDescription());
            presentInfoResponse.setName(present.getName());
            presentInfoResponse.setPresentId(present.getPresentId());
            presentInfoResponse.setCategory(present.getCategory());
            presentInfoResponse.setShopLink(present.getShopLink());
            presentInfoResponse.setImageUrl(present.getImageUrl());
            presentInfoResponse.setBoughtOrReserved(reservedPresents.contains(present));
            presentInfoResponse.setWishListKey(key);
            return presentInfoResponse;
        }).collect(Collectors.toList());
    }



    @GetMapping("/paged/notReserved")
    List<Present> getNotReservedPage(Pageable pageable, @PathVariable("key") String key){
        List<Long> reservedIds = reservationService.findAll().stream().map(PresentReservation::getPresentId).collect(Collectors.toList());
        reservedIds.add((long) -1);
        System.out.println("reserved ids: " + reservedIds.stream().map(Object::toString).reduce( (s, s2) -> s + s2 + ","));
        return pageToList(presentService.findByWishListKeyAndPresentIdNotIn(key, reservedIds, pageable));
    }

    private <T> List<T> pageToList(Page<T> page){
        List<T> res = new ArrayList<>();
        page.forEach(res::add);
        return res;
    }


    @PostMapping("/reservationStatus")
    public List<Boolean> getReservationStatuses(@RequestBody PresentsIds ids, @PathVariable("key") String key){
        Long listId = wishListService.getByKey(key).getWishListId();

        List<Present> reservedPresents = reservationService.findAllByListId(listId)
                .stream()
                .map(r -> r.getMapping().getPresent())
                .collect(Collectors.toList());

        return ids
                .getIds()
                .stream()
                .map(presentService::findByPresentId)
                .map(reservedPresents::contains)
                .collect(Collectors.toList());
    }


    @PostMapping("/havingId")
    List<Present> getPresentsHavingIds(@RequestBody PresentsIds ids, @PathVariable("key") String key){
        Long listId = wishListService.getByKey(key).getWishListId();
        List<Present> reservedPresents = reservationService.findAllByListId(listId)
                .stream()
                .map(r -> r.getMapping().getPresent())
                .collect(Collectors.toList());

        return ids
                .getIds()
                .stream()
                .map(presentService::findByPresentId)
                .map(present -> {
                    PresentInfoResponse presentInfoResponse = new PresentInfoResponse();
                    presentInfoResponse.setDescription(present.getDescription());
                    presentInfoResponse.setName(present.getName());
                    presentInfoResponse.setPresentId(present.getPresentId());
                    presentInfoResponse.setCategory(present.getCategory());
                    presentInfoResponse.setShopLink(present.getShopLink());
                    presentInfoResponse.setImageUrl(present.getImageUrl());
                    presentInfoResponse.setBoughtOrReserved(reservedPresents.contains(present));
                    presentInfoResponse.setWishListKey(key);
                    return presentInfoResponse;
                }).collect(Collectors.toList());
    }
}
