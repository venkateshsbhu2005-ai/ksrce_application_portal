package com.college.sdap.service;

import com.college.sdap.dto.ApprovalHistoryDto;
import com.college.sdap.dto.ApprovalRequestDto;
import com.college.sdap.dto.RequestCreationDto;
import com.college.sdap.dto.RequestResponseDto;
import com.college.sdap.entity.ApprovalHistory;
import com.college.sdap.entity.Request;
import com.college.sdap.entity.User;
import com.college.sdap.entity.enums.RequestStatus;
import com.college.sdap.entity.enums.Role;
import com.college.sdap.mapper.ApprovalHistoryMapper;
import com.college.sdap.mapper.RequestMapper;
import com.college.sdap.repository.ApprovalHistoryRepository;
import com.college.sdap.repository.RequestRepository;
import com.college.sdap.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class RequestService {

    private final RequestRepository requestRepository;
    private final ApprovalHistoryRepository approvalHistoryRepository;
    private final UserRepository userRepository;
    private final RequestMapper requestMapper;
    private final ApprovalHistoryMapper approvalHistoryMapper;

    @Transactional
    public RequestResponseDto createRequest(RequestCreationDto dto, String userEmail) {
        User student = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));

        if (student.getRole() != Role.ROLE_STUDENT) {
            throw new IllegalArgumentException("Only students can create requests");
        }

        Request request = Request.builder()
                .student(student)
                .requestType(dto.getRequestType())
                .description(dto.getDescription())
                .attachmentUrl(dto.getAttachmentUrl())
                .status(RequestStatus.REQUEST_SUBMITTED)
                .build();

        request = requestRepository.save(request);
        return mapToDtoWithHistory(request);
    }

    public List<RequestResponseDto> getMyRequests(String userEmail) {
        User student = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));
        return requestRepository.findByStudentIdOrderByCreatedAtDesc(student.getId()).stream()
                .map(this::mapToDtoWithHistory)
                .collect(Collectors.toList());
    }
    
    public RequestResponseDto getRequestById(Long id) {
        Request request = requestRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Request not found"));
        return mapToDtoWithHistory(request);
    }

    public List<RequestResponseDto> getPendingForMentor(String mentorEmail) {
        User mentor = userRepository.findByEmail(mentorEmail).orElseThrow();
        return requestRepository.findByStudentMentorIdAndStatusOrderByCreatedAtDesc(mentor.getId(), RequestStatus.REQUEST_SUBMITTED)
                .stream().map(this::mapToDtoWithHistory).collect(Collectors.toList());
    }

    public List<RequestResponseDto> getPendingForHod(String hodEmail) {
        User hod = userRepository.findByEmail(hodEmail).orElseThrow();
        return requestRepository.findByStudentDepartmentAndStatusOrderByCreatedAtDesc(hod.getDepartment(), RequestStatus.MENTOR_APPROVED)
                .stream().map(this::mapToDtoWithHistory).collect(Collectors.toList());
    }

    public List<RequestResponseDto> getPendingForPrincipal() {
        return requestRepository.findByStatusOrderByCreatedAtDesc(RequestStatus.HOD_APPROVED)
                .stream().map(this::mapToDtoWithHistory).collect(Collectors.toList());
    }

    @Transactional
    public RequestResponseDto processApproval(Long requestId, ApprovalRequestDto dto, String approverEmail) {
        User approver = userRepository.findByEmail(approverEmail).orElseThrow();
        Request request = requestRepository.findById(requestId)
                .orElseThrow(() -> new IllegalArgumentException("Request not found"));

        boolean isApproved = "APPROVED".equalsIgnoreCase(dto.getDecision());
        RequestStatus newStatus = determineNewStatus(request.getStatus(), approver.getRole(), isApproved);

        if (newStatus == null) {
            throw new IllegalArgumentException("Invalid state transition for role " + approver.getRole());
        }

        request.setStatus(newStatus);
        requestRepository.save(request);

        ApprovalHistory history = ApprovalHistory.builder()
                .request(request)
                .approvedBy(approver)
                .role(approver.getRole())
                .decision(isApproved ? "APPROVED" : "REJECTED")
                .remarks(dto.getRemarks())
                .build();
        approvalHistoryRepository.save(history);

        return mapToDtoWithHistory(request);
    }

    private RequestStatus determineNewStatus(RequestStatus currentStatus, Role approverRole, boolean isApproved) {
        return switch (approverRole) {
            case ROLE_MENTOR -> {
                if (currentStatus == RequestStatus.REQUEST_SUBMITTED)
                    yield isApproved ? RequestStatus.MENTOR_APPROVED : RequestStatus.MENTOR_REJECTED;
                yield null;
            }
            case ROLE_HOD -> {
                if (currentStatus == RequestStatus.MENTOR_APPROVED)
                    yield isApproved ? RequestStatus.HOD_APPROVED : RequestStatus.HOD_REJECTED;
                yield null;
            }
            case ROLE_PRINCIPAL -> {
                if (currentStatus == RequestStatus.HOD_APPROVED)
                    yield isApproved ? RequestStatus.COMPLETED : RequestStatus.PRINCIPAL_REJECTED;
                yield null;
            }
            default -> null;
        };
    }

    private RequestResponseDto mapToDtoWithHistory(Request request) {
        RequestResponseDto dto = requestMapper.toDto(request);
        List<ApprovalHistoryDto> history = approvalHistoryRepository.findByRequestIdOrderByApprovedAtAsc(request.getId())
                .stream().map(approvalHistoryMapper::toDto).collect(Collectors.toList());
        dto.setApprovalHistory(history);
        return dto;
    }
}
