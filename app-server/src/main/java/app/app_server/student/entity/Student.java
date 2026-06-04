package app.app_server.student.entity;

import app.app_server.auth.model.Users;
import app.app_server.common.base.model.BaseEntity;
import app.app_server.department.model.Department;
import app.app_server.semester.model.Semester;
import app.app_server.student.enums.Gender;
import jakarta.persistence.*;
import lombok.Data;
import lombok.EqualsAndHashCode;

import java.time.LocalDate;

@Entity
@Data
@EqualsAndHashCode(callSuper = true)
@Table(name = "T_Students", schema = "seu", indexes = {
        @Index(name = "idx_student_student_id", columnList = "student_id", unique = true),
        @Index(name = "idx_student_email", columnList = "email", unique = true),
        @Index(name = "idx_student_phone", columnList = "phone", unique = true)
})
public class Student extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "student_seq")
    @SequenceGenerator(name = "student_seq", sequenceName = "student_sequence", initialValue = 1000, allocationSize = 1)
    private Integer id;

    @Column(name = "student_id", unique = true, length = 50)
    private String studentId;

    @Column(name = "full_name", nullable = false, length = 100)
    private String fullName;

    @Column(name = "email", unique = true, nullable = false, length = 100)
    private String email;

    @Column(name = "phone", unique = true, nullable = false, length = 20)
    private String phone;

    @Enumerated(EnumType.STRING)
    @Column(name = "gender", nullable = false, length = 20)
    private Gender gender;

    @Column(name = "blood_group", length = 20)
    private String bloodGroup;

    @Column(name = "date_of_birth", nullable = false)
    private LocalDate dateOfBirth;

    @Column(name = "admission_date", nullable = false)
    private LocalDate admissionDate;

    @Column(name = "address", length = 500)
    private String address;

    @Column(name = "profile_image")
    private String profileImage;

    @Column(name = "batch_year", nullable = false)
    private Integer batchYear;

    @Column(name = "guardian_name", length = 100)
    private String guardianName;

    @Column(name = "guardian_phone", length = 20)
    private String guardianPhone;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "department_id", nullable = false)
    private Department department;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "semester_id", nullable = false)
    private Semester semester;

    @OneToOne(fetch = FetchType.LAZY, cascade = CascadeType.ALL)
    @JoinColumn(name = "user_id")
    private Users user;
}
