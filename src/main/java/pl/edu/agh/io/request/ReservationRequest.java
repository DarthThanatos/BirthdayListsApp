package pl.edu.agh.io.request;

import com.fasterxml.jackson.annotation.JsonProperty;

public class ReservationRequest {

    private String buyerName;
    private String buyerEmail;
    private Long presentId;

    public ReservationRequest(@JsonProperty("buyerName") String buyerName, @JsonProperty("buyerEmail") String buyerEmail,
                              @JsonProperty("presentId") Long presentId) {
        this.buyerName = buyerName;
        this.buyerEmail = buyerEmail;
        this.presentId = presentId;
    }

    public String getBuyerName() {
        return buyerName;
    }

    public String getBuyerEmail() {
        return buyerEmail;
    }


    public Long getPresentId() {
        return presentId;
    }

}
