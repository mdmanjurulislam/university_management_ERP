package app.app_server.department.controller;

import app.app_server.common.CommonResponse;
import app.app_server.department.dto.request.DepartmentRequestDTO;
import app.app_server.department.dto.response.DepartmentResponseDTO;
import app.app_server.department.service.DepartmentService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/departments")
@CrossOrigin(origins = "http://localhost:5173")
public class DepartmentController {

    @Autowired
    private DepartmentService departmentService;

    /**
     * Creates a new Department.
     * 
     * Example Request:
     * POST /api/departments/create
     * {
     *   "departmentCode": "CSE",
     *   "departmentName": "Computer Science and Engineering",
     *   "shortName": "CSE",
     *   "description": "Department of CSE"
     * }
     */
    @PostMapping("/create")
    public CommonResponse<DepartmentResponseDTO> createDepartment(@Valid @RequestBody DepartmentRequestDTO dto) {
        return departmentService.createDepartment(dto);
    }

    /**
     * Updates an existing Department by ID.
     * 
     * Example Request:
     * PUT /api/departments/update/1
     * {
     *   "departmentCode": "EEE",
     *   "departmentName": "Electrical and Electronic Engineering",
     *   "shortName": "EEE",
     *   "description": "Updated Description"
     * }
     */
    @PutMapping("/update/{id}")
    public CommonResponse<DepartmentResponseDTO> updateDepartment(
            @PathVariable Integer id, 
            @Valid @RequestBody DepartmentRequestDTO dto) {
        return departmentService.updateDepartment(id, dto);
    }

    /**
     * Gets a specific Department by its ID.
     * 
     * Example Request:
     * GET /api/departments/1
     * 
     * Example Response:
     * {
     *   "id": 1,
     *   "departmentCode": "CSE",
     *   "departmentName": "Computer Science and Engineering",
     *   "shortName": "CSE",
     *   "isActive": true
     *   ...
     * }
     */
    @GetMapping("/{id}")
    public CommonResponse<DepartmentResponseDTO> getDepartmentById(@PathVariable Integer id) {
        return departmentService.getDepartmentById(id);
    }

    /**
     * Gets a list of all Departments.
     * 
     * Example Request:
     * GET /api/departments/all
     */
    @GetMapping("/all")
    public CommonResponse<List<DepartmentResponseDTO>> getAllDepartments() {
        return departmentService.getAllDepartments();
    }

    /**
     * Soft deletes a Department by its ID (sets isActive to false).
     * 
     * Example Request:
     * DELETE /api/departments/1
     */
    @DeleteMapping("/{id}")
    public CommonResponse<String> deleteDepartment(@PathVariable Integer id) {
        return departmentService.deleteDepartment(id);
    }

    /**
     * Toggles the active status (isActive) of a Department by its ID.
     * 
     * Example Request:
     * PATCH /api/departments/toggle-status/1
     */
    @PatchMapping("/toggle-status/{id}")
    public CommonResponse<DepartmentResponseDTO> toggleStatus(@PathVariable Integer id) {
        return departmentService.toggleActiveStatus(id);
    }
}
