package app.app_server.department.repository;

import app.app_server.department.model.Department;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface DepartmentRepository extends JpaRepository<Department, Integer> {
    
    Optional<Department> findByDepartmentCode(String departmentCode);
    
    List<Department> findByIsActiveTrue();
    
    boolean existsByDepartmentCode(String departmentCode);
}
