package pl.edu.agh.io.model.reservation;

import org.springframework.data.repository.PagingAndSortingRepository;
import pl.edu.agh.io.model.present.Present;

import java.util.List;

public interface MappingRepository extends PagingAndSortingRepository<Mapping, Long> {

    List<Mapping> findByWishListWishListId(Long id);

    Mapping findByPresentPresentId(Long presentId);

    void deleteByPresentPresentId(Long id);
}
