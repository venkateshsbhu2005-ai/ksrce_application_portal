package com.college.sdap.service;

import com.college.sdap.dto.StudentCreationDto;
import com.college.sdap.entity.User;
import com.college.sdap.entity.enums.Role;
import com.college.sdap.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.ss.usermodel.Sheet;
import org.apache.poi.ss.usermodel.Workbook;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.InputStream;
import java.util.ArrayList;
import java.util.Iterator;
import java.util.List;

@Service
@RequiredArgsConstructor
public class AdminService {

    private final UserRepository userRepository;
    private final com.college.sdap.repository.RequestRepository requestRepository;
    private final com.college.sdap.repository.ApprovalHistoryRepository approvalHistoryRepository;
    private final PasswordEncoder passwordEncoder;

    @Transactional
    public User addStudent(StudentCreationDto dto) {
        if (userRepository.findByEmail(dto.getEmail()).isPresent()) {
            throw new IllegalArgumentException("User with email " + dto.getEmail() + " already exists.");
        }

        User mentor = userRepository.findByEmail(dto.getMentorEmail())
                .orElseThrow(() -> new IllegalArgumentException("Mentor with email " + dto.getMentorEmail() + " not found."));

        if (mentor.getRole() != Role.ROLE_MENTOR) {
            throw new IllegalArgumentException("The specified email does not belong to a Mentor.");
        }

        User student = User.builder()
                .name(dto.getName())
                .email(dto.getEmail())
                .registerNumber(dto.getRegisterNumber())
                .department(dto.getDepartment())
                .role(Role.ROLE_STUDENT)
                .mentor(mentor)
                .password(passwordEncoder.encode("Password@123")) // Default password
                .build();

        return userRepository.save(student);
    }

    @Transactional
    public List<User> processStudentExcelUpload(MultipartFile file) {
        List<User> newStudents = new ArrayList<>();
        List<String> errors = new ArrayList<>();
        
        try (InputStream is = file.getInputStream(); Workbook workbook = new XSSFWorkbook(is)) {
            Sheet sheet = workbook.getSheetAt(0);
            Iterator<Row> rows = sheet.iterator();

            int rowNumber = 0;
            while (rows.hasNext()) {
                Row currentRow = rows.next();
                if (rowNumber == 0) {
                    rowNumber++;
                    continue; // Skip header row
                }

                try {
                    String name = currentRow.getCell(0).getStringCellValue();
                    String email = currentRow.getCell(1).getStringCellValue();
                    String registerNumber = currentRow.getCell(2).getStringCellValue();
                    String department = currentRow.getCell(3).getStringCellValue();
                    String mentorEmail = currentRow.getCell(4).getStringCellValue();

                    if (userRepository.findByEmail(email).isPresent()) {
                        errors.add("Row " + (rowNumber + 1) + ": Email " + email + " already exists.");
                        rowNumber++;
                        continue;
                    }

                    User mentor = userRepository.findByEmail(mentorEmail).orElse(null);
                    if (mentor == null || mentor.getRole() != Role.ROLE_MENTOR) {
                        errors.add("Row " + (rowNumber + 1) + ": Mentor email " + mentorEmail + " is invalid.");
                        rowNumber++;
                        continue;
                    }

                    User student = User.builder()
                            .name(name)
                            .email(email)
                            .registerNumber(registerNumber)
                            .department(department)
                            .role(Role.ROLE_STUDENT)
                            .mentor(mentor)
                            .password(passwordEncoder.encode("Password@123")) // Default password
                            .build();

                    newStudents.add(student);
                } catch (Exception e) {
                    errors.add("Row " + (rowNumber + 1) + ": Invalid data format.");
                }
                rowNumber++;
            }

            if (!newStudents.isEmpty()) {
                userRepository.saveAll(newStudents);
            }

            if (!errors.isEmpty()) {
                // If there are partial failures, we can choose to throw an exception or just log it.
                // For simplicity, we throw a runtime exception with all errors to rollback and notify admin.
                throw new IllegalArgumentException("Upload failed with errors: " + String.join(" | ", errors));
            }

            return newStudents;

        } catch (IllegalArgumentException e) {
            throw e;
        } catch (Exception e) {
            throw new RuntimeException("Failed to parse Excel file: " + e.getMessage());
        }
    }

