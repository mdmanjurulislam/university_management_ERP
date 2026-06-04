package app.app_server.semester.model;

import app.app_server.common.base.model.BaseEntity;
import app.app_server.semester.enums.SemesterName;
import jakarta.persistence.*;
import lombok.Data;
import lombok.EqualsAndHashCode;

import java.time.LocalDate;

@Entity
@Data
@EqualsAndHashCode(callSuper = true)
@Table(name = "T_Semesters", schema = "seu", indexes = {
        @Index(name = "idx_semester_code", columnList = "semester_code", unique = true),
        @Index(name = "idx_semester_year", columnList = "year")
})
public class Semester extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(name = "semester_code", unique = true, nullable = false, length = 50)
    private String semesterCode;

    @Enumerated(EnumType.STRING)
    @Column(name = "semester_name", nullable = false, length = 20)
    private SemesterName semesterName;

    @Column(name = "year", nullable = false)
    private Integer year;

    @Column(name = "start_date", nullable = false)
    private LocalDate startDate;

    @Column(name = "end_date", nullable = false)
    private LocalDate endDate;

    @Column(name = "registration_start_date", nullable = false)
    private LocalDate registrationStartDate;

    @Column(name = "registration_end_date", nullable = false)
    private LocalDate registrationEndDate;

    @Column(name = "result_publish_date")
    private LocalDate resultPublishDate;

    @Column(name = "is_current_semester", nullable = false)
    private Boolean isCurrentSemester = false;
}
