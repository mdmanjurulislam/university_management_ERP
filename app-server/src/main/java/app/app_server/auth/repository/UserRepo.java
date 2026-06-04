package app.app_server.auth.repository;

import app.app_server.auth.model.Users;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
@Repository
public interface UserRepo extends JpaRepository<Users,Integer> {
    Users findByUserName(String userName);

    Users findByUserPassword(String userPassword);

    @Query(value = "SELECT * FROM Users WHERE is_active = 1", nativeQuery = true)
    public List<Users> getAllActiveUser();

    void deleteById(int userId);
}
