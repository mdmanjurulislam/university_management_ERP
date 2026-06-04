package app.app_server.faculty.specification;

import app.app_server.faculty.entity.Faculty;
import app.app_server.faculty.enums.Designation;
import app.app_server.faculty.enums.EmploymentType;
import jakarta.persistence.criteria.Predicate;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.util.StringUtils;

import java.util.ArrayList;
import java.util.List;

public class FacultySpecification {

    public static Specification<Faculty> getFilterSpecification(
            String search,
            Integer departmentId,
            Designation designation,
            EmploymentType employmentType,
            Boolean isActive
    ) {
        return (root, query, criteriaBuilder) -> {
            List<Predicate> predicates = new ArrayList<>();

            // Search by facultyCode, fullName, email, phone, employeeId
            if (StringUtils.hasText(search)) {
                String searchPattern = "%" + search.toLowerCase() + "%";
                Predicate facultyCodePredicate = criteriaBuilder.like(criteriaBuilder.lower(root.get("facultyCode")), searchPattern);
                Predicate fullNamePredicate = criteriaBuilder.like(criteriaBuilder.lower(root.get("fullName")), searchPattern);
                Predicate emailPredicate = criteriaBuilder.like(criteriaBuilder.lower(root.get("email")), searchPattern);
                Predicate phonePredicate = criteriaBuilder.like(criteriaBuilder.lower(root.get("phone")), searchPattern);
                Predicate employeeIdPredicate = criteriaBuilder.like(criteriaBuilder.lower(root.get("employeeId")), searchPattern);

                predicates.add(criteriaBuilder.or(
                        facultyCodePredicate,
                        fullNamePredicate,
                        emailPredicate,
                        phonePredicate,
                        employeeIdPredicate
                ));
            }

            // Filter by Department ID
            if (departmentId != null) {
                predicates.add(criteriaBuilder.equal(root.get("department").get("id"), departmentId));
            }

            // Filter by Designation
            if (designation != null) {
                predicates.add(criteriaBuilder.equal(root.get("designation"), designation));
            }

            // Filter by Employment Type
            if (employmentType != null) {
                predicates.add(criteriaBuilder.equal(root.get("employmentType"), employmentType));
            }

            // Filter by isActive
            if (isActive != null) {
                predicates.add(criteriaBuilder.equal(root.get("isActive"), isActive));
            }

            return criteriaBuilder.and(predicates.toArray(new Predicate[0]));
        };
    }
}
