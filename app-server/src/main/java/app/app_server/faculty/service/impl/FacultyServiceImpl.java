package app.app_server.faculty.service.impl;

import app.app_server.auth.model.Role;
import app.app_server.auth.model.Users;
import app.app_server.auth.repository.UserRepo;
import app.app_server.common.PageResponse;
import app.app_server.common.exception.BusinessValidationException;
import app.app_server.common.exception.DuplicateResourceException;
import app.app_server.common.exception.ResourceNotFoundException;
import app.app_server.department.model.Department;
import app.app_server.department.repository.DepartmentRepository;
import app.app_server.faculty.dto.request.FacultyCreateRequest;
import app.app_server.faculty.dto.request.FacultyUpdateRequest;
import app.app_server.faculty.dto.response.FacultyListResponse;
import app.app_server.faculty.dto.response.FacultyResponse;
import app.app_server.faculty.entity.Faculty;
import app.app_server.faculty.enums.Designation;
import app.app_server.faculty.enums.EmploymentType;
import app.app_server.faculty.mapper.FacultyMapper;
import app.app_server.faculty.repository.FacultyRepository;
import app.app_server.faculty.service.FacultyService;
import app.app_server.faculty.specification.FacultySpecification;
import app.app_server.faculty.util.FacultyCodeGenerator;
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
public class FacultyServiceImpl implements FacultyService {

    private final FacultyRepository facultyRepository;
    private final DepartmentRepository departmentRepository;
    private final UserRepo userRepo;
    private final FacultyMapper facultyMapper;
    private final FacultyCodeGenerator facultyCodeGenerator;
    private final PasswordEncoder passwordEncoder;

    @Value("${app.default.faculty.password:Faculty@123}")
    private String defaultFacultyPassword;

    @Override
    @Transactional
    public FacultyResponse enrollFaculty(FacultyCreateRequest request) {
        log.info("Enrolling new faculty with email: {}", request.getEmail());

        // Validate uniqueness on Faculty table
        if (facultyRepository.existsByEmail(request.getEmail())) {
            throw new DuplicateResourceException("Email already exists");
        }
        if (facultyRepository.existsByPhone(request.getPhone())) {
            throw new DuplicateResourceException("Phone number already exists");
        }
        if (facultyRepository.existsByEmployeeId(request.getEmployeeId())) {
            throw new DuplicateResourceException("Employee ID already exists");
        }

        // Validate uniqueness on User table (Prevent duplicate username creation)
        if (userRepo.findByUserName(request.getEmail()) != null) {
            throw new DuplicateResourceException("Username (email) already exists in the authentication system");
        }

        // Validate department
        Department department = departmentRepository.findById(request.getDepartmentId())
                .orElseThrow(() -> new ResourceNotFoundException("Department not found with id: " + request.getDepartmentId()));

        // Validate joining date (cannot be future date)
        if (request.getJoiningDate().isAfter(LocalDate.now())) {
            throw new BusinessValidationException("Joining date cannot be a future date");
        }

        // Map request to entity
        Faculty faculty = facultyMapper.toEntity(request);
        faculty.setDepartment(department);

        // Save initially to generate the database ID
        faculty = facultyRepository.save(faculty);

        // Generate and set Faculty Code
        String facultyCode = facultyCodeGenerator.generateFacultyCode(department.getDepartmentCode(), faculty.getId());
        faculty.setFacultyCode(facultyCode);

        // Create associated User Account
        Users user = new Users();
        user.setFirstName(faculty.getFirstName());
        user.setLastName(faculty.getLastName());
        user.setUserName(faculty.getEmail());
        user.setUserPassword(passwordEncoder.encode(defaultFacultyPassword));
        user.setRole(Role.FACULTY);
        user.setIsActive(true);

        faculty.setUser(user);

        // Save again to persist facultyCode and cascade user creation
        faculty = facultyRepository.save(faculty);

        log.info("Successfully enrolled faculty with code: {}", faculty.getFacultyCode());
        return facultyMapper.toResponse(faculty);
    }

