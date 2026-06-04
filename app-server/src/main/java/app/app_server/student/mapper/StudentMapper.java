package app.app_server.student.mapper;

import app.app_server.department.dto.mapper.DepartmentMapper;
import app.app_server.semester.mapper.SemesterMapper;
import app.app_server.student.dto.request.StudentCreateRequest;
import app.app_server.student.dto.request.StudentUpdateRequest;
import app.app_server.student.dto.response.StudentListResponse;
import app.app_server.student.dto.response.StudentResponse;
import app.app_server.student.entity.Student;
import org.springframework.stereotype.Component;

@Component
public class StudentMapper {

    private final DepartmentMapper departmentMapper;
    private final SemesterMapper semesterMapper;

    public StudentMapper(DepartmentMapper departmentMapper, SemesterMapper semesterMapper) {
        this.departmentMapper = departmentMapper;
        this.semesterMapper = semesterMapper;
    }

    public Student toEntity(StudentCreateRequest request) {
        if (request == null) {
            return null;
        }

        Student student = new Student();
        student.setFullName(request.getFullName());
        student.setEmail(request.getEmail());
        student.setPhone(request.getPhone());
        student.setGender(request.getGender());
        student.setBloodGroup(request.getBloodGroup());
        student.setDateOfBirth(request.getDateOfBirth());
        student.setAdmissionDate(request.getAdmissionDate());
        student.setAddress(request.getAddress());
        student.setBatchYear(request.getBatchYear());
        student.setGuardianName(request.getGuardianName());
        student.setGuardianPhone(request.getGuardianPhone());

        return student;
    }

    public void updateEntity(StudentUpdateRequest request, Student student) {
        if (request == null || student == null) {
            return;
        }

        if (request.getFullName() != null) {
            student.setFullName(request.getFullName());
        }
        if (request.getEmail() != null) {
            student.setEmail(request.getEmail());
        }
        if (request.getPhone() != null) {
            student.setPhone(request.getPhone());
        }
        if (request.getGender() != null) {
            student.setGender(request.getGender());
        }
        if (request.getBloodGroup() != null) {
            student.setBloodGroup(request.getBloodGroup());
        }
        if (request.getDateOfBirth() != null) {
            student.setDateOfBirth(request.getDateOfBirth());
        }
        if (request.getAddress() != null) {
            student.setAddress(request.getAddress());
        }
        if (request.getGuardianName() != null) {
            student.setGuardianName(request.getGuardianName());
        }
        if (request.getGuardianPhone() != null) {
            student.setGuardianPhone(request.getGuardianPhone());
        }
        if (request.getIsActive() != null) {
            student.setIsActive(request.getIsActive());
        }
    }

    public StudentResponse toResponse(Student student) {
        if (student == null) {
            return null;
        }

        StudentResponse response = new StudentResponse();
        response.setId(student.getId());
        response.setStudentId(student.getStudentId());
        response.setFullName(student.getFullName());
        response.setEmail(student.getEmail());
        response.setPhone(student.getPhone());
        response.setGender(student.getGender());
        response.setBloodGroup(student.getBloodGroup());
        response.setDateOfBirth(student.getDateOfBirth());
        response.setAdmissionDate(student.getAdmissionDate());
        response.setAddress(student.getAddress());
        response.setBatchYear(student.getBatchYear());
        response.setGuardianName(student.getGuardianName());
        response.setGuardianPhone(student.getGuardianPhone());
        
        if (student.getDepartment() != null) {
            response.setDepartment(departmentMapper.toResponseDTO(student.getDepartment()));
        }
        
        if (student.getSemester() != null) {
            response.setSemester(semesterMapper.toResponseDTO(student.getSemester()));
        }

        response.setIsActive(student.getIsActive());
        response.setCreatedBy(student.getCreatedBy());
        response.setCreatedAt(student.getCreatedAt());
        response.setUpdatedBy(student.getUpdatedBy());
        response.setUpdatedAt(student.getUpdatedAt());

        return response;
    }

    public StudentListResponse toListResponse(Student student) {
        if (student == null) {
            return null;
        }

        StudentListResponse response = new StudentListResponse();
        response.setId(student.getId());
        response.setStudentId(student.getStudentId());
        response.setFullName(student.getFullName());
        response.setEmail(student.getEmail());
        response.setPhone(student.getPhone());
        response.setGender(student.getGender());
        response.setBatchYear(student.getBatchYear());
        
        if (student.getDepartment() != null) {
            response.setDepartmentName(student.getDepartment().getDepartmentName());
        }
        
        if (student.getSemester() != null) {
            response.setSemesterName(student.getSemester().getSemesterName().name() + " " + student.getSemester().getYear());
        }
        
        response.setIsActive(student.getIsActive());

        return response;
    }
}
