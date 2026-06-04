package app.app_server.student.service;

import app.app_server.common.PageResponse;
import app.app_server.student.dto.request.StudentCreateRequest;
import app.app_server.student.dto.request.StudentUpdateRequest;
import app.app_server.student.dto.response.StudentListResponse;
import app.app_server.student.dto.response.StudentResponse;

public interface StudentService {

    StudentResponse enrollStudent(StudentCreateRequest request);

    StudentResponse updateStudent(Integer id, StudentUpdateRequest request);

    StudentResponse getStudentById(Integer id);

    StudentResponse getStudentByStudentId(String studentId);

    PageResponse<StudentListResponse> getAllStudents(
            String search,
            Integer departmentId,
            Integer semesterId,
            Integer batchYear,
            Boolean isActive,
            int page,
            int size,
            String sortBy,
            String sortDirection
    );

    void softDeleteStudent(Integer id);
}
