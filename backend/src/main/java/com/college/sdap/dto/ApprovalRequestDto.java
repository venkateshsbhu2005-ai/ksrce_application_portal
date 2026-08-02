package com.college.sdap.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class ApprovalRequestDto {
    @NotBlank(message = "Decision is required (APPROVED or REJECTED)")
    private String decision;
    
    private String remarks;
}
