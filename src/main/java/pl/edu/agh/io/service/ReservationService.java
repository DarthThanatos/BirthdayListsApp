package pl.edu.agh.io.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import pl.edu.agh.io.model.present.Present;
import pl.edu.agh.io.model.reservation.Mapping;
import pl.edu.agh.io.model.reservation.MappingRepository;
import pl.edu.agh.io.model.reservation.PresentReservation;
import pl.edu.agh.io.model.reservation.ReservationRepository;
import pl.edu.agh.io.request.ReservationRequest;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Service
public class ReservationService {

    private final ReservationRepository reservationRepository;
    private final MappingRepository mappingRepository;
    private final EmailService emailService;

    @Autowired
    public ReservationService(ReservationRepository reservationRepository, MappingRepository mappingRepository, EmailService emailService) {
        this.reservationRepository = reservationRepository;
        this.mappingRepository = mappingRepository;
        this.emailService = emailService;
    }


    public List<PresentReservation> findAllByListId(Long listId) {
        return reservationRepository.findAllByMappingWishListWishListId(listId);
    }

    public PresentReservation createReservation(ReservationRequest reservationRequest) {
        Mapping mapping = mappingRepository.findByPresentPresentId(reservationRequest.getPresentId());
        PresentReservation presentReservation = new PresentReservation(mapping, reservationRequest.getBuyerName(), reservationRequest.getBuyerEmail(),
                LocalDateTime.now(), reservationRequest.getPresentId());
        String key = UUID.randomUUID().toString();
        if(!sendUnreservationLink(presentReservation.getBuyerEmail(), key)) return null;
        presentReservation.setKey(key);
        return reservationRepository.save(presentReservation);
    }

    private boolean sendUnreservationLink(String buyerEmail, String key) {
        return emailService.sendSimpleMessage(buyerEmail, "Reservation",  "Kliknij w poniższy link by zrezygnować z rezerwacji:\nlocalhost:8080/api/reservation/resign/" + key);
    }

    public PresentReservation save(PresentReservation presentReservation) {
        return reservationRepository.save(presentReservation);
    }

    public PresentReservation findByKey(String key) {
        return reservationRepository.findByKey(key);
    }

    public void deleteByKey(String key) {
        reservationRepository.deleteByKey(key);
    }

}
