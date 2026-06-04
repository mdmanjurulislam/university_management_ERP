package app.app_server.faculty.entity;

import app.app_server.auth.model.Users;
import app.app_server.common.base.model.BaseEntity;
import app.app_server.department.model.Department;
import app.app_server.faculty.enums.Designation;
import app.app_server.faculty.enums.EmploymentType;
import app.app_server.faculty.enums.Gender;
import jakarta.persistence.*;
import lombok.Data;
import lombok.EqualsAndHashCode;

import java.time.LocalDate;

@Entity
@Data
@EqualsAndHashCode(callSuper = true)
@Table(name = "T_Faculties", schema = "seu", indexes = {
        @Index(name = "idx_faculty_faculty_code", columnList = "faculty_code", unique = true),
        @Index(name = "idx_faculty_employee_id", columnList = "employee_id", unique = true),
        @Index(name = "idx_faculty_email", columnList = "email", unique = true),
        @Index(name = "idx_faculty_phone", columnList = "phone", unique = true)
})
public class Faculty extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "faculty_seq")
    @SequenceGenerator(name = "faculty_seq", sequenceName = "faculty_sequence", initialValue = 1001, allocationSize = 1)
    private Integer id;

    @Column(name = "faculty_code", unique = true, length = 50)
    private String facultyCode;

    @Column(name = "first_name", nullable = false, length = 50)
    private String firstName;

    @Column(name = "last_name", nullable = false, length = 50)
    private String lastName;

    @Column(name = "full_name", nullable = false, length = 100)
    private String fullName;

    @Column(name = "email", unique = true, nullable = false, length = 100)
    private String email;

    @Column(name = "phone", unique = true, nullable = false, length = 20)
    private String phone;

    @Enumerated(EnumType.STRING)
    @Column(name = "gender", nullable = false, length = 20)
    private Gender gender;

    @Column(name = "date_of_birth", nullable = false)
    private LocalDate dateOfBirth;

    @Column(name = "blood_group", length = 20)
    private String bloodGroup;

    @Column(name = "employee_id", unique = true, nullable = false, length = 50)
    private String employeeId;

    @Enumerated(EnumType.STRING)
    @Column(name = "designation", nullable = false, length = 30)
    private Designation designation;

    @Column(name = "joining_date", nullable = false)
    private LocalDate joiningDate;

    @Enumerated(EnumType.STRING)
    @Column(name = "employment_type", nullable = false, length = 30)
    private EmploymentType employmentType;

    @Column(name = "highest_qualification", length = 100)
    private String highestQualification;

    @Column(name = "specialization", length = 200)
    private String specialization;

    @Column(name = "office_room", length = 50)
    private String officeRoom;

    @Column(name = "address", length = 500)
    private String address;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "department_id", nullable = false)
    private Department department;

    @OneToOne(fetch = FetchType.LAZY, cascade = CascadeType.ALL)
    @JoinColumn(name = "user_id")
    private Users user;
}
