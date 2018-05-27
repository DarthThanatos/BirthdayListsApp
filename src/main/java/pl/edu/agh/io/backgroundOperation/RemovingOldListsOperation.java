package pl.edu.agh.io.backgroundOperation;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;
import pl.edu.agh.io.model.list.WishListRepository;
import pl.edu.agh.io.model.reservation.MappingRepository;
import pl.edu.agh.io.model.reservation.ReservationRepository;
import pl.edu.agh.io.model.suggestion.SuggestionRepository;

import javax.transaction.Transactional;
import java.time.LocalDateTime;

@Component
public class RemovingOldListsOperation {

    private static final long RATE = 3600000L * 24L;//days
    private static final long DELAY = 10000L;
    private final WishListRepository wishListRepository;
    private final SuggestionRepository suggestionRepository;
    private final MappingRepository mappingRepository;
    private final ReservationRepository reservationRepository;

    @Autowired
    public RemovingOldListsOperation(WishListRepository wishListRepository, SuggestionRepository suggestionRepository, MappingRepository mappingRepository, ReservationRepository reservationRepository) {
        this.wishListRepository = wishListRepository;
        this.suggestionRepository = suggestionRepository;
        this.mappingRepository = mappingRepository;
        this.reservationRepository = reservationRepository;
    }

    @Transactional
    @Scheduled(fixedRate = RATE, initialDelay = DELAY)
    public void removeOldLists() {
        LocalDateTime time = LocalDateTime.now().minusDays(407);
        wishListRepository.findByCreationDateBefore(time).forEach(list -> {
            reservationRepository.delete(reservationRepository.findAllByMappingWishListWishListId(list.getWishListId()));
            suggestionRepository.delete(suggestionRepository.findByKey(list.getKey()));
            mappingRepository.delete(mappingRepository.findByWishListWishListId(list.getWishListId()));
            wishListRepository.delete(list);
        });
    }
}
