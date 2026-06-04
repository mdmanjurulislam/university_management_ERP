package app.app_server.profile.service.impl;

import app.app_server.auth.model.Users;
import app.app_server.auth.repository.UserRepo;
import app.app_server.common.exception.ResourceNotFoundException;
import app.app_server.faculty.entity.Faculty;
import app.app_server.faculty.repository.FacultyRepository;
import app.app_server.profile.dto.ProfileResponseDTO;
import app.app_server.profile.dto.ProfileUpdateRequestDTO;
import app.app_server.profile.dto.ChangePasswordRequestDTO;
import app.app_server.profile.service.ProfileService;
import app.app_server.student.entity.Student;
import app.app_server.student.repository.StudentRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.crypto.password.PasswordEncoder;
import app.app_server.common.exception.ValidationException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

@Service
@RequiredArgsConstructor
@Slf4j
public class ProfileServiceImpl implements ProfileService {

    private final UserRepo userRepo;
    private final StudentRepository studentRepository;
    private final FacultyRepository facultyRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    @Transactional(readOnly = true)
    public ProfileResponseDTO getProfile(String username) {
        log.info("Fetching profile details for user: {}", username);
        Users user = Optional.ofNullable(userRepo.findByUserName(username))
                .orElseThrow(() -> new ResourceNotFoundException("User not found with username: " + username));

        ProfileResponseDTO.ProfileResponseDTOBuilder builder = ProfileResponseDTO.builder()
                .id(user.getUserId())
                .username(user.getUserName())
                .role(user.getRole())
                .isActive(user.getIsActive());

        switch (user.getRole()) {
            case STUDENT:
                Student student = studentRepository.findByUserUserName(username)
                        .orElseThrow(() -> new ResourceNotFoundException("Student details not found for user: " + username));
                
                builder.fullName(student.getFullName())
                        .email(student.getEmail())
                        .phone(student.getPhone())
                        .gender(student.getGender() != null ? student.getGender().name() : null)
                        .dateOfBirth(student.getDateOfBirth())
                        .bloodGroup(student.getBloodGroup())
                        .address(student.getAddress())
                        .studentId(student.getStudentId())
                        .admissionDate(student.getAdmissionDate())
                        .guardianName(student.getGuardianName())
                        .guardianPhone(student.getGuardianPhone());
                
                if (student.getDepartment() != null) {
                    builder.department(student.getDepartment().getDepartmentCode());
                }
                if (student.getSemester() != null) {
                    builder.semester(student.getSemester().getSemesterName().name() + " " + student.getSemester().getYear());
                }
                break;

            case FACULTY:
                Faculty faculty = facultyRepository.findByUserUserName(username)
                        .orElseThrow(() -> new ResourceNotFoundException("Faculty details not found for user: " + username));

                builder.fullName(faculty.getFullName())
                        .email(faculty.getEmail())
                        .phone(faculty.getPhone())
                        .gender(faculty.getGender() != null ? faculty.getGender().name() : null)
                        .dateOfBirth(faculty.getDateOfBirth())
                        .bloodGroup(faculty.getBloodGroup())
                        .address(faculty.getAddress())
                        .facultyCode(faculty.getFacultyCode())
                        .employeeId(faculty.getEmployeeId())
                        .designation(faculty.getDesignation() != null ? faculty.getDesignation().name() : null)
                        .joiningDate(faculty.getJoiningDate())
                        .employmentType(faculty.getEmploymentType() != null ? faculty.getEmploymentType().name() : null)
                        .qualification(faculty.getHighestQualification())
                        .specialization(faculty.getSpecialization())
                        .officeRoom(faculty.getOfficeRoom());

                if (faculty.getDepartment() != null) {
                    builder.department(faculty.getDepartment().getDepartmentCode());
                }
                break;

            default: // ADMIN or USER
                builder.fullName(user.getFirstName() + " " + user.getLastName());
                break;
        }

        return builder.build();
    }

    @Override
    @Transactional
    public ProfileResponseDTO updateProfile(String username, ProfileUpdateRequestDTO dto) {
        log.info("Updating profile details for user: {}", username);
        Users user = Optional.ofNullable(userRepo.findByUserName(username))
                .orElseThrow(() -> new ResourceNotFoundException("User not found with username: " + username));

        // Sync first and last names in the User entity
        if (dto.getFullName() != null) {
            String name = dto.getFullName().trim();
            int firstSpace = name.indexOf(" ");
            if (firstSpace > 0) {
                user.setFirstName(name.substring(0, firstSpace));
                user.setLastName(name.substring(firstSpace + 1));
            } else {
                user.setFirstName(name);
                user.setLastName("");
            }
        }
        userRepo.save(user);

        switch (user.getRole()) {
            case STUDENT:
                Student student = studentRepository.findByUserUserName(username)
                        .orElseThrow(() -> new ResourceNotFoundException("Student details not found for user: " + username));

                student.setFullName(dto.getFullName());
                student.setPhone(dto.getPhone());
                if (dto.getGender() != null) {
                    student.setGender(app.app_server.student.enums.Gender.valueOf(dto.getGender().toUpperCase()));
                }
                student.setDateOfBirth(dto.getDateOfBirth());
                student.setBloodGroup(dto.getBloodGroup());
                student.setAddress(dto.getAddress());
                student.setGuardianName(dto.getGuardianName());
                student.setGuardianPhone(dto.getGuardianPhone());
                
                studentRepository.save(student);
                break;

            case FACULTY:
                Faculty faculty = facultyRepository.findByUserUserName(username)
                        .orElseThrow(() -> new ResourceNotFoundException("Faculty details not found for user: " + username));

                faculty.setFullName(dto.getFullName());
                // Faculty has individual firstName / lastName fields, sync them too
                if (dto.getFullName() != null) {
                    String name = dto.getFullName().trim();
                    int firstSpace = name.indexOf(" ");
                    if (firstSpace > 0) {
                        faculty.setFirstName(name.substring(0, firstSpace));
                        faculty.setLastName(name.substring(firstSpace + 1));
                    } else {
                        faculty.setFirstName(name);
                        faculty.setLastName("");
                    }
                }
                faculty.setPhone(dto.getPhone());
                if (dto.getGender() != null) {
                    faculty.setGender(app.app_server.faculty.enums.Gender.valueOf(dto.getGender().toUpperCase()));
                }
                faculty.setDateOfBirth(dto.getDateOfBirth());
                faculty.setBloodGroup(dto.getBloodGroup());
                faculty.setAddress(dto.getAddress());
                faculty.setHighestQualification(dto.getQualification());
                faculty.setSpecialization(dto.getSpecialization());
                if (dto.getOfficeRoom() != null) {
                    faculty.setOfficeRoom(dto.getOfficeRoom());
                }

                facultyRepository.save(faculty);
                break;

            default:
                // ADMIN has no extra details to update other than Users fields
                break;
        }

        return getProfile(username);
    }

    @Override
    @Transactional
    public void changePassword(String username, ChangePasswordRequestDTO dto) {
        log.info("Changing password for user: {}", username);
        Users user = Optional.ofNullable(userRepo.findByUserName(username))
                .orElseThrow(() -> new ResourceNotFoundException("User not found with username: " + username));

        // Verify old password
        if (!passwordEncoder.matches(dto.getOldPassword(), user.getUserPassword())) {
            throw new ValidationException("Incorrect current password");
        }

        // Update to new password
        user.setUserPassword(passwordEncoder.encode(dto.getNewPassword()));
        userRepo.save(user);
    }
}
