package app.app_server.faculty.mapper;

import app.app_server.department.dto.mapper.DepartmentMapper;
import app.app_server.faculty.dto.request.FacultyCreateRequest;
import app.app_server.faculty.dto.request.FacultyUpdateRequest;
import app.app_server.faculty.dto.response.FacultyListResponse;
import app.app_server.faculty.dto.response.FacultyResponse;
import app.app_server.faculty.entity.Faculty;
import org.springframework.stereotype.Component;

@Component
public class FacultyMapper {

    private final DepartmentMapper departmentMapper;

    public FacultyMapper(DepartmentMapper departmentMapper) {
        this.departmentMapper = departmentMapper;
    }

    public Faculty toEntity(FacultyCreateRequest request) {
        if (request == null) {
            return null;
        }

        Faculty faculty = new Faculty();
        faculty.setFirstName(request.getFirstName());
        faculty.setLastName(request.getLastName());
        faculty.setFullName(request.getFirstName() + " " + request.getLastName());
        faculty.setEmail(request.getEmail());
        faculty.setPhone(request.getPhone());
        faculty.setGender(request.getGender());
        faculty.setDateOfBirth(request.getDateOfBirth());
        faculty.setBloodGroup(request.getBloodGroup());
        faculty.setEmployeeId(request.getEmployeeId());
        faculty.setDesignation(request.getDesignation());
        faculty.setJoiningDate(request.getJoiningDate());
        faculty.setEmploymentType(request.getEmploymentType());
        faculty.setHighestQualification(request.getHighestQualification());
        faculty.setSpecialization(request.getSpecialization());
        faculty.setOfficeRoom(request.getOfficeRoom());

        return faculty;
    }

    public void updateEntity(FacultyUpdateRequest request, Faculty faculty) {
        if (request == null || faculty == null) {
            return;
        }

        boolean nameChanged = false;
        if (request.getFirstName() != null) {
            faculty.setFirstName(request.getFirstName());
            nameChanged = true;
        }
        if (request.getLastName() != null) {
            faculty.setLastName(request.getLastName());
            nameChanged = true;
        }
        if (nameChanged) {
            faculty.setFullName(faculty.getFirstName() + " " + faculty.getLastName());
        }

        if (request.getEmail() != null) {
            faculty.setEmail(request.getEmail());
        }
        if (request.getPhone() != null) {
            faculty.setPhone(request.getPhone());
        }
        if (request.getGender() != null) {
            faculty.setGender(request.getGender());
        }
        if (request.getDateOfBirth() != null) {
            faculty.setDateOfBirth(request.getDateOfBirth());
        }
        if (request.getBloodGroup() != null) {
            faculty.setBloodGroup(request.getBloodGroup());
        }
        if (request.getDesignation() != null) {
            faculty.setDesignation(request.getDesignation());
        }
        if (request.getEmploymentType() != null) {
            faculty.setEmploymentType(request.getEmploymentType());
        }
        if (request.getHighestQualification() != null) {
            faculty.setHighestQualification(request.getHighestQualification());
        }
        if (request.getSpecialization() != null) {
            faculty.setSpecialization(request.getSpecialization());
        }
        if (request.getOfficeRoom() != null) {
            faculty.setOfficeRoom(request.getOfficeRoom());
        }
        if (request.getIsActive() != null) {
            faculty.setIsActive(request.getIsActive());
        }
    }

    public FacultyResponse toResponse(Faculty faculty) {
        if (faculty == null) {
            return null;
        }

        FacultyResponse response = new FacultyResponse();
        response.setId(faculty.getId());
        response.setFacultyCode(faculty.getFacultyCode());
        response.setFirstName(faculty.getFirstName());
        response.setLastName(faculty.getLastName());
        response.setFullName(faculty.getFullName());
        response.setEmail(faculty.getEmail());
        response.setPhone(faculty.getPhone());
        response.setGender(faculty.getGender());
        response.setDateOfBirth(faculty.getDateOfBirth());
        response.setBloodGroup(faculty.getBloodGroup());
        response.setEmployeeId(faculty.getEmployeeId());
        response.setDesignation(faculty.getDesignation());
        response.setJoiningDate(faculty.getJoiningDate());
        response.setEmploymentType(faculty.getEmploymentType());
        response.setHighestQualification(faculty.getHighestQualification());
        response.setSpecialization(faculty.getSpecialization());
        response.setOfficeRoom(faculty.getOfficeRoom());

        if (faculty.getDepartment() != null) {
            response.setDepartment(departmentMapper.toResponseDTO(faculty.getDepartment()));
        }

        response.setIsActive(faculty.getIsActive());
        response.setCreatedBy(faculty.getCreatedBy());
        response.setCreatedAt(faculty.getCreatedAt());
        response.setUpdatedBy(faculty.getUpdatedBy());
        response.setUpdatedAt(faculty.getUpdatedAt());

        return response;
    }

    public FacultyListResponse toListResponse(Faculty faculty) {
        if (faculty == null) {
            return null;
        }

        FacultyListResponse response = new FacultyListResponse();
        response.setId(faculty.getId());
        response.setFacultyCode(faculty.getFacultyCode());
        response.setFullName(faculty.getFullName());
        response.setEmail(faculty.getEmail());
        response.setPhone(faculty.getPhone());
        response.setEmployeeId(faculty.getEmployeeId());
        response.setDesignation(faculty.getDesignation());
        response.setEmploymentType(faculty.getEmploymentType());

        if (faculty.getDepartment() != null) {
            response.setDepartmentName(faculty.getDepartment().getDepartmentName());
        }

        response.setIsActive(faculty.getIsActive());

        return response;
    }
}
