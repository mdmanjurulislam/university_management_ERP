package app.app_server.student.controller;

import app.app_server.common.CommonResponse;
import app.app_server.common.PageResponse;
import app.app_server.student.dto.request.StudentCreateRequest;
import app.app_server.student.dto.request.StudentUpdateRequest;
import app.app_server.student.dto.response.StudentListResponse;
import app.app_server.student.dto.response.StudentResponse;
import app.app_server.student.service.StudentService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/students")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class StudentController {

    private final StudentService studentService;

    /**
     * Enroll a new student.
     * 
     * Example Request Body:
     * {
     *   "fullName": "John Doe",
     *   "email": "johndoe@example.com",
     *   "phone": "+1234567890",
     *   "gender": "MALE",
     *   "bloodGroup": "O+",
     *   "dateOfBirth": "2000-01-01",
     *   "admissionDate": "2026-05-01",
     *   "address": "123 Main St",
     *   "batchYear": 2026,
     *   "guardianName": "Jane Doe",
     *   "guardianPhone": "+0987654321",
     *   "departmentId": 1,
     *   "semesterId": 1
     * }
     */
    @PostMapping("/enroll")
    @PreAuthorize("hasAuthority('ADMIN')")
    public ResponseEntity<CommonResponse<StudentResponse>> enrollStudent(@Valid @RequestBody StudentCreateRequest request) {
        StudentResponse response = studentService.enrollStudent(request);
        return new ResponseEntity<>(CommonResponse.<StudentResponse>builder()
                .message("Student enrolled successfully")
                .code(201)
                .response(response)
                .build(), HttpStatus.CREATED);
    }

    /**
     * Update an existing student's details.
     * 
     * Example Request Body:
     * {
     *   "phone": "+1987654321",
     *   "address": "456 New St",
     *   "isActive": true
     * }
     */
    @PutMapping("/{id}")
    @PreAuthorize("hasAnyAuthority('ADMIN', 'STUDENT')")
    public ResponseEntity<CommonResponse<StudentResponse>> updateStudent(
            @PathVariable Integer id,
            @Valid @RequestBody StudentUpdateRequest request) {
        StudentResponse response = studentService.updateStudent(id, request);
        return ResponseEntity.ok(CommonResponse.<StudentResponse>builder()
                .message("Student updated successfully")
                .code(200)
                .response(response)
                .build());
    }

    /**
     * Get a student by their database ID.
     * 
     * Example URL: /api/students/1000
     */
    @GetMapping("/{id}")
    @PreAuthorize("hasAnyAuthority('ADMIN', 'FACULTY', 'STUDENT')")
    public ResponseEntity<CommonResponse<StudentResponse>> getStudentById(@PathVariable Integer id) {
        StudentResponse response = studentService.getStudentById(id);
        return ResponseEntity.ok(CommonResponse.<StudentResponse>builder()
                .message("Student fetched successfully")
                .code(200)
                .response(response)
                .build());
    }

    /**
     * Get a student by their generated Student ID.
     * 
     * Example URL: /api/students/student-id/2026CSE1001
     */
    @GetMapping("/student-id/{studentId}")
    @PreAuthorize("hasAnyAuthority('ADMIN', 'FACULTY', 'STUDENT')")
    public ResponseEntity<CommonResponse<StudentResponse>> getStudentByStudentId(@PathVariable String studentId) {
        StudentResponse response = studentService.getStudentByStudentId(studentId);
        return ResponseEntity.ok(CommonResponse.<StudentResponse>builder()
                .message("Student fetched successfully")
                .code(200)
                .response(response)
                .build());
    }

    /**
     * Get a paginated list of students with optional filtering and searching.
     * 
     * Example URL: /api/students?search=John&departmentId=1&page=0&size=10&sortBy=id&sortDirection=DESC
     */
    @GetMapping("/all")
    @PreAuthorize("hasAnyAuthority('ADMIN', 'FACULTY')")
    public ResponseEntity<CommonResponse<PageResponse<StudentListResponse>>> getAllStudents(
            @RequestParam(required = false) String search,
            @RequestParam(required = false) Integer departmentId,
            @RequestParam(required = false) Integer semesterId,
            @RequestParam(required = false) Integer batchYear,
            @RequestParam(required = false) Boolean isActive,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "id") String sortBy,
            @RequestParam(defaultValue = "DESC") String sortDirection) {

        PageResponse<StudentListResponse> response = studentService.getAllStudents(
                search, departmentId, semesterId, batchYear, isActive, page, size, sortBy, sortDirection);

        return ResponseEntity.ok(CommonResponse.<PageResponse<StudentListResponse>>builder()
                .message("Students fetched successfully")
                .code(200)
                .response(response)
                .build());
    }

    /**
     * Soft delete a student by their database ID.
     * Sets the isActive flag to false for both the Student and their linked User account.
     * 
     * Example URL: /api/students/1000
     */
    @DeleteMapping("/{id}")
    @PreAuthorize("hasAuthority('ADMIN')")
    public ResponseEntity<CommonResponse<Void>> softDeleteStudent(@PathVariable Integer id) {
        studentService.softDeleteStudent(id);
        return ResponseEntity.ok(CommonResponse.<Void>builder()
                .message("Student deleted successfully")
                .code(200)
                .build());
    }
}
