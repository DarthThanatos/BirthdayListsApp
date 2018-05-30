package pl.edu.agh.io.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import pl.edu.agh.io.model.present.Present;
import pl.edu.agh.io.model.present.PresentRepository;
import pl.edu.agh.io.model.suggestion.Suggestion;
import pl.edu.agh.io.model.suggestion.SuggestionRepository;

import java.util.List;

@Service
public class PresentService {

    private final PresentRepository presentRepository;
    private final SuggestionRepository suggestionRepository;

    @Autowired
    public PresentService(PresentRepository presentRepository, SuggestionRepository suggestionRepository) {
        this.presentRepository = presentRepository;
        this.suggestionRepository = suggestionRepository;
    }

    public Present save(Present present) {
        return presentRepository.save(present);
    }

    public void delete(Long presentId) {
        presentRepository.delete(presentId);
    }

    public Present get(Long id) {
        return presentRepository.findOne(id);
    }

    public List<Suggestion> getAllSuggestionsForList(String key) {
        return suggestionRepository.findByKey(key);
    }

    public void deleteSuggestion(Long id) {
        suggestionRepository.delete(id);
    }

    public Suggestion getSuggestion(Long sId) {
        return suggestionRepository.findOne(sId);
    }

    public Suggestion saveSuggestion(Suggestion suggestion) {
        return suggestionRepository.save(suggestion);
    }

    public Page<Present> findByWishListKey(Pageable pageable, String key) {
        return presentRepository.findByWishListKey(key, pageable);
    }
}
