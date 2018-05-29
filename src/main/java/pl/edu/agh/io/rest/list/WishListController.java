package pl.edu.agh.io.rest.list;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpRequest;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import pl.edu.agh.io.model.list.ArchivedList;
import pl.edu.agh.io.model.list.WishList;
import pl.edu.agh.io.model.user.User;
import pl.edu.agh.io.request.ListCreationRequest;
import pl.edu.agh.io.rest.exceptions.Unauthorized;
import pl.edu.agh.io.security.authentication.UserAuthentication;
import pl.edu.agh.io.security.token.TokenManagerService;
import pl.edu.agh.io.service.WishListService;

import javax.servlet.http.HttpServletRequest;
import javax.validation.Valid;
import java.util.Arrays;
import java.util.List;

@RestController
@RequestMapping("${path.wishList}")
public class WishListController {

    private final WishListService wishListService;
    private final TokenManagerService tokenManagerService;

    @Autowired
    public WishListController(WishListService wishListService, TokenManagerService tokenManagerService) {
        this.wishListService = wishListService;
        this.tokenManagerService = tokenManagerService;
    }

    @GetMapping
    public Iterable<WishList> getAllLists(HttpServletRequest request) {
        User user = authenticate(request);
        return wishListService.getAll(user);
    }

    @GetMapping("/{id}")
    public WishList getList(@PathVariable Long id) {
        return wishListService.get(id);
    }

    @PostMapping
    public WishList saveList(@Valid @RequestBody ListCreationRequest listCreationRequest, HttpServletRequest request) {
        User user = authenticate(request);
        return wishListService.createList(listCreationRequest, user);
    }

    @GetMapping("/key/{key}")
    public WishList getListByKey(@PathVariable("key") String key){
        return wishListService.getByKey(key);
    }

    @DeleteMapping("/{id}")
    public void deleteList(@PathVariable Long id) {
        wishListService.delete(id);
    }

    private User authenticate(HttpServletRequest request) throws Unauthorized {
        return tokenManagerService.getUserFromToken(
                request.getHeader(
                        "Authorization"
                ).replace("bearer","").replace("Bearer", "").trim()
        )
        .orElseThrow(Unauthorized::new);
    }

    @GetMapping("/archive")
    public List<ArchivedList> getArchivedLists(HttpServletRequest request){
        authenticate(request);
        return Arrays.asList(
                new ArchivedList("Osiemnastka", "Rok temu"),
                new ArchivedList("Siedemnaste urodziny :)", "2 lata temu"),
                new ArchivedList("16 xD", "3 lata temu"),
                new ArchivedList("15 u babci", "4 lata temu")
        );
    }
}
