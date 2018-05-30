package pl.edu.agh.io.model.reservation;

import javax.persistence.*;
import java.time.LocalDateTime;

@Entity
public class PresentReservation {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long reservationId;

    @OneToOne
    @JoinColumn(name = "mappingId")
    private Mapping mapping;

    private String buyerName;
    private String buyerEmail;
    private LocalDateTime reservationDate;
    private String key;

    private Long presentId;

    public PresentReservation() {
    }

    public PresentReservation(Mapping mapping, String buyerName, String buyerEmail, LocalDateTime reservationDate, long presentId) {
        this.mapping = mapping;
        this.buyerName = buyerName;
        this.buyerEmail = buyerEmail;
        this.reservationDate = reservationDate;
        this.presentId = presentId;
    }

    public Long getReservationId() {
        return reservationId;
    }

    public void setReservationId(Long reservationId) {
        this.reservationId = reservationId;
    }

    public Mapping getMapping() {
        return mapping;
    }

    public void setMapping(Mapping mapping) {
        this.mapping = mapping;
    }

    public String getBuyerName() {
        return buyerName;
    }

    public void setBuyerName(String buyerName) {
        this.buyerName = buyerName;
    }

    public String getBuyerEmail() {
        return buyerEmail;
    }

    public void setBuyerEmail(String buyerEmail) {
        this.buyerEmail = buyerEmail;
    }

    public LocalDateTime getReservationDate() {
        return reservationDate;
    }

    public void setReservationDate(LocalDateTime reservationDate) {
        this.reservationDate = reservationDate;
    }

    public String getKey() {
        return key;
    }

    public void setKey(String key) {
        this.key = key;
    }

    public Long getPresentId() {
        return presentId;
    }

    public void setPresentId(Long presentId) {
        this.presentId = presentId;
    }
}
