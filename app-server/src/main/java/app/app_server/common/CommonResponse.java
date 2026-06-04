package app.app_server.common;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * CommonResponse — A generic wrapper for all API responses.
 *
 * IMPROVED DESIGN from the original single-type-parameter version.
 *
 * PROBLEM with the old design:
 *   CommonResponse<T> had T applied to ALL THREE fields:
 *     private T message;   ← should always be a String
 *     private T code;      ← should always be an int
 *     private T response;  ← this is the only field that varies
 *
 *   This forced callers to do CommonResponse.<String>builder() for simple
 *   messages but CommonResponse.<UserResponseDTO>builder() for typed data,
 *   causing type conflicts when you set .message("text").code(200).response(dto).
 *
 * SOLUTION:
 *   - Keep T only for the 'response' field (the part that actually varies).
 *   - 'message' is always String.
 *   - 'code' is always int.
 *
 * USAGE EXAMPLE:
 *   return CommonResponse.<UserResponseDTO>builder()
 *       .message("User created")
 *       .code(200)
 *       .response(userResponseDTO)
 *       .build();
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CommonResponse<T> {

    // Human-readable message describing the result (e.g., "Login Successful", "User not found")
    private String message;

    // HTTP-style status code (200 = success, 400 = bad request, 401 = unauthorized, etc.)
    private int code;

    // The actual payload — varies by endpoint (UserResponseDTO, AuthResponseDTO, List<...>, etc.)
    private T response;
}
