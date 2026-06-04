package app.app_server.semester.service;

import app.app_server.common.CommonResponse;
import app.app_server.common.PageResponse;
import app.app_server.semester.dto.request.SemesterCreateRequest;
import app.app_server.semester.dto.request.SemesterUpdateRequest;
import app.app_server.semester.dto.response.SemesterResponse;
import app.app_server.semester.enums.SemesterName;

import java.util.List;

public interface SemesterService {
    CommonResponse<SemesterResponse> createSemester(SemesterCreateRequest request);
    
    CommonResponse<SemesterResponse> updateSemester(Integer id, SemesterUpdateRequest request);
    
    CommonResponse<SemesterResponse> getSemesterById(Integer id);
    
    CommonResponse<List<SemesterResponse>> getAllSemesters();
    
    CommonResponse<PageResponse<SemesterResponse>> getSemestersPaginated(
            int page, int size, String sortBy, String sortDir,
            String semesterCode, SemesterName semesterName, Integer year, 
            Boolean isCurrentSemester, Boolean isActive);
            
    CommonResponse<String> deleteSemester(Integer id);
}
