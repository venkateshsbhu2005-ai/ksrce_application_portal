package com.college.sdap.dto;

import com.college.sdap.entity.enums.RequestStatus;
import com.college.sdap.entity.enums.RequestType;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class RequestResponseDto {
    private Long id;
    private Long studentId;
    private String studentName;
    private String studentRegisterNumber;
    private RequestType requestType;
    private String description;
    private String attachmentUrl;
    private RequestStatus status;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    
    private List<ApprovalHistoryDto> approvalHistory;
}
