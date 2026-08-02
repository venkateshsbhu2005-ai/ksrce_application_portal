package com.college.sdap.controller;

import com.college.sdap.dto.StudentCreationDto;
import com.college.sdap.entity.User;
import com.college.sdap.repository.UserRepository;
import com.college.sdap.service.AdminService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import jakarta.validation.Valid;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/admin")
@PreAuthorize("hasRole('ADMIN')")
@RequiredArgsConstructor
public class AdminController {

    private final UserRepository userRepository;
    private final AdminService adminService;

    @GetMapping("/users")
    public ResponseEntity<List<User>> getAllUsers() {
        return ResponseEntity.ok(userRepository.findAll());
    }

    @PostMapping("/student")
    public ResponseEntity<?> addStudent(@Valid @RequestBody StudentCreationDto dto) {
        try {
            User student = adminService.addStudent(dto);
            return ResponseEntity.ok(Map.of("message", "Student created successfully", "userId", student.getId()));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }

    @PostMapping("/students/upload")
    public ResponseEntity<?> uploadStudents(@RequestParam("file") MultipartFile file) {
        try {
            List<User> students = adminService.processStudentExcelUpload(file);
            return ResponseEntity.ok(Map.of("message", "Successfully uploaded " + students.size() + " students"));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(Map.of("message", e.getMessage()));
        }
    }

    @PostMapping("/mentor")
    public ResponseEntity<?> addMentor(@Valid @RequestBody com.college.sdap.dto.MentorCreationDto dto) {
        try {
            User mentor = adminService.addMentor(dto);
            return ResponseEntity.ok(Map.of("message", "Mentor created successfully", "userId", mentor.getId()));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }

    @PostMapping("/mentors/upload")
    public ResponseEntity<?> uploadMentors(@RequestParam("file") MultipartFile file) {
        try {
            List<User> mentors = adminService.processMentorExcelUpload(file);
            return ResponseEntity.ok(Map.of("message", "Successfully uploaded " + mentors.size() + " mentors"));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(Map.of("message", e.getMessage()));
        }
    }

    @GetMapping("/students")
    public ResponseEntity<List<User>> getAllStudents() {
        return ResponseEntity.ok(adminService.getAllStudents());
    }

    @GetMapping("/mentors")
    public ResponseEntity<List<User>> getAllMentors() {
        return ResponseEntity.ok(adminService.getAllMentors());
    }

    @PutMapping("/user/{id}")
    public ResponseEntity<?> updateUser(@PathVariable Long id, @Valid @RequestBody com.college.sdap.dto.UserUpdateDto dto) {
        try {
            User updated = adminService.updateUser(id, dto);
            return ResponseEntity.ok(Map.of("message", "User updated successfully"));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }

    @DeleteMapping("/user/{id}")
    public ResponseEntity<?> deleteUser(@PathVariable Long id) {
        try {
            adminService.deleteUser(id);
            return ResponseEntity.ok(Map.of("message", "User deleted successfully"));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }

    @PostMapping("/hod")
    public ResponseEntity<?> addHod(@Valid @RequestBody com.college.sdap.dto.MentorCreationDto dto) {
        try {
            User hod = adminService.addHod(dto);
            return ResponseEntity.ok(Map.of("message", "HOD created successfully", "userId", hod.getId()));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }

    @PostMapping("/hods/upload")
    public ResponseEntity<?> uploadHods(@RequestParam("file") MultipartFile file) {
        try {
            List<User> hods = adminService.processHodExcelUpload(file);
            return ResponseEntity.ok(Map.of("message", "Successfully uploaded " + hods.size() + " HODs"));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(Map.of("message", e.getMessage()));
        }
    }

    @GetMapping("/hods")
    public ResponseEntity<List<User>> getAllHods() {
        return ResponseEntity.ok(adminService.getAllHods());
    }
}
