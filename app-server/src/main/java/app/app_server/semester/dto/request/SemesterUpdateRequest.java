package app.app_server.semester.dto.request;

import app.app_server.semester.enums.SemesterName;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.FutureOrPresent;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class SemesterUpdateRequest {

    @NotBlank(message = "Semester code is required")
    private String semesterCode;

    @NotNull(message = "Semester name is required")
    private SemesterName semesterName;

    @NotNull(message = "Year is required")
    private Integer year;

    @NotNull(message = "Start date is required")
    private LocalDate startDate;

    @NotNull(message = "End date is required")
    private LocalDate endDate;

    @NotNull(message = "Registration start date is required")
    private LocalDate registrationStartDate;

    @NotNull(message = "Registration end date is required")
    private LocalDate registrationEndDate;

    private LocalDate resultPublishDate;

    private Boolean isCurrentSemester = false;

    private Boolean isActive;
}
