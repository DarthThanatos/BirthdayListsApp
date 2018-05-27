package pl.edu.agh.io.rest.present;

import pl.edu.agh.io.model.present.Present;

public class PresentInfoResponse extends Present {

    private boolean boughtOrReserved;

    public PresentInfoResponse() {
    }

    public boolean isBoughtOrReserved() {
        return boughtOrReserved;
    }

    public void setBoughtOrReserved(boolean boughtOrReserved) {
        this.boughtOrReserved = boughtOrReserved;
    }
}
