package com.college.sdap.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class StudentCreationDto {
    @NotBlank(message = "Name is required")
    private String name;

    @Email(message = "Invalid email format")
    @NotBlank(message = "Email is required")
    private String email;

    @NotBlank(message = "Register number is required")
    private String registerNumber;

    @NotBlank(message = "Department is required")
    private String department;

    @Email(message = "Invalid mentor email format")
    @NotBlank(message = "Mentor email is required")
    private String mentorEmail;
}
