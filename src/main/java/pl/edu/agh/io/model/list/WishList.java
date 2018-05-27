package pl.edu.agh.io.model.list;

import com.fasterxml.jackson.annotation.JsonIgnore;
import pl.edu.agh.io.model.user.User;

import javax.persistence.*;
import java.time.LocalDateTime;

@Entity
public class WishList {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long wishListId;

    @ManyToOne(optional = true)
    @JoinColumn(name = "userId")
    private User user;

    private LocalDateTime creationDate;
    private String listName;
    private String key;
    private boolean isAllowingSuggestions;
    private boolean priceRange;
    private int minPrice;
    private int maxPrice;
    private boolean isHiddenFromOwner;
    private String color;

    public WishList() {

    }

    public WishList(User user, LocalDateTime creationDate, String listName, String key, boolean isAllowingSuggestions, boolean priceRange, int minPrice, int maxPrice, boolean isHiddenFromOwner) {
        this.user = user;
        this.creationDate = creationDate;
        this.listName = listName;
        this.key = key;
        this.isAllowingSuggestions = isAllowingSuggestions;
        this.priceRange = priceRange;
        this.minPrice = minPrice;
        this.maxPrice = maxPrice;
        this.isHiddenFromOwner = isHiddenFromOwner;
    }

    public Long getWishListId() {
        return wishListId;
    }

    public void setWishListId(Long wishListId) {
        this.wishListId = wishListId;
    }

    @JsonIgnore
    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public LocalDateTime getCreationDate() {
        return creationDate;
    }

    public void setCreationDate(LocalDateTime creationDate) {
        this.creationDate = creationDate;
    }

    public String getListName() {
        return listName;
    }

    public void setListName(String listName) {
        this.listName = listName;
    }

    public String getKey() {
        return key;
    }

    public void setKey(String key) {
        this.key = key;
    }

    public boolean isAllowingSuggestions() {
        return isAllowingSuggestions;
    }

    public void setAllowingSuggestions(boolean allowingSuggestions) {
        isAllowingSuggestions = allowingSuggestions;
    }

    public boolean isHiddenFromOwner() {
        return isHiddenFromOwner;
    }

    public void setHiddenFromOwner(boolean hiddenFromOwner) {
        isHiddenFromOwner = hiddenFromOwner;
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

    public boolean isPriceRange() {
        return priceRange;
    }

    public void setPriceRange(boolean priceRange) {
        this.priceRange = priceRange;
    }

    public String getColor() {
        return color;
    }

    public void setColor(String color) {
        this.color = color;
    }
}
