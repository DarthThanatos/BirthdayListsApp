package pl.edu.agh.io.model.reservation;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.repository.PagingAndSortingRepository;

import java.util.List;

public interface ReservationRepository extends PagingAndSortingRepository<PresentReservation, Long> {

    List<PresentReservation> findAllByMappingWishListWishListId(Long wishListId);
    Page<PresentReservation> findAllByMappingWishListWishListId(Long wishListId, Pageable pageable);

    PresentReservation findByKey(String key);

    void deleteByKey(String key);

    Page<PresentReservation> findAll(Pageable pageable);
}