    @Transactional
    public User addMentor(com.college.sdap.dto.MentorCreationDto dto) {
        if (userRepository.findByEmail(dto.getEmail()).isPresent()) {
            throw new IllegalArgumentException("User with email " + dto.getEmail() + " already exists.");
        }

        User mentor = User.builder()
                .name(dto.getName())
                .email(dto.getEmail())
                .department(dto.getDepartment())
                .role(Role.ROLE_MENTOR)
                .password(passwordEncoder.encode("Password@123")) // Default password
                .build();

        return userRepository.save(mentor);
    }

    @Transactional
    public List<User> processMentorExcelUpload(MultipartFile file) {
        List<User> newMentors = new ArrayList<>();
        List<String> errors = new ArrayList<>();
        
        try (InputStream is = file.getInputStream(); Workbook workbook = new XSSFWorkbook(is)) {
            Sheet sheet = workbook.getSheetAt(0);
            Iterator<Row> rows = sheet.iterator();

            int rowNumber = 0;
            while (rows.hasNext()) {
                Row currentRow = rows.next();
                if (rowNumber == 0) {
                    rowNumber++;
                    continue; // Skip header row
                }

                try {
                    String name = currentRow.getCell(0).getStringCellValue();
                    String email = currentRow.getCell(1).getStringCellValue();
                    String department = currentRow.getCell(2).getStringCellValue();

                    if (userRepository.findByEmail(email).isPresent()) {
                        errors.add("Row " + (rowNumber + 1) + ": Email " + email + " already exists.");
                        rowNumber++;
                        continue;
                    }

                    User mentor = User.builder()
                            .name(name)
                            .email(email)
                            .department(department)
                            .role(Role.ROLE_MENTOR)
                            .password(passwordEncoder.encode("Password@123"))
                            .build();

                    newMentors.add(mentor);
                } catch (Exception e) {
                    errors.add("Row " + (rowNumber + 1) + ": Invalid data format.");
                }
                rowNumber++;
            }

            if (!newMentors.isEmpty()) {
                userRepository.saveAll(newMentors);
            }

            if (!errors.isEmpty()) {
                throw new IllegalArgumentException("Upload failed with errors: " + String.join(" | ", errors));
            }

            return newMentors;

        } catch (IllegalArgumentException e) {
            throw e;
        } catch (Exception e) {
            throw new RuntimeException("Failed to parse Excel file: " + e.getMessage());
        }
    }
    public List<User> getAllStudents() {
        return userRepository.findAll().stream()
                .filter(u -> u.getRole() == Role.ROLE_STUDENT)
                .toList();
    }

    public List<User> getAllMentors() {
        return userRepository.findAll().stream()
                .filter(u -> u.getRole() == Role.ROLE_MENTOR)
                .toList();
    }

