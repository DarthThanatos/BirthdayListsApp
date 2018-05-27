package pl.edu.agh.io.model.reservation;

import pl.edu.agh.io.model.list.WishList;
import pl.edu.agh.io.model.present.Present;

import javax.persistence.*;

@Entity
public class Mapping {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(optional = false)
    @JoinColumn(name = "presentId")
    private Present present;

    @ManyToOne(optional = false)
    @JoinColumn(name = "wishListId")
    private WishList wishList;

    public Mapping() {
    }

    public Mapping(Present present, WishList wishList) {
        this.present = present;
        this.wishList = wishList;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Present getPresent() {
        return present;
    }

    public void setPresent(Present present) {
        this.present = present;
    }

    public WishList getWishList() {
        return wishList;
    }

    public void setWishList(WishList wishList) {
        this.wishList = wishList;
    }
}
