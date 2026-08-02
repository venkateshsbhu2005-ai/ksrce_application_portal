package com.college.sdap.dto;

import com.college.sdap.entity.enums.RequestType;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class RequestCreationDto {
    @NotNull(message = "Request type is required")
    private RequestType requestType;

    @NotBlank(message = "Description is required")
    private String description;

    private String attachmentUrl;
}