    @Transactional
    public User updateUser(Long id, com.college.sdap.dto.UserUpdateDto dto) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));

        if (!user.getEmail().equals(dto.getEmail()) && userRepository.findByEmail(dto.getEmail()).isPresent()) {
            throw new IllegalArgumentException("Email already in use");
        }

        user.setName(dto.getName());
        user.setEmail(dto.getEmail());

        if (user.getRole() == Role.ROLE_STUDENT) {
            user.setRegisterNumber(dto.getRegisterNumber());
            user.setDepartment(dto.getDepartment());
            if (dto.getMentorEmail() != null && !dto.getMentorEmail().isBlank()) {
                User mentor = userRepository.findByEmail(dto.getMentorEmail())
                        .orElseThrow(() -> new IllegalArgumentException("Mentor email not found"));
                if (mentor.getRole() != Role.ROLE_MENTOR) {
                    throw new IllegalArgumentException("Provided email is not a Mentor");
                }
                user.setMentor(mentor);
            }
        } else if (user.getRole() == Role.ROLE_MENTOR || user.getRole() == Role.ROLE_HOD) {
            user.setDepartment(dto.getDepartment());
        }

        return userRepository.save(user);
    }

    @Transactional
    public void deleteUser(Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));
        
        // Simple check to see if student has requests
        // In a real app we might soft-delete or cascade, but for prototype we block if they have requests
        if (user.getRole() == Role.ROLE_STUDENT) {
            long requestCount = requestRepository.findByStudentIdOrderByCreatedAtDesc(user.getId()).size();
            if (requestCount > 0) {
                throw new IllegalArgumentException("Cannot delete student because they have active requests.");
            }
        }

        // Check if approver (Mentor, HOD, Principal) has approval history
        if (user.getRole() != Role.ROLE_STUDENT && user.getRole() != Role.ROLE_ADMIN) {
            long approvalCount = approvalHistoryRepository.findByApprovedById(user.getId()).size();
            if (approvalCount > 0) {
                throw new IllegalArgumentException("Cannot delete user because they have existing approval history records.");
            }
        }
        
        userRepository.delete(user);
    }

    @Transactional
    public User addHod(com.college.sdap.dto.MentorCreationDto dto) { // Reusing DTO structure
        if (userRepository.findByEmail(dto.getEmail()).isPresent()) {
            throw new IllegalArgumentException("User with email " + dto.getEmail() + " already exists.");
        }

        User hod = User.builder()
                .name(dto.getName())
                .email(dto.getEmail())
                .department(dto.getDepartment())
                .role(Role.ROLE_HOD)
                .password(passwordEncoder.encode("Password@123")) // Default password
                .build();

        return userRepository.save(hod);
    }

    @Transactional
    public List<User> processHodExcelUpload(MultipartFile file) {
        List<User> newHods = new ArrayList<>();
        List<String> errors = new ArrayList<>();
        
        try (InputStream is = file.getInputStream(); Workbook workbook = new XSSFWorkbook(is)) {
            Sheet sheet = workbook.getSheetAt(0);
            Iterator<Row> rows = sheet.iterator();

            int rowNumber = 0;
            while (rows.hasNext()) {
                Row currentRow = rows.next();
                if (rowNumber == 0) {
                    rowNumber++;
                    continue; // Skip header row
                }

                try {
                    String name = currentRow.getCell(0).getStringCellValue();
                    String email = currentRow.getCell(1).getStringCellValue();
                    String department = currentRow.getCell(2).getStringCellValue();

                    if (userRepository.findByEmail(email).isPresent()) {
                        errors.add("Row " + (rowNumber + 1) + ": Email " + email + " already exists.");
                        rowNumber++;
                        continue;
                    }

                    User hod = User.builder()
                            .name(name)
                            .email(email)
                            .department(department)
                            .role(Role.ROLE_HOD)
                            .password(passwordEncoder.encode("Password@123"))
                            .build();

                    newHods.add(hod);
                } catch (Exception e) {
                    errors.add("Row " + (rowNumber + 1) + ": Invalid data format.");
                }
                rowNumber++;
            }

            if (!newHods.isEmpty()) {
                userRepository.saveAll(newHods);
            }

            if (!errors.isEmpty()) {
                throw new IllegalArgumentException("Upload failed with errors: " + String.join(" | ", errors));
            }

            return newHods;

        } catch (IllegalArgumentException e) {
            throw e;
        } catch (Exception e) {
            throw new RuntimeException("Failed to parse Excel file: " + e.getMessage());
        }
    }

    public List<User> getAllHods() {
        return userRepository.findAll().stream()
                .filter(u -> u.getRole() == Role.ROLE_HOD)
                .toList();
    }
}
