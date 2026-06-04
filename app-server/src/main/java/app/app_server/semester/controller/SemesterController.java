package app.app_server.semester.controller;

import app.app_server.common.CommonResponse;
import app.app_server.common.PageResponse;
import app.app_server.semester.dto.request.SemesterCreateRequest;
import app.app_server.semester.dto.request.SemesterUpdateRequest;
import app.app_server.semester.dto.response.SemesterResponse;
import app.app_server.semester.enums.SemesterName;
import app.app_server.semester.service.SemesterService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/semesters")
@CrossOrigin(origins = "*") // Adjust based on environment setup
public class SemesterController {

    @Autowired
    private SemesterService semesterService;

    /**
     * Creates a new Semester.
     *
     * Example Request:
     * POST /api/semesters/create
     * {
     *   "semesterCode": "SPRING-2026",
     *   "semesterName": "SPRING",
     *   "year": 2026,
     *   "startDate": "2026-01-01",
     *   "endDate": "2026-06-30",
     *   "registrationStartDate": "2025-12-01",
     *   "registrationEndDate": "2025-12-31",
     *   "resultPublishDate": "2026-07-15",
     *   "isCurrentSemester": true
     * }
     */
    @PostMapping("/create")
    public CommonResponse<SemesterResponse> createSemester(@Valid @RequestBody SemesterCreateRequest request) {
        return semesterService.createSemester(request);
    }

    /**
     * Updates an existing Semester by ID.
     *
     * Example Request:
     * PUT /api/semesters/update/1
     * {
     *   "semesterCode": "SPRING-2026",
     *   "semesterName": "SPRING",
     *   "year": 2026,
     *   "startDate": "2026-01-05",
     *   "endDate": "2026-06-25",
     *   "registrationStartDate": "2025-12-05",
     *   "registrationEndDate": "2025-12-25",
     *   "resultPublishDate": "2026-07-20",
     *   "isCurrentSemester": true
     * }
     */
    @PutMapping("/update/{id}")
    public CommonResponse<SemesterResponse> updateSemester(
            @PathVariable Integer id,
            @Valid @RequestBody SemesterUpdateRequest request) {
        return semesterService.updateSemester(id, request);
    }

    /**
     * Gets a specific Semester by its ID.
     *
     * Example Request:
     * GET /api/semesters/1
     *
     * Example Response:
     * {
     *   "id": 1,
     *   "semesterCode": "SPRING-2026",
     *   "semesterName": "SPRING",
     *   "isActive": true
     *   ...
     * }
     */
    @GetMapping("/{id}")
    public CommonResponse<SemesterResponse> getSemesterById(@PathVariable Integer id) {
        return semesterService.getSemesterById(id);
    }

    /**
     * Gets a list of all Semesters.
     *
     * Example Request:
     * GET /api/semesters/all
     */
    @GetMapping("/all")
    public CommonResponse<List<SemesterResponse>> getAllSemesters() {
        return semesterService.getAllSemesters();
    }

    /**
     * Gets a paginated and filtered list of Semesters.
     *
     * Example Request:
     * GET /api/semesters/paginated?page=0&size=10&sortBy=year&sortDir=desc&semesterName=SPRING&isActive=true
     */
    @GetMapping("/paginated")
    public CommonResponse<PageResponse<SemesterResponse>> getSemestersPaginated(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "id") String sortBy,
            @RequestParam(defaultValue = "desc") String sortDir,
            @RequestParam(required = false) String semesterCode,
            @RequestParam(required = false) SemesterName semesterName,
            @RequestParam(required = false) Integer year,
            @RequestParam(required = false) Boolean isCurrentSemester,
            @RequestParam(required = false) Boolean isActive) {
            
        return semesterService.getSemestersPaginated(
                page, size, sortBy, sortDir, 
                semesterCode, semesterName, year, 
                isCurrentSemester, isActive);
    }

    /**
     * Soft deletes a Semester by its ID (sets isActive to false).
     *
     * Example Request:
     * DELETE /api/semesters/1
     */
    @DeleteMapping("/{id}")
    public CommonResponse<String> deleteSemester(@PathVariable Integer id) {
        return semesterService.deleteSemester(id);
    }
}
