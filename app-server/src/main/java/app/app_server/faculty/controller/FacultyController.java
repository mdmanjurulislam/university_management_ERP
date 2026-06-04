package app.app_server.faculty.controller;

import app.app_server.common.CommonResponse;
import app.app_server.common.PageResponse;
import app.app_server.faculty.dto.request.FacultyCreateRequest;
import app.app_server.faculty.dto.request.FacultyUpdateRequest;
import app.app_server.faculty.dto.response.FacultyListResponse;
import app.app_server.faculty.dto.response.FacultyResponse;
import app.app_server.faculty.enums.Designation;
import app.app_server.faculty.enums.EmploymentType;
import app.app_server.faculty.service.FacultyService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/faculties")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class FacultyController {

    private final FacultyService facultyService;

    /**
     * POSTMAN EXAMPLE: Enroll a new Faculty
     * 
     * 1. HTTP Method: POST
     * 2. URL: http://localhost:8085/api/faculties/enroll
     * 3. Headers:
     *    - Authorization: Bearer <ADMIN_JWT_TOKEN>
     *    - Content-Type: application/json
     * 4. Request Body (JSON):
     * {
     *   "firstName": "Jane",
     *   "lastName": "Smith",
     *   "email": "janesmith@seu.edu",
     *   "phone": "+1234567890",
     *   "gender": "FEMALE",
     *   "dateOfBirth": "1985-05-15",
     *   "bloodGroup": "A+",
     *   "employeeId": "EMP-885",
     *   "designation": "ASSISTANT_PROFESSOR",
     *   "joiningDate": "2026-06-01",
     *   "employmentType": "FULL_TIME",
     *   "highestQualification": "Ph.D. in Computer Science",
     *   "specialization": "Machine Learning",
     *   "officeRoom": "Room 501",
     *   "departmentId": 1
     * }
     * 
     * 5. Response Example (JSON):
     * {
     *   "message": "Faculty enrolled successfully",
     *   "code": 201,
     *   "response": {
     *     "id": 1001,
     *     "facultyCode": "CSE-FAC-1001",
     *     "firstName": "Jane",
     *     "lastName": "Smith",
     *     "fullName": "Jane Smith",
     *     "email": "janesmith@seu.edu",
     *     "phone": "+1234567890",
     *     "gender": "FEMALE",
     *     "dateOfBirth": "1985-05-15",
     *     "bloodGroup": "A+",
     *     "employeeId": "EMP-885",
     *     "designation": "ASSISTANT_PROFESSOR",
     *     "joiningDate": "2026-06-01",
     *     "employmentType": "FULL_TIME",
     *     "highestQualification": "Ph.D. in Computer Science",
     *     "specialization": "Machine Learning",
     *     "officeRoom": "Room 501",
     *     "department": {
     *       "id": 1,
     *       "departmentCode": "CSE",
     *       "departmentName": "Computer Science & Engineering",
     *       "isActive": true
     *     },
     *     "isActive": true
     *   }
     * }
     */
    @PostMapping("/enroll")
    @PreAuthorize("hasAuthority('ADMIN')")
    public ResponseEntity<CommonResponse<FacultyResponse>> enrollFaculty(@Valid @RequestBody FacultyCreateRequest request) {
        FacultyResponse response = facultyService.enrollFaculty(request);
        return new ResponseEntity<>(CommonResponse.<FacultyResponse>builder()
                .message("Faculty enrolled successfully")
                .code(201)
                .response(response)
                .build(), HttpStatus.CREATED);
    }

    /**
     * POSTMAN EXAMPLE: Update Faculty details
     * 
     * 1. HTTP Method: PUT
     * 2. URL: http://localhost:8085/api/faculties/1001
     * 3. Headers:
     *    - Authorization: Bearer <ADMIN_JWT_TOKEN>
     *    - Content-Type: application/json
     * 4. Request Body (JSON) [Supports partial updates]:
     * {
     *   "designation": "ASSOCIATE_PROFESSOR",
     *   "officeRoom": "Room 505",
     *   "phone": "+1987654321"
     * }
     * 
     * 5. Response Example (JSON):
     * {
     *   "message": "Faculty updated successfully",
     *   "code": 200,
     *   "response": {
     *     "id": 1001,
     *     "facultyCode": "CSE-FAC-1001",
     *     "firstName": "Jane",
     *     "lastName": "Smith",
     *     "fullName": "Jane Smith",
     *     "email": "janesmith@seu.edu",
     *     "phone": "+1987654321",
     *     "gender": "FEMALE",
     *     "dateOfBirth": "1985-05-15",
     *     "bloodGroup": "A+",
     *     "employeeId": "EMP-885",
     *     "designation": "ASSOCIATE_PROFESSOR",
     *     "joiningDate": "2026-06-01",
     *     "employmentType": "FULL_TIME",
     *     "highestQualification": "Ph.D. in Computer Science",
     *     "specialization": "Machine Learning",
     *     "officeRoom": "Room 505",
     *     "isActive": true
     *   }
     * }
     */
    @PutMapping("/{id}")
    @PreAuthorize("hasAuthority('ADMIN')")
    public ResponseEntity<CommonResponse<FacultyResponse>> updateFaculty(
            @PathVariable Integer id,
            @Valid @RequestBody FacultyUpdateRequest request) {
        FacultyResponse response = facultyService.updateFaculty(id, request);
        return ResponseEntity.ok(CommonResponse.<FacultyResponse>builder()
                .message("Faculty updated successfully")
                .code(200)
                .response(response)
                .build());
    }

    /**
     * POSTMAN EXAMPLE: Get Faculty by Database ID
     * 
     * 1. HTTP Method: GET
     * 2. URL: http://localhost:8085/api/faculties/1001
     * 3. Headers:
     *    - Authorization: Bearer <ADMIN_OR_FACULTY_JWT_TOKEN>
     * 
     * 4. Response Example (JSON):
     * {
     *   "message": "Faculty fetched successfully",
     *   "code": 200,
     *   "response": {
     *     "id": 1001,
     *     "facultyCode": "CSE-FAC-1001",
     *     "firstName": "Jane",
     *     "lastName": "Smith",
     *     "fullName": "Jane Smith",
     *     "email": "janesmith@seu.edu",
     *     "phone": "+1987654321",
     *     "isActive": true
     *   }
     * }
     */
    @GetMapping("/{id}")
    @PreAuthorize("hasAnyAuthority('ADMIN', 'FACULTY')")
    public ResponseEntity<CommonResponse<FacultyResponse>> getFacultyById(
            @PathVariable Integer id,
            Authentication authentication) {
        FacultyResponse response = facultyService.getFacultyById(id);
        
        // Check if user is FACULTY and tries to view another faculty's profile
        if (authentication != null && authentication.getAuthorities().stream()
                .anyMatch(a -> a.getAuthority().equals("FACULTY"))) {
            if (!response.getEmail().equalsIgnoreCase(authentication.getName())) {
                return new ResponseEntity<>(CommonResponse.<FacultyResponse>builder()
                        .message("Access denied: You can only view your own profile.")
                        .code(403)
                        .build(), HttpStatus.FORBIDDEN);
            }
        }
        
        return ResponseEntity.ok(CommonResponse.<FacultyResponse>builder()
                .message("Faculty fetched successfully")
                .code(200)
                .response(response)
                .build());
    }

    /**
     * POSTMAN EXAMPLE: Get Faculty by Faculty Code
     * 
     * 1. HTTP Method: GET
     * 2. URL: http://localhost:8085/api/faculties/code/CSE-FAC-1001
     * 3. Headers:
     *    - Authorization: Bearer <ADMIN_OR_FACULTY_JWT_TOKEN>
     * 
     * 4. Response Example (JSON):
     * {
     *   "message": "Faculty fetched successfully",
     *   "code": 200,
     *   "response": {
     *     "id": 1001,
     *     "facultyCode": "CSE-FAC-1001",
     *     "fullName": "Jane Smith",
     *     "email": "janesmith@seu.edu"
     *   }
     * }
     */
    @GetMapping("/code/{facultyCode}")
    @PreAuthorize("hasAnyAuthority('ADMIN', 'FACULTY')")
    public ResponseEntity<CommonResponse<FacultyResponse>> getFacultyByFacultyCode(
            @PathVariable String facultyCode,
            Authentication authentication) {
        FacultyResponse response = facultyService.getFacultyByFacultyCode(facultyCode);

        // Check if user is FACULTY and tries to view another faculty's profile
        if (authentication != null && authentication.getAuthorities().stream()
                .anyMatch(a -> a.getAuthority().equals("FACULTY"))) {
            if (!response.getEmail().equalsIgnoreCase(authentication.getName())) {
                return new ResponseEntity<>(CommonResponse.<FacultyResponse>builder()
                        .message("Access denied: You can only view your own profile.")
                        .code(403)
                        .build(), HttpStatus.FORBIDDEN);
            }
        }

        return ResponseEntity.ok(CommonResponse.<FacultyResponse>builder()
                .message("Faculty fetched successfully")
                .code(200)
                .response(response)
                .build());
    }

    /**
     * POSTMAN EXAMPLE: Get all faculties with Pagination, Sorting, Search, and Filtering
     * 
     * 1. HTTP Method: GET
     * 2. URL: http://localhost:8085/api/faculties?search=Jane&departmentId=1&designation=ASSOCIATE_PROFESSOR&page=0&size=10&sortBy=id&sortDirection=DESC
     * 3. Headers:
     *    - Authorization: Bearer <ADMIN_JWT_TOKEN>
     * 
     * 4. Response Example (JSON):
     * {
     *   "message": "Faculties fetched successfully",
     *   "code": 200,
     *   "response": {
     *     "content": [
     *       {
     *         "id": 1001,
     *         "facultyCode": "CSE-FAC-1001",
     *         "fullName": "Jane Smith",
     *         "email": "janesmith@seu.edu",
     *         "phone": "+1987654321",
     *         "employeeId": "EMP-885",
     *         "designation": "ASSOCIATE_PROFESSOR",
     *         "employmentType": "FULL_TIME",
     *         "departmentName": "Computer Science & Engineering",
     *         "isActive": true
     *       }
     *     ],
     *     "pageNo": 0,
     *     "pageSize": 10,
     *     "totalElements": 1,
     *     "totalPages": 1,
     *     "last": true
     *   }
     * }
     */
    @GetMapping
    @PreAuthorize("hasAuthority('ADMIN')")
    public ResponseEntity<CommonResponse<PageResponse<FacultyListResponse>>> getAllFaculties(
            @RequestParam(required = false) String search,
            @RequestParam(required = false) Integer departmentId,
            @RequestParam(required = false) Designation designation,
            @RequestParam(required = false) EmploymentType employmentType,
            @RequestParam(required = false) Boolean isActive,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "id") String sortBy,
            @RequestParam(defaultValue = "DESC") String sortDirection) {

        PageResponse<FacultyListResponse> response = facultyService.getAllFaculties(
                search, departmentId, designation, employmentType, isActive, page, size, sortBy, sortDirection);

        return ResponseEntity.ok(CommonResponse.<PageResponse<FacultyListResponse>>builder()
                .message("Faculties fetched successfully")
                .code(200)
                .response(response)
                .build());
    }

    /**
     * POSTMAN EXAMPLE: Soft Delete Faculty
     * 
     * 1. HTTP Method: DELETE
     * 2. URL: http://localhost:8085/api/faculties/1001
     * 3. Headers:
     *    - Authorization: Bearer <ADMIN_JWT_TOKEN>
     * 
     * 4. Response Example (JSON):
     * {
     *   "message": "Faculty deleted successfully",
     *   "code": 200,
     *   "response": null
     * }
     */
    @DeleteMapping("/{id}")
    @PreAuthorize("hasAuthority('ADMIN')")
    public ResponseEntity<CommonResponse<Void>> softDeleteFaculty(@PathVariable Integer id) {
        facultyService.softDeleteFaculty(id);
        return ResponseEntity.ok(CommonResponse.<Void>builder()
                .message("Faculty deleted successfully")
                .code(200)
                .build());
    }
}
