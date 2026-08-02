package com.college.sdap.dto;

import com.college.sdap.entity.enums.Role;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class ApprovalHistoryDto {
    private Long id;
    private Long requestId;
    private String approvedByName;
    private Role role;
    private String decision;
    private String remarks;
    private LocalDateTime approvedAt;
}
