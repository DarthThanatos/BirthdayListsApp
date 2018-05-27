package pl.edu.agh.io.request;

import com.fasterxml.jackson.annotation.JsonProperty;

public class ReservationRequest {

    private String buyerName;
    private String buyerEmail;
    private boolean isSuggestion;
    private boolean isBought;
    private Long presentId;
    private String frontUrl;

    public ReservationRequest(@JsonProperty("buyerName") String buyerName, @JsonProperty("buyerEmail") String buyerEmail,
                              @JsonProperty("isSuggestion") boolean isSuggestion, @JsonProperty("isBought") boolean isBought,
                              @JsonProperty("presentId") Long presentId, @JsonProperty("frontUrl") String frontUrl) {
        this.buyerName = buyerName;
        this.buyerEmail = buyerEmail;
        this.isSuggestion = isSuggestion;
        this.isBought = isBought;
        this.presentId = presentId;
        this.frontUrl = frontUrl;
    }

    public String getBuyerName() {
        return buyerName;
    }

    public String getBuyerEmail() {
        return buyerEmail;
    }

    public boolean isSuggestion() {
        return isSuggestion;
    }

    public boolean isBought() {
        return isBought;
    }

    public Long getPresentId() {
        return presentId;
    }

    public String getFrontUrl() {
        return frontUrl;
    }
}
