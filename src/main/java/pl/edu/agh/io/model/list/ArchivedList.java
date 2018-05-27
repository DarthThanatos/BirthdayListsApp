package pl.edu.agh.io.model.list;

public class ArchivedList {

    private String name;
    private String when;

    public ArchivedList(String name, String when){
        this.name = name;
        this.when = when;
    }

    public String getName() {
        return name;
    }

    public String getWhen() {
        return when;
    }
}
