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
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;
import org.springframework.transaction.annotation.Transactional;

@Service @Slf4j
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

//    /**
//     * 사용자가 받은 알림 내역 반환
//     */
//    public List<PartnershipByLocationResponseDto> findUserNotificationListByTimetable(Long userId, Double lat, Double lng) {
//
//        List<PartnershipByLocationResponseDto> list = partnershipBranchRepository.getPartnershipListByLocation(userId, lat, lng);
//
//        return list;
//
//    }

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

    @Transactional(readOnly = true)
    public PartnershipBranchRepository.NearbyBranchRow getPartnershipByLocationAndIsNotRead(Long userId, Double lat, Double lng, Long partnershipId) {
        List<PartnershipBranchRepository.NearbyBranchRow> nearby = partnershipBranchRepository.findNearbyPartnershipBranch(lat, lng, 5000, partnershipId, 10, 0);

        log.info("안 읽은 알림 중 지점 : {}", Arrays.deepToString(nearby.toArray()));

        return nearby.isEmpty() ? null : nearby.get(0);
    }
}
