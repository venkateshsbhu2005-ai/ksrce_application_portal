package com.college.sdap.controller;

import com.college.sdap.dto.PasswordChangeRequest;
import com.college.sdap.dto.ProfileUpdateRequest;
import com.college.sdap.entity.User;
import com.college.sdap.service.UserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;

    @PutMapping("/profile")
    public ResponseEntity<User> updateProfile(
            @AuthenticationPrincipal User user,
            @Valid @RequestBody ProfileUpdateRequest request
    ) {
        return ResponseEntity.ok(userService.updateProfile(user.getEmail(), request));
    }

    @PutMapping("/password")
    public ResponseEntity<Map<String, String>> changePassword(
            @AuthenticationPrincipal User user,
            @Valid @RequestBody PasswordChangeRequest request
    ) {
        userService.changePassword(user.getEmail(), request);
        return ResponseEntity.ok(Map.of("message", "Password changed successfully"));
    }
}
