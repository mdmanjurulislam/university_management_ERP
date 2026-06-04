package app.app_server.semester.service.impl;

import app.app_server.common.CommonResponse;
import app.app_server.common.PageResponse;
import app.app_server.common.exception.DuplicateResourceException;
import app.app_server.common.exception.ResourceNotFoundException;
import app.app_server.common.exception.ValidationException;
import app.app_server.semester.dto.request.SemesterCreateRequest;
import app.app_server.semester.dto.request.SemesterUpdateRequest;
import app.app_server.semester.dto.response.SemesterResponse;
import app.app_server.semester.enums.SemesterName;
import app.app_server.semester.mapper.SemesterMapper;
import app.app_server.semester.model.Semester;
import app.app_server.semester.repository.SemesterRepository;
import app.app_server.semester.service.SemesterService;
import app.app_server.semester.specification.SemesterSpecification;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@Transactional
public class SemesterServiceImpl implements SemesterService {

    @Autowired
    private SemesterRepository semesterRepository;

    @Autowired
    private SemesterMapper semesterMapper;

    @Override
    public CommonResponse<SemesterResponse> createSemester(SemesterCreateRequest request) {
        validateDates(request.getStartDate(), request.getEndDate(), request.getRegistrationStartDate(), request.getRegistrationEndDate());
        validateYear(request.getYear());

        if (semesterRepository.existsBySemesterCode(request.getSemesterCode())) {
            throw new DuplicateResourceException("Semester code '" + request.getSemesterCode() + "' already exists");
        }

        handleCurrentSemester(request.getIsCurrentSemester());

        Semester semester = semesterMapper.toEntity(request);
        Semester savedSemester = semesterRepository.save(semester);

        return CommonResponse.<SemesterResponse>builder()
                .message("Semester created successfully")
                .response(semesterMapper.toResponseDTO(savedSemester))
                .code(200)
                .build();
    }

    @Override
    public CommonResponse<SemesterResponse> updateSemester(Integer id, SemesterUpdateRequest request) {
        validateDates(request.getStartDate(), request.getEndDate(), request.getRegistrationStartDate(), request.getRegistrationEndDate());
        validateYear(request.getYear());

        Semester existingSemester = semesterRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Semester with ID " + id + " not found"));

        if (!existingSemester.getSemesterCode().equals(request.getSemesterCode()) &&
            semesterRepository.existsBySemesterCode(request.getSemesterCode())) {
            throw new DuplicateResourceException("Semester code '" + request.getSemesterCode() + "' already exists");
        }

        if (Boolean.TRUE.equals(request.getIsCurrentSemester()) && !Boolean.TRUE.equals(existingSemester.getIsCurrentSemester())) {
            handleCurrentSemester(true);
        }

        semesterMapper.updateEntity(existingSemester, request);
        Semester updatedSemester = semesterRepository.save(existingSemester);

        return CommonResponse.<SemesterResponse>builder()
                .message("Semester updated successfully")
                .response(semesterMapper.toResponseDTO(updatedSemester))
                .code(200)
                .build();
    }

    @Override
    @Transactional(readOnly = true)
    public CommonResponse<SemesterResponse> getSemesterById(Integer id) {
        Semester semester = semesterRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Semester with ID " + id + " not found"));

        return CommonResponse.<SemesterResponse>builder()
                .message("Semester retrieved successfully")
                .response(semesterMapper.toResponseDTO(semester))
                .code(200)
                .build();
    }

    @Override
    @Transactional(readOnly = true)
    public CommonResponse<List<SemesterResponse>> getAllSemesters() {
        List<SemesterResponse> semesters = semesterRepository.findAll().stream()
                .map(semesterMapper::toResponseDTO)
                .collect(Collectors.toList());

        return CommonResponse.<List<SemesterResponse>>builder()
                .message("Semesters retrieved successfully")
                .response(semesters)
                .code(200)
                .build();
    }

    @Override
    @Transactional(readOnly = true)
    public CommonResponse<PageResponse<SemesterResponse>> getSemestersPaginated(
            int page, int size, String sortBy, String sortDir,
            String semesterCode, SemesterName semesterName, Integer year,
            Boolean isCurrentSemester, Boolean isActive) {

        Sort sort = sortDir.equalsIgnoreCase(Sort.Direction.ASC.name()) ? Sort.by(sortBy).ascending()
                : Sort.by(sortBy).descending();

        Pageable pageable = PageRequest.of(page, size, sort);
        Specification<Semester> spec = SemesterSpecification.getSemesters(semesterCode, semesterName, year, isCurrentSemester, isActive);

        Page<Semester> semesterPage = semesterRepository.findAll(spec, pageable);
        List<SemesterResponse> content = semesterPage.getContent().stream()
                .map(semesterMapper::toResponseDTO)
                .collect(Collectors.toList());

        PageResponse<SemesterResponse> pageResponse = PageResponse.<SemesterResponse>builder()
                .content(content)
                .pageNo(semesterPage.getNumber())
                .pageSize(semesterPage.getSize())
                .totalElements(semesterPage.getTotalElements())
                .totalPages(semesterPage.getTotalPages())
                .last(semesterPage.isLast())
                .build();

        return CommonResponse.<PageResponse<SemesterResponse>>builder()
                .message("Paginated semesters retrieved successfully")
                .response(pageResponse)
                .code(200)
                .build();
    }

    @Override
    public CommonResponse<String> deleteSemester(Integer id) {
        Semester semester = semesterRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Semester with ID " + id + " not found"));

        semester.setIsActive(false);
        if (Boolean.TRUE.equals(semester.getIsCurrentSemester())) {
            semester.setIsCurrentSemester(false);
        }
        semesterRepository.save(semester);

        return CommonResponse.<String>builder()
                .message("Semester deactivated successfully")
                .response("Semester ID " + id + " soft deleted.")
                .code(200)
                .build();
    }

    private void validateDates(java.time.LocalDate startDate, java.time.LocalDate endDate,
                               java.time.LocalDate regStartDate, java.time.LocalDate regEndDate) {
        if (startDate != null && endDate != null && startDate.isAfter(endDate)) {
            throw new ValidationException("Start date cannot be after end date");
        }
        if (regStartDate != null && regEndDate != null && regStartDate.isAfter(regEndDate)) {
            throw new ValidationException("Registration start date cannot be after registration end date");
        }
    }

    private void validateYear(Integer year) {
        if (year != null && (year < 2000 || year > 2100)) {
            throw new ValidationException("Year must be between 2000 and 2100");
        }
    }

    private void handleCurrentSemester(Boolean isCurrent) {
        if (Boolean.TRUE.equals(isCurrent)) {
            Optional<Semester> currentSemester = semesterRepository.findByIsCurrentSemesterTrue();
            if (currentSemester.isPresent()) {
                Semester prev = currentSemester.get();
                prev.setIsCurrentSemester(false);
                semesterRepository.save(prev);
            }
        }
    }
}
