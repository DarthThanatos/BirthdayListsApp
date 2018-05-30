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
    private String category;
    private String shopLink;
    private String imageUrl;
    private String wishListKey;

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

    public String getCategory() {
        return category;
    }

    public void setCategory(String category) {
        this.category = category;
    }

    public String getShopLink() {
        return shopLink;
    }

    public void setShopLink(String shopLink) {
        this.shopLink = shopLink;
    }

    public String getImageUrl() {
        return imageUrl;
    }

    public void setImageUrl(String imageUrl) {
        this.imageUrl = imageUrl;
    }

    public String getWishListKey() {
        return wishListKey;
    }

    public void setWishListKey(String wishListKey) {
        this.wishListKey = wishListKey;
    }
}
