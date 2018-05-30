package pl.edu.agh.io.rest.present;

import java.util.List;

public class PresentsIds{

    private List<Long> ids;

    public PresentsIds(){

    }

    public PresentsIds(List<Long> ids){
        this.ids = ids;
    }

    public List<Long> getIds() {
        return ids;
    }

    public void setIds(List<Long> ids) {
        this.ids = ids;
    }
}
