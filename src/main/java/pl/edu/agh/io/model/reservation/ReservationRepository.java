package pl.edu.agh.io.model.reservation;

import org.springframework.data.repository.PagingAndSortingRepository;

import java.util.List;

public interface ReservationRepository extends PagingAndSortingRepository<PresentReservation, Long> {

    List<PresentReservation> findAllByMappingWishListWishListId(Long wishListId);

    PresentReservation findByKey(String key);

    void deleteByKey(String key);
}
