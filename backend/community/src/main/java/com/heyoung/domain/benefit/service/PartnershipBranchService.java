package com.heyoung.domain.benefit.service;

import com.heyoung.domain.benefit.dto.BranchInformationDto;
import com.heyoung.domain.benefit.dto.PartnershipBranchDto;
import com.heyoung.domain.benefit.entity.PartnershipBranch;
import com.heyoung.domain.benefit.repository.PartnershipBranchRepository;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.stream.Collectors;
import org.springframework.transaction.annotation.Transactional;

@Service
public class PartnershipBranchService {
    private final PartnershipBranchRepository partnershipBranchRepository;

    public PartnershipBranchService(PartnershipBranchRepository partnershipBranchRepository) {
        this.partnershipBranchRepository = partnershipBranchRepository;
    }

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
}
