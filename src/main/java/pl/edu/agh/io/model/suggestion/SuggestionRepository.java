package pl.edu.agh.io.model.suggestion;

import org.springframework.data.repository.PagingAndSortingRepository;

import java.util.List;

public interface SuggestionRepository extends PagingAndSortingRepository<Suggestion, Long> {

    List<Suggestion> findByWishListKey(String key);

}
