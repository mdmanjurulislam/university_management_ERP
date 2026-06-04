package app.app_server.student.util;

import org.springframework.stereotype.Component;

@Component
public class StudentIdGenerator {

    /**
     * Generates a student ID based on the pattern: [semester.year] + [department.departmentCode] + [databaseId]
     *
     * @param year           The year of the semester
     * @param departmentCode The department code
     * @param databaseId     The generated database ID
     * @return Generated Student ID
     */
    public String generateStudentId(Integer year, String departmentCode, Integer databaseId) {
        return String.format("%d%s%d", year, departmentCode, databaseId);
    }
}
