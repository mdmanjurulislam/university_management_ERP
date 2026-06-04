package app.app_server.faculty.util;

import org.springframework.stereotype.Component;

@Component
public class FacultyCodeGenerator {

    /**
     * Generates a faculty code based on the pattern: [DepartmentCode]-FAC-[DatabaseId]
     *
     * @param departmentCode The department code (e.g. CSE)
     * @param databaseId     The database ID (e.g. 1001)
     * @return Generated Faculty Code (e.g. CSE-FAC-1001)
     */
    public String generateFacultyCode(String departmentCode, Integer databaseId) {
        if (departmentCode == null || databaseId == null) {
            throw new IllegalArgumentException("Department code and Database ID must not be null");
        }
        return String.format("%s-FAC-%d", departmentCode.toUpperCase(), databaseId);
    }
}
