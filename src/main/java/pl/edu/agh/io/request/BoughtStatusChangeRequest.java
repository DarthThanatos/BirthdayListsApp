package pl.edu.agh.io.request;

import com.fasterxml.jackson.annotation.JsonProperty;

public class BoughtStatusChangeRequest {
    private Boolean isBought;

    public BoughtStatusChangeRequest(@JsonProperty("isBought") boolean isBought) {
        this.isBought = isBought;
    }

    public boolean isBought() {
        return isBought;
    }
}
