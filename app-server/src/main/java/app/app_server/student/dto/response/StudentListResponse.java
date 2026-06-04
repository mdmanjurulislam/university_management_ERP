package app.app_server.student.dto.response;

import app.app_server.student.enums.Gender;
import lombok.Data;

@Data
public class StudentListResponse {
    private Integer id;
    private String studentId;
    private String fullName;
    private String email;
    private String phone;
    private Gender gender;
    private Integer batchYear;
    private String departmentName;
    private String semesterName;
    private Boolean isActive;
}
