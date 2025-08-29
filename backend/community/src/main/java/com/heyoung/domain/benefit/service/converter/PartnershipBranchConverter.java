package com.heyoung.domain.benefit.service.converter;

import com.heyoung.domain.benefit.dto.response.PartnershipByLocationResponseDto;
import com.heyoung.domain.benefit.repository.PartnershipBranchRepository;

public class PartnershipBranchConverter {

    public static PartnershipByLocationResponseDto toPartnershipByLocationResponseDto(PartnershipBranchRepository.NearbyBranchRow nearbyBranchRow) {
        return new PartnershipByLocationResponseDto(
                nearbyBranchRow.getBranchId(), nearbyBranchRow.getLat(), nearbyBranchRow.getLng(), nearbyBranchRow.getPartnershipName(), nearbyBranchRow.getAddress(), nearbyBranchRow.getTerms(), nearbyBranchRow.getHostName()
        );
    }
}
