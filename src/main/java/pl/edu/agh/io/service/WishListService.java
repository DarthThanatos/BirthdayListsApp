package pl.edu.agh.io.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import pl.edu.agh.io.model.list.WishList;
import pl.edu.agh.io.model.list.WishListRepository;
import pl.edu.agh.io.model.present.Present;
import pl.edu.agh.io.model.reservation.Mapping;
import pl.edu.agh.io.model.reservation.MappingRepository;
import pl.edu.agh.io.model.user.User;
import pl.edu.agh.io.request.ListCreationRequest;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class WishListService {

    private final WishListRepository wishListRepository;
    private final MappingRepository mappingRepository;
    private final PresentService presentService;

    @Autowired
    public WishListService(WishListRepository wishListRepository, MappingRepository mappingRepository, PresentService presentService) {
        this.wishListRepository = wishListRepository;
        this.mappingRepository = mappingRepository;
        this.presentService = presentService;
    }

    public List<WishList> getAll(User user) {
        return wishListRepository.findAllByUser(user);
    }

    public WishList get(Long id) {
        return wishListRepository.findOne(id);
    }

    public WishList createList(ListCreationRequest listCreationRequest, Object principal) {
        User user = (User) principal;
        WishList wishList = new WishList(user, LocalDateTime.now(), listCreationRequest.getTitle(),
                UUID.randomUUID().toString(), listCreationRequest.suggestions(), listCreationRequest.isPriceRange(),
                listCreationRequest.getMinPrice(), listCreationRequest.getMaxPrice(), listCreationRequest.inform());
        wishList.setColor(listCreationRequest.getColor());
        WishList list = wishListRepository.save(wishList);
        listCreationRequest.getPresents().forEach(present -> {
            present = presentService.save(present);
            Mapping mapping = new Mapping(present, list);
            mappingRepository.save(mapping);
        });
        return list;
    }

    public void delete(Long id) {
        wishListRepository.delete(id);
    }

    public List<Present> getPresents(Long id) {
        return mappingRepository.findByWishListWishListId(id)
                .stream().map(Mapping::getPresent)
                .collect(Collectors.toList());
    }

    public Present addPresent(Long id, Present present) {
        WishList wishList = wishListRepository.findOne(id);
        present = presentService.save(present);
        Mapping mapping = new Mapping(present, wishList);
        mappingRepository.save(mapping);
        return present;
    }

    public WishList getByKey(String key) {
        return wishListRepository.findByKey(key);
    }

    public void deletePresent(Long id) {
        mappingRepository.deleteByPresentPresentId(id);
    }
}
