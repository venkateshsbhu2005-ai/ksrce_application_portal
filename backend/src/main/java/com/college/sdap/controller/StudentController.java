package com.college.sdap.controller;

import com.college.sdap.dto.RequestCreationDto;
import com.college.sdap.dto.RequestResponseDto;
import com.college.sdap.service.RequestService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.List;

@RestController
@RequestMapping("/api/student")
@PreAuthorize("hasRole('STUDENT')")
@RequiredArgsConstructor
public class StudentController {

    private final RequestService requestService;

    @PostMapping("/request")
    public ResponseEntity<RequestResponseDto> createRequest(
            @Valid @RequestBody RequestCreationDto dto,
            Principal principal) {
        return ResponseEntity.ok(requestService.createRequest(dto, principal.getName()));
    }

    @GetMapping("/my-requests")
    public ResponseEntity<List<RequestResponseDto>> getMyRequests(Principal principal) {
        return ResponseEntity.ok(requestService.getMyRequests(principal.getName()));
    }

    @GetMapping("/request/{id}")
    public ResponseEntity<RequestResponseDto> getRequestById(@PathVariable Long id) {
        return ResponseEntity.ok(requestService.getRequestById(id));
    }
}
