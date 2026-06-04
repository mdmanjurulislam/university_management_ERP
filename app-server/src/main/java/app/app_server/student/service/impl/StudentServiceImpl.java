package app.app_server.student.service.impl;

import app.app_server.auth.model.Role;
import app.app_server.auth.model.Users;
import app.app_server.common.PageResponse;
import app.app_server.common.exception.DuplicateResourceException;
import app.app_server.common.exception.ResourceNotFoundException;
import app.app_server.common.exception.ValidationException;
import app.app_server.department.model.Department;
import app.app_server.department.repository.DepartmentRepository;
import app.app_server.semester.model.Semester;
import app.app_server.semester.repository.SemesterRepository;
import app.app_server.student.dto.request.StudentCreateRequest;
import app.app_server.student.dto.request.StudentUpdateRequest;
import app.app_server.student.dto.response.StudentListResponse;
import app.app_server.student.dto.response.StudentResponse;
import app.app_server.student.entity.Student;
import app.app_server.student.mapper.StudentMapper;
import app.app_server.student.repository.StudentRepository;
import app.app_server.student.service.StudentService;
import app.app_server.student.specification.StudentSpecification;
import app.app_server.student.util.StudentIdGenerator;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class StudentServiceImpl implements StudentService {

    private final StudentRepository studentRepository;
    private final DepartmentRepository departmentRepository;
    private final SemesterRepository semesterRepository;
    private final StudentMapper studentMapper;
    private final StudentIdGenerator studentIdGenerator;
    private final PasswordEncoder passwordEncoder;

    @Value("${app.default.student.password:Student@123}")
    private String defaultStudentPassword;


    @Override
    @Transactional
    public StudentResponse enrollStudent(StudentCreateRequest request) {
        log.info("Enrolling new student with email: {}", request.getEmail());

        // Validate uniqueness
        if (studentRepository.existsByEmail(request.getEmail())) {
            throw new DuplicateResourceException("Email already exists");
        }
        if (studentRepository.existsByPhone(request.getPhone())) {
            throw new DuplicateResourceException("Phone number already exists");
        }

        // Fetch relationships
        Department department = departmentRepository.findById(request.getDepartmentId())
                .orElseThrow(() -> new ResourceNotFoundException("Department not found with id: " + request.getDepartmentId()));

        Semester semester = semesterRepository.findById(request.getSemesterId())
                .orElseThrow(() -> new ResourceNotFoundException("Semester not found with id: " + request.getSemesterId()));

        // Validate semester admission period
        LocalDate currentDate = LocalDate.now();
        if (currentDate.isBefore(semester.getRegistrationStartDate()) || currentDate.isAfter(semester.getRegistrationEndDate())) {
            throw new ValidationException(String.format("%s %d semester admission is currently closed.", semester.getSemesterName(), semester.getYear()));
        }

        // Map and save initially to get database ID
        Student student = studentMapper.toEntity(request);
        student.setDepartment(department);
        student.setSemester(semester);
        
        student = studentRepository.save(student);

        // Generate Student ID
        String generatedStudentId = studentIdGenerator.generateStudentId(
                semester.getYear(),
                department.getDepartmentCode(),
                student.getId()
        );
        student.setStudentId(generatedStudentId);

        // Auto Create User Account
        Users user = new Users();
        user.setFirstName(student.getFullName().split(" ")[0]);
        user.setLastName(student.getFullName().contains(" ") ? student.getFullName().substring(student.getFullName().indexOf(" ") + 1) : "");
        user.setUserName(generatedStudentId);
        user.setUserPassword(passwordEncoder.encode(defaultStudentPassword));
        user.setRole(Role.STUDENT);
        user.setIsActive(true);

        student.setUser(user);

        // Update student with studentId and user
        student = studentRepository.save(student);

        log.info("Successfully enrolled student with ID: {}", student.getStudentId());
        return studentMapper.toResponse(student);
    }

    @Override
    @Transactional
    public StudentResponse updateStudent(Integer id, StudentUpdateRequest request) {
        log.info("Updating student with id: {}", id);

        Student student = studentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Student not found with id: " + id));

        // Validate uniqueness if updated
        if (request.getEmail() != null && studentRepository.existsByEmailAndIdNot(request.getEmail(), id)) {
            throw new DuplicateResourceException("Email already exists");
        }
        if (request.getPhone() != null && studentRepository.existsByPhoneAndIdNot(request.getPhone(), id)) {
            throw new DuplicateResourceException("Phone number already exists");
        }

        studentMapper.updateEntity(request, student);

        // Update associated user status if student isActive changes
        if (request.getIsActive() != null && student.getUser() != null) {
            student.getUser().setIsActive(request.getIsActive());
        }

        student = studentRepository.save(student);
        return studentMapper.toResponse(student);
    }

    @Override
    public StudentResponse getStudentById(Integer id) {
        Student student = studentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Student not found with id: " + id));
        return studentMapper.toResponse(student);
    }

    @Override
    public StudentResponse getStudentByStudentId(String studentId) {
        Student student = studentRepository.findByStudentId(studentId)
                .orElseThrow(() -> new ResourceNotFoundException("Student not found with studentId: " + studentId));
        return studentMapper.toResponse(student);
    }

    @Override
    public PageResponse<StudentListResponse> getAllStudents(
            String search, Integer departmentId, Integer semesterId,
            Integer batchYear, Boolean isActive,
            int page, int size, String sortBy, String sortDirection) {

        Sort sort = sortDirection.equalsIgnoreCase(Sort.Direction.ASC.name())
                ? Sort.by(sortBy).ascending()
                : Sort.by(sortBy).descending();

        Pageable pageable = PageRequest.of(page, size, sort);
        Specification<Student> spec = StudentSpecification.getFilterSpecification(search, departmentId, semesterId, batchYear, isActive);

        Page<Student> studentPage = studentRepository.findAll(spec, pageable);

        List<StudentListResponse> content = studentPage.getContent().stream()
                .map(studentMapper::toListResponse)
                .collect(Collectors.toList());

        return PageResponse.<StudentListResponse>builder()
                .content(content)
                .pageNo(studentPage.getNumber())
                .pageSize(studentPage.getSize())
                .totalElements(studentPage.getTotalElements())
                .totalPages(studentPage.getTotalPages())
                .last(studentPage.isLast())
                .build();
    }

    @Override
    @Transactional
    public void softDeleteStudent(Integer id) {
        log.info("Soft deleting student with id: {}", id);
        Student student = studentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Student not found with id: " + id));

        student.setIsActive(false);
        if (student.getUser() != null) {
            student.getUser().setIsActive(false);
        }

        studentRepository.save(student);
    }
}
