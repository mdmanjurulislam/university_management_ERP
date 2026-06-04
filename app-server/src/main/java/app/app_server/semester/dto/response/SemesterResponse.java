package app.app_server.semester.dto.response;

import app.app_server.auth.dto.response.UserSummaryDTO;
import app.app_server.semester.enums.SemesterName;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class SemesterResponse {
    
    private Integer id;
    private String semesterCode;
    private SemesterName semesterName;
    private Integer year;
    private LocalDate startDate;
    private LocalDate endDate;
    private LocalDate registrationStartDate;
    private LocalDate registrationEndDate;
    private LocalDate resultPublishDate;
    private Boolean isCurrentSemester;
    
    private Boolean isActive;
    private UserSummaryDTO createdBy;
    private LocalDateTime createdAt;
    private UserSummaryDTO updatedBy;
    private LocalDateTime updatedAt;
}
