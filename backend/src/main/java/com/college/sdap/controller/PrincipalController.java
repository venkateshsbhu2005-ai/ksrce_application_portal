package com.college.sdap.controller;

import com.college.sdap.dto.ApprovalRequestDto;
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
@RequestMapping("/api/principal")
@PreAuthorize("hasRole('PRINCIPAL')")
@RequiredArgsConstructor
public class PrincipalController {

    private final RequestService requestService;

    @GetMapping("/pending")
    public ResponseEntity<List<RequestResponseDto>> getPendingRequests() {
        return ResponseEntity.ok(requestService.getPendingForPrincipal());
    }

    @GetMapping("/request/{id}")
    public ResponseEntity<RequestResponseDto> getRequestById(@PathVariable Long id) {
        return ResponseEntity.ok(requestService.getRequestById(id));
    }

    @PutMapping("/{id}/approve")
    public ResponseEntity<RequestResponseDto> approveRequest(
            @PathVariable Long id,
            @Valid @RequestBody ApprovalRequestDto dto,
            Principal principal) {
        dto.setDecision("APPROVED");
        return ResponseEntity.ok(requestService.processApproval(id, dto, principal.getName()));
    }

    @PutMapping("/{id}/reject")
    public ResponseEntity<RequestResponseDto> rejectRequest(
            @PathVariable Long id,
            @Valid @RequestBody ApprovalRequestDto dto,
            Principal principal) {
        dto.setDecision("REJECTED");
        return ResponseEntity.ok(requestService.processApproval(id, dto, principal.getName()));
    }
}
