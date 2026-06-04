package app.app_server.faculty.repository;

import app.app_server.faculty.entity.Faculty;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface FacultyRepository extends JpaRepository<Faculty, Integer>, JpaSpecificationExecutor<Faculty> {

    Optional<Faculty> findByFacultyCode(String facultyCode);

    boolean existsByFacultyCode(String facultyCode);

    boolean existsByEmail(String email);

    boolean existsByPhone(String phone);

    boolean existsByEmployeeId(String employeeId);

    boolean existsByEmailAndIdNot(String email, Integer id);

    boolean existsByPhoneAndIdNot(String phone, Integer id);

    boolean existsByEmployeeIdAndIdNot(String employeeId, Integer id);

    Optional<Faculty> findByUserUserId(int userId);

    Optional<Faculty> findByUserUserName(String userName);
}
