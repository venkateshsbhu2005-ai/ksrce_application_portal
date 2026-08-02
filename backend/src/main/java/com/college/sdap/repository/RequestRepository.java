package com.college.sdap.repository;

import com.college.sdap.entity.Request;
import com.college.sdap.entity.enums.RequestStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface RequestRepository extends JpaRepository<Request, Long> {
    List<Request> findByStudentIdOrderByCreatedAtDesc(Long studentId);
    List<Request> findByStatusOrderByCreatedAtDesc(RequestStatus status);
    List<Request> findByStatusInOrderByCreatedAtDesc(List<RequestStatus> statuses);
    
    // Custom query to find pending requests assigned to a mentor's students
    List<Request> findByStudentMentorIdAndStatusOrderByCreatedAtDesc(Long mentorId, RequestStatus status);
    
    // Custom query to find pending requests for students in an HOD's department
    List<Request> findByStudentDepartmentAndStatusOrderByCreatedAtDesc(String department, RequestStatus status);
}
