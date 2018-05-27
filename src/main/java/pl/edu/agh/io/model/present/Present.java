package pl.edu.agh.io.model.present;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;

@Entity
public class Present {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long presentId;

    private String name;
    private String description;

    public Present() {
    }

    public Present(String name, String description) {
        this.name = name;
        this.description = description;
    }

    public Long getPresentId() {
        return presentId;
    }

    public void setPresentId(Long presentId) {
        this.presentId = presentId;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }
}
