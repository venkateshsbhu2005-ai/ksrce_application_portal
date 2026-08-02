package com.college.sdap.mapper;

import com.college.sdap.dto.ApprovalHistoryDto;
import com.college.sdap.entity.ApprovalHistory;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface ApprovalHistoryMapper {

    @Mapping(source = "request.id", target = "requestId")
    @Mapping(source = "approvedBy.name", target = "approvedByName")
    ApprovalHistoryDto toDto(ApprovalHistory approvalHistory);
}
