package app.app_server.semester.mapper;

import app.app_server.auth.dto.response.UserSummaryDTO;
import app.app_server.auth.repository.UserRepo;
import app.app_server.semester.dto.request.SemesterCreateRequest;
import app.app_server.semester.dto.request.SemesterUpdateRequest;
import app.app_server.semester.dto.response.SemesterResponse;
import app.app_server.semester.model.Semester;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

@Component
public class SemesterMapper {

    @Autowired
    private UserRepo userRepo;

    public SemesterResponse toResponseDTO(Semester semester) {
        if (semester == null) {
            return null;
        }

        SemesterResponse dto = new SemesterResponse();
        dto.setId(semester.getId());
        dto.setSemesterCode(semester.getSemesterCode());
        dto.setSemesterName(semester.getSemesterName());
        dto.setYear(semester.getYear());
        dto.setStartDate(semester.getStartDate());
        dto.setEndDate(semester.getEndDate());
        dto.setRegistrationStartDate(semester.getRegistrationStartDate());
        dto.setRegistrationEndDate(semester.getRegistrationEndDate());
        dto.setResultPublishDate(semester.getResultPublishDate());
        dto.setIsCurrentSemester(semester.getIsCurrentSemester());

        dto.setIsActive(semester.getIsActive());
        dto.setCreatedBy(getUserSummary(semester.getCreatedBy()));
        dto.setCreatedAt(semester.getCreatedAt());
        dto.setUpdatedBy(getUserSummary(semester.getUpdatedBy()));
        dto.setUpdatedAt(semester.getUpdatedAt());

        return dto;
    }

    public Semester toEntity(SemesterCreateRequest dto) {
        if (dto == null) {
            return null;
        }

        Semester semester = new Semester();
        semester.setSemesterCode(dto.getSemesterCode());
        semester.setSemesterName(dto.getSemesterName());
        semester.setYear(dto.getYear());
        semester.setStartDate(dto.getStartDate());
        semester.setEndDate(dto.getEndDate());
        semester.setRegistrationStartDate(dto.getRegistrationStartDate());
        semester.setRegistrationEndDate(dto.getRegistrationEndDate());
        semester.setResultPublishDate(dto.getResultPublishDate());
        semester.setIsCurrentSemester(dto.getIsCurrentSemester() != null ? dto.getIsCurrentSemester() : false);
        if (dto.getIsActive() != null) {
            semester.setIsActive(dto.getIsActive());
        }
        
        return semester;
    }

    public void updateEntity(Semester semester, SemesterUpdateRequest dto) {
        if (dto == null) return;
        
        semester.setSemesterCode(dto.getSemesterCode());
        semester.setSemesterName(dto.getSemesterName());
        semester.setYear(dto.getYear());
        semester.setStartDate(dto.getStartDate());
        semester.setEndDate(dto.getEndDate());
        semester.setRegistrationStartDate(dto.getRegistrationStartDate());
        semester.setRegistrationEndDate(dto.getRegistrationEndDate());
        semester.setResultPublishDate(dto.getResultPublishDate());
        if (dto.getIsCurrentSemester() != null) {
            semester.setIsCurrentSemester(dto.getIsCurrentSemester());
        }
        if (dto.getIsActive() != null) {
            semester.setIsActive(dto.getIsActive());
        }
    }

    private UserSummaryDTO getUserSummary(Integer userId) {
        if (userId == null || userId == 0) return null;
        return userRepo.findById(userId)
                .map(u -> new UserSummaryDTO(u.getUserId(), u.getFirstName(), u.getLastName(), u.getUserName(), u.getRole()))
                .orElse(null);
    }
}
