package pl.edu.agh.io.model.user;

import org.springframework.data.repository.PagingAndSortingRepository;

import java.util.Optional;

public interface UserRepository extends PagingAndSortingRepository<User, Long>{

    Optional<User> findByEmail(String email);
}
