package app.app_server.student.specification;

import app.app_server.student.entity.Student;
import jakarta.persistence.criteria.Predicate;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.util.StringUtils;

import java.util.ArrayList;
import java.util.List;

public class StudentSpecification {

    public static Specification<Student> getFilterSpecification(
            String search,
            Integer departmentId,
            Integer semesterId,
            Integer batchYear,
            Boolean isActive
    ) {
        return (root, query, criteriaBuilder) -> {
            List<Predicate> predicates = new ArrayList<>();

            // Search by studentId, fullName, email, phone
            if (StringUtils.hasText(search)) {
                String searchPattern = "%" + search.toLowerCase() + "%";
                Predicate studentIdPredicate = criteriaBuilder.like(criteriaBuilder.lower(root.get("studentId")), searchPattern);
                Predicate fullNamePredicate = criteriaBuilder.like(criteriaBuilder.lower(root.get("fullName")), searchPattern);
                Predicate emailPredicate = criteriaBuilder.like(criteriaBuilder.lower(root.get("email")), searchPattern);
                Predicate phonePredicate = criteriaBuilder.like(criteriaBuilder.lower(root.get("phone")), searchPattern);

                predicates.add(criteriaBuilder.or(studentIdPredicate, fullNamePredicate, emailPredicate, phonePredicate));
            }

            // Filter by department
            if (departmentId != null) {
                predicates.add(criteriaBuilder.equal(root.get("department").get("id"), departmentId));
            }

            // Filter by semester
            if (semesterId != null) {
                predicates.add(criteriaBuilder.equal(root.get("semester").get("id"), semesterId));
            }

            // Filter by batch year
            if (batchYear != null) {
                predicates.add(criteriaBuilder.equal(root.get("batchYear"), batchYear));
            }

            // Filter by isActive status (BaseEntity handles this)
            if (isActive != null) {
                predicates.add(criteriaBuilder.equal(root.get("isActive"), isActive));
            }

            return criteriaBuilder.and(predicates.toArray(new Predicate[0]));
        };
    }
}
