package pl.edu.agh.io.request;

import com.fasterxml.jackson.annotation.JsonProperty;
import pl.edu.agh.io.model.present.Present;

import javax.validation.constraints.NotNull;
import javax.validation.constraints.Size;
import java.util.ArrayList;
import java.util.List;

public class ListCreationRequest {

    @NotNull
    @Size(min = 5)
    private String listName;
    private boolean suggestions;
    private boolean inform;
    private boolean priceRange;
    private int minPrice;
    private int maxPrice;
    private List<Present> presents = new ArrayList<>();
    private String color;

    public ListCreationRequest(@JsonProperty("listName") String listName,
                               @JsonProperty("suggestions") boolean suggestions,
                               @JsonProperty("inform") boolean inform,
                               @JsonProperty("color") String color) {
        this.listName = listName;
        this.suggestions = suggestions;
        this.inform = inform;
        this.color = color;
    }

    public String getTitle() {
        return listName;
    }

    public boolean suggestions() {
        return suggestions;
    }

    public boolean inform() {
        return inform;
    }

    public boolean isPriceRange() {
        return priceRange;
    }

    public void setPriceRange(boolean priceRange) {
        this.priceRange = priceRange;
    }

    public int getMinPrice() {
        return minPrice;
    }

    public void setMinPrice(int minPrice) {
        this.minPrice = minPrice;
    }

    public int getMaxPrice() {
        return maxPrice;
    }

    public void setMaxPrice(int maxPrice) {
        this.maxPrice = maxPrice;
    }

    public List<Present> getPresents() {
        return presents;
    }

    public void setPresents(List<Present> presents) {
        this.presents = presents;
    }

    public String getColor() {
        return color;
    }
}