    @Override
    @Transactional
    public FacultyResponse updateFaculty(Integer id, FacultyUpdateRequest request) {
        log.info("Updating faculty with id: {}", id);

        Faculty faculty = facultyRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Faculty not found with id: " + id));

        // Validate uniqueness checks for updated fields
        if (request.getEmail() != null && facultyRepository.existsByEmailAndIdNot(request.getEmail(), id)) {
            throw new DuplicateResourceException("Email already exists");
        }
        if (request.getEmail() != null && !faculty.getEmail().equals(request.getEmail())) {
            if (userRepo.findByUserName(request.getEmail()) != null) {
                throw new DuplicateResourceException("Username (email) already exists in the authentication system");
            }
        }
        if (request.getPhone() != null && facultyRepository.existsByPhoneAndIdNot(request.getPhone(), id)) {
            throw new DuplicateResourceException("Phone number already exists");
        }

        // Sync changes to User details if name or email or isActive updates
        if (faculty.getUser() != null) {
            Users user = faculty.getUser();
            if (request.getFirstName() != null) {
                user.setFirstName(request.getFirstName());
            }
            if (request.getLastName() != null) {
                user.setLastName(request.getLastName());
            }
            if (request.getEmail() != null) {
                user.setUserName(request.getEmail());
            }
            if (request.getIsActive() != null) {
                user.setIsActive(request.getIsActive());
            }
        }

        // Apply fields mapping update
        facultyMapper.updateEntity(request, faculty);

        faculty = facultyRepository.save(faculty);
        return facultyMapper.toResponse(faculty);
    }

    @Override
    @Transactional(readOnly = true)
    public FacultyResponse getFacultyById(Integer id) {
        Faculty faculty = facultyRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Faculty not found with id: " + id));
        return facultyMapper.toResponse(faculty);
    }

    @Override
    @Transactional(readOnly = true)
    public FacultyResponse getFacultyByFacultyCode(String facultyCode) {
        Faculty faculty = facultyRepository.findByFacultyCode(facultyCode)
                .orElseThrow(() -> new ResourceNotFoundException("Faculty not found with facultyCode: " + facultyCode));
        return facultyMapper.toResponse(faculty);
    }

    @Override
    @Transactional(readOnly = true)
    public PageResponse<FacultyListResponse> getAllFaculties(
            String search,
            Integer departmentId,
            Designation designation,
            EmploymentType employmentType,
            Boolean isActive,
            int page,
            int size,
            String sortBy,
            String sortDirection
    ) {
        Sort sort = sortDirection.equalsIgnoreCase(Sort.Direction.ASC.name())
                ? Sort.by(sortBy).ascending()
                : Sort.by(sortBy).descending();

        Pageable pageable = PageRequest.of(page, size, sort);
        Specification<Faculty> spec = FacultySpecification.getFilterSpecification(
                search, departmentId, designation, employmentType, isActive
        );

        Page<Faculty> facultyPage = facultyRepository.findAll(spec, pageable);

        List<FacultyListResponse> content = facultyPage.getContent().stream()
                .map(facultyMapper::toListResponse)
                .collect(Collectors.toList());

        return PageResponse.<FacultyListResponse>builder()
                .content(content)
                .pageNo(facultyPage.getNumber())
                .pageSize(facultyPage.getSize())
                .totalElements(facultyPage.getTotalElements())
                .totalPages(facultyPage.getTotalPages())
                .last(facultyPage.isLast())
                .build();
    }

    @Override
    @Transactional
    public void softDeleteFaculty(Integer id) {
        log.info("Soft deleting faculty with id: {}", id);

        Faculty faculty = facultyRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Faculty not found with id: " + id));

        faculty.setIsActive(false);
        if (faculty.getUser() != null) {
            faculty.getUser().setIsActive(false);
        }

        facultyRepository.save(faculty);
        log.info("Successfully soft deleted faculty with id: {}", id);
    }
}
