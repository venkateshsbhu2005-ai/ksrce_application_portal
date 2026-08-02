package com.college.sdap.mapper;

import com.college.sdap.dto.RequestResponseDto;
import com.college.sdap.entity.Request;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring", uses = {ApprovalHistoryMapper.class})
public interface RequestMapper {

    @Mapping(source = "student.id", target = "studentId")
    @Mapping(source = "student.name", target = "studentName")
    @Mapping(source = "student.registerNumber", target = "studentRegisterNumber")
    @Mapping(target = "approvalHistory", ignore = true) // Will be populated in service if needed
    RequestResponseDto toDto(Request request);
}
