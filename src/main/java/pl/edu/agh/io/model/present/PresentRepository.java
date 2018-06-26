package pl.edu.agh.io.model.present;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.repository.PagingAndSortingRepository;

import java.util.List;

public interface PresentRepository extends PagingAndSortingRepository<Present, Long> {
    Page<Present> findByWishListKey(String wishListKey, Pageable pageable);
    List<Present> findByCategoryIgnoreCaseLikeOrNameIgnoreCaseLike(String category, String name);
    Present findByPresentId(Long id);
    Page<Present> findByWishListKeyAndPresentIdNotIn(String key, List<Long> ids, Pageable pageable);
}
