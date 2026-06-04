package app.app_server.semester.repository;

import app.app_server.semester.model.Semester;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface SemesterRepository extends JpaRepository<Semester, Integer>, JpaSpecificationExecutor<Semester> {
    boolean existsBySemesterCode(String semesterCode);
    Optional<Semester> findByIsCurrentSemesterTrue();
}
