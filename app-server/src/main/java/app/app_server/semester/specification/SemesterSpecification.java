package app.app_server.semester.specification;

import app.app_server.semester.enums.SemesterName;
import app.app_server.semester.model.Semester;
import jakarta.persistence.criteria.Predicate;
import org.springframework.data.jpa.domain.Specification;

import java.util.ArrayList;
import java.util.List;

public class SemesterSpecification {

    public static Specification<Semester> getSemesters(String semesterCode, SemesterName semesterName, Integer year, Boolean isCurrentSemester, Boolean isActive) {
        return (root, query, criteriaBuilder) -> {
            List<Predicate> predicates = new ArrayList<>();

            if (semesterCode != null && !semesterCode.trim().isEmpty()) {
                predicates.add(criteriaBuilder.like(criteriaBuilder.lower(root.get("semesterCode")), "%" + semesterCode.toLowerCase() + "%"));
            }

            if (semesterName != null) {
                predicates.add(criteriaBuilder.equal(root.get("semesterName"), semesterName));
            }

            if (year != null) {
                predicates.add(criteriaBuilder.equal(root.get("year"), year));
            }

            if (isCurrentSemester != null) {
                predicates.add(criteriaBuilder.equal(root.get("isCurrentSemester"), isCurrentSemester));
            }

            if (isActive != null) {
                predicates.add(criteriaBuilder.equal(root.get("isActive"), isActive));
            }

            return criteriaBuilder.and(predicates.toArray(new Predicate[0]));
        };
    }
}
