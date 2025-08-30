package com.heyoung.domain.benefit.dto.response;

public record PartnershipByLocationResponseDto(
        Long partnershipBranchId,
        Double latitude,
        Double longitude,
        String name,
        String address,
        String terms,
        String hostName
) { }
