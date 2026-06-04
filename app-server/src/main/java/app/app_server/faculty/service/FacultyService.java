package app.app_server.faculty.service;

import app.app_server.common.PageResponse;
import app.app_server.faculty.dto.request.FacultyCreateRequest;
import app.app_server.faculty.dto.request.FacultyUpdateRequest;
import app.app_server.faculty.dto.response.FacultyListResponse;
import app.app_server.faculty.dto.response.FacultyResponse;
import app.app_server.faculty.enums.Designation;
import app.app_server.faculty.enums.EmploymentType;

public interface FacultyService {

    FacultyResponse enrollFaculty(FacultyCreateRequest request);

    FacultyResponse updateFaculty(Integer id, FacultyUpdateRequest request);

    FacultyResponse getFacultyById(Integer id);

    FacultyResponse getFacultyByFacultyCode(String facultyCode);

    PageResponse<FacultyListResponse> getAllFaculties(
            String search,
            Integer departmentId,
            Designation designation,
            EmploymentType employmentType,
            Boolean isActive,
            int page,
            int size,
            String sortBy,
            String sortDirection
    );

    void softDeleteFaculty(Integer id);
}
