package pl.edu.agh.io.model.list;

import org.springframework.data.repository.PagingAndSortingRepository;
import pl.edu.agh.io.model.user.User;

import java.time.LocalDateTime;
import java.util.List;

public interface WishListRepository extends PagingAndSortingRepository<WishList, Long> {

    WishList findByKey(String key);

    List<WishList> findAllByUser(User user);

    List<WishList> findByCreationDateBefore(LocalDateTime time);
}
