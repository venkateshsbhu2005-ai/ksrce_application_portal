package com.college.sdap.config;

import com.college.sdap.entity.User;
import com.college.sdap.entity.enums.Role;
import com.college.sdap.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class DataSeeder implements CommandLineRunner {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) throws Exception {
        if (userRepository.count() == 0) {
            String defaultPassword = passwordEncoder.encode("Password@123");

            User admin = User.builder()
                    .name("System Admin")
                    .email("admin@college.edu")
                    .password(defaultPassword)
                    .role(Role.ROLE_ADMIN)
                    .build();

            User principal = User.builder()
                    .name("College Principal")
                    .email("principal@college.edu")
                    .password(defaultPassword)
                    .role(Role.ROLE_PRINCIPAL)
                    .build();

            User hod = User.builder()
                    .name("HOD Computer Science")
                    .email("hod@college.edu")
                    .password(defaultPassword)
                    .department("CSE")
                    .role(Role.ROLE_HOD)
                    .build();

            User mentor = User.builder()
                    .name("John Doe Mentor")
                    .email("mentor@college.edu")
                    .password(defaultPassword)
                    .department("CSE")
                    .role(Role.ROLE_MENTOR)
                    .build();

            User student = User.builder()
                    .name("Alice Student")
                    .email("student@college.edu")
                    .registerNumber("REG123456")
                    .password(defaultPassword)
                    .department("CSE")
                    .role(Role.ROLE_STUDENT)
                    .mentor(mentor)
                    .build();

            userRepository.save(admin);
            userRepository.save(principal);
            userRepository.save(hod);
            userRepository.save(mentor); // Save mentor first so student can reference it
            userRepository.save(student);
            
            System.out.println("Default users seeded successfully.");
        }
    }
}
