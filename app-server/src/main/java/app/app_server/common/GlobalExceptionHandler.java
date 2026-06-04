package app.app_server.common;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.context.request.WebRequest;

import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.validation.FieldError;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;
import java.util.stream.Collectors;

@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(BadCredentialsException.class)
    public ResponseEntity<CommonResponse<String>> handleBadCredentialsException(BadCredentialsException ex) {
        CommonResponse<String> response = CommonResponse.<String>builder()
                .message("Invalid username or password")
                .code(401)
                .build();
        return new ResponseEntity<>(response, HttpStatus.UNAUTHORIZED);
    }

    @ExceptionHandler(app.app_server.common.exception.ResourceNotFoundException.class)
    public ResponseEntity<CommonResponse<String>> handleResourceNotFoundException(app.app_server.common.exception.ResourceNotFoundException ex) {
        CommonResponse<String> response = CommonResponse.<String>builder()
                .message(ex.getMessage())
                .code(404)
                .build();
        return new ResponseEntity<>(response, HttpStatus.NOT_FOUND);
    }

    @ExceptionHandler(app.app_server.common.exception.DuplicateResourceException.class)
    public ResponseEntity<CommonResponse<String>> handleDuplicateResourceException(app.app_server.common.exception.DuplicateResourceException ex) {
        CommonResponse<String> response = CommonResponse.<String>builder()
                .message(ex.getMessage())
                .code(409)
                .build();
        return new ResponseEntity<>(response, HttpStatus.CONFLICT);
    }

    @ExceptionHandler(app.app_server.common.exception.ValidationException.class)
    public ResponseEntity<CommonResponse<String>> handleValidationException(app.app_server.common.exception.ValidationException ex) {
        CommonResponse<String> response = CommonResponse.<String>builder()
                .message(ex.getMessage())
                .code(400)
                .build();
        return new ResponseEntity<>(response, HttpStatus.BAD_REQUEST);
    }

    @ExceptionHandler(app.app_server.common.exception.BusinessValidationException.class)
    public ResponseEntity<CommonResponse<String>> handleBusinessValidationException(app.app_server.common.exception.BusinessValidationException ex) {
        CommonResponse<String> response = CommonResponse.<String>builder()
                .message(ex.getMessage())
                .code(400)
                .build();
        return new ResponseEntity<>(response, HttpStatus.BAD_REQUEST);
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<CommonResponse<Map<String, String>>> handleMethodArgumentNotValidException(MethodArgumentNotValidException ex) {
        Map<String, String> errors = new HashMap<>();
        for (FieldError error : ex.getBindingResult().getFieldErrors()) {
            errors.put(error.getField(), error.getDefaultMessage());
        }
        
        CommonResponse<Map<String, String>> response = CommonResponse.<Map<String, String>>builder()
                .message("Validation failed")
                .response(errors)
                .code(400)
                .build();
        return new ResponseEntity<>(response, HttpStatus.BAD_REQUEST);
    }

    @ExceptionHandler(RuntimeException.class)
    public ResponseEntity<CommonResponse<String>> handleRuntimeException(RuntimeException ex) {
        CommonResponse<String> response = CommonResponse.<String>builder()
                .message(ex.getMessage())
                .code(400)
                .build();
        return new ResponseEntity<>(response, HttpStatus.BAD_REQUEST);
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<CommonResponse<String>> handleGlobalException(Exception ex, WebRequest request) {
        CommonResponse<String> response = CommonResponse.<String>builder()
                .message("An unexpected error occurred: " + ex.getMessage())
                .code(500)
                .build();
        return new ResponseEntity<>(response, HttpStatus.INTERNAL_SERVER_ERROR);
    }
}
