package com.heyoung.domain.benefit.service;

import com.heyoung.domain.benefit.dto.BranchInformationDto;
import com.heyoung.domain.benefit.dto.PartnershipBranchDto;
import com.heyoung.domain.benefit.dto.response.PartnershipByLocationResponseDto;
import com.heyoung.domain.benefit.entity.PartnershipBranch;
import com.heyoung.domain.benefit.repository.PartnershipBranchRepository;
import com.heyoung.domain.benefit.service.converter.PartnershipBranchConverter;
import com.heyoung.domain.university.entity.University;
import com.heyoung.domain.university.service.UserUniversityQueryService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.stream.Collectors;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class PartnershipBranchService {

    private final PartnershipBranchRepository partnershipBranchRepository;
    private final UserUniversityQueryService userUniversityQueryService;

    @Transactional(readOnly = true)
    public List<PartnershipBranchDto> findAllPartnershipBranches(Long partnershipBranchId) {
        List<PartnershipBranch> partnershipBranches = partnershipBranchRepository.findByPartnershipId(partnershipBranchId);
        return partnershipBranches.stream()
                .map(PartnershipBranchDto::new)
                .collect(Collectors.toList());
    }

	@Transactional(readOnly = true)
	public BranchInformationDto findBranchInformation(Long branchId) {
		PartnershipBranch branch = partnershipBranchRepository.findById(branchId)
			.orElseThrow(() -> new IllegalArgumentException("Invalid branch ID: " + branchId));

		return new BranchInformationDto(branch);
	}

    @Transactional(readOnly = true)
    public List<PartnershipByLocationResponseDto> getPartnershipListByLocation(Long userId, Double lat, Double lng) {
        University university = userUniversityQueryService.getUniversityByUserId(userId);
        List<PartnershipBranchRepository.NearbyBranchRow> nearby = partnershipBranchRepository.findNearby(lat, lng, 50000, university.getId(), 30, 0);

        return nearby.stream().map(PartnershipBranchConverter::toPartnershipByLocationResponseDto).toList();
    }
}
