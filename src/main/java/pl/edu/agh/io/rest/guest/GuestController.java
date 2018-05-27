package pl.edu.agh.io.rest.guest;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import pl.edu.agh.io.model.list.WishList;
import pl.edu.agh.io.model.present.Present;
import pl.edu.agh.io.service.WishListService;

import java.util.List;

@RestController
@RequestMapping("${path.guest}")
public class GuestController {

    private final WishListService wishListService;

    @Autowired
    public GuestController(WishListService wishListService) {
        this.wishListService = wishListService;
    }

    @GetMapping
    public WishList getListByKey(@PathVariable("key") String key) {
        return wishListService.getByKey(key);
    }

    @GetMapping("presents")
    public List<Present> getPresentsOfList(@PathVariable("key") String key) {
        WishList byKey = wishListService.getByKey(key);
        return wishListService.getPresents(byKey.getWishListId());
    }

}
