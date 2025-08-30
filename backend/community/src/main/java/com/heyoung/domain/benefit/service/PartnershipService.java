package com.heyoung.domain.benefit.service;

import com.heyoung.domain.benefit.dto.PartnershipDto;
import com.heyoung.domain.benefit.entity.Category;
import com.heyoung.domain.benefit.entity.Partnership;
import com.heyoung.domain.benefit.exception.advice.PartnershipException;
import com.heyoung.domain.benefit.repository.CategoryRepository;
import com.heyoung.domain.benefit.repository.PartnershipRepository;
import com.heyoung.domain.benefit.repository.UniversityPartnershipRepository;
import com.heyoung.domain.university.entity.University;
import com.heyoung.domain.university.entity.UserUniversity;
import com.heyoung.domain.university.repository.UserUniversityRepository;
import com.heyoung.global.exception.ResponseCode;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;


@Service
public class PartnershipService {
    private static final List<Long> DEFAULT_CATEGORIES = List.of(1L, 2L, 3L); // 임시 값

    private final PartnershipRepository partnershipRepository;
    private final UserUniversityRepository userUniversityRepository;
	private final CategoryRepository categoryRepository;
    private final UniversityPartnershipRepository universityPartnershipRepository;

    public PartnershipService(PartnershipRepository partnershipRepository, UserUniversityRepository userUniversityRepository,
		CategoryRepository categoryRepository, UniversityPartnershipRepository universityPartnershipRepository) {
        this.partnershipRepository = partnershipRepository;
        this.userUniversityRepository = userUniversityRepository;
		this.categoryRepository = categoryRepository;
        this.universityPartnershipRepository = universityPartnershipRepository;
    }

    // 모든 대학의 Partnership
    @Transactional(readOnly = true)
    public List<PartnershipDto> findAllPartnerships() {
        List<Partnership> partnerships = partnershipRepository.findAllWithUniversity();
        return partnerships.stream()
                .map(PartnershipDto::new)
                .collect(Collectors.toList());
    }

    // 사용자 대학의 Partnership
    @Transactional(readOnly = true)
    public List<PartnershipDto> findPartnerships(Long memberId, String category) {
        Optional<UserUniversity> userUniversityOptional = userUniversityRepository.findByUserId(memberId);
        UserUniversity userUniversity = userUniversityOptional.get();
        Long universityId = userUniversity.getUniversity().getId();
        List<Partnership> partnerships = partnershipRepository.findByUniversityId(universityId);

		if(category == null || category.isEmpty()) {
			return partnerships.stream()
				.map(PartnershipDto::new)
				.collect(Collectors.toList());
		} else {
			return partnerships.stream()
				.filter(p -> p.getCategory().getName().equals(category))
				.map(PartnershipDto::new)
				.collect(Collectors.toList());
		}
    }

	@Transactional(readOnly = true)
	public List<String> findAllCategories() {
		return categoryRepository.findAll().stream()
			.map(Category::getName)
			.toList();
	}

    @Transactional(readOnly = true)
    public Partnership findById(Long id) {
        return partnershipRepository.findById(id).orElseThrow(() -> new PartnershipException(ResponseCode.PARTNERSHIP_NOT_FOUND));
    }

    @Transactional(readOnly = true)
    public List<Partnership> findAllById(List<Long> ids) {
        List<Partnership> list = partnershipRepository.findAllById(ids);
        if (list.isEmpty()) return List.of();
        return list;
    }

    public List<Category> findTop5Categories(University university) {
        List<Category> categories = universityPartnershipRepository.findTop5ByUniversityOrderByUseCountDesc(university).stream()
                .map(universityPartnership -> universityPartnership.getPartnershipBranch().getPartnership().getCategory()).toList();

        return categories.isEmpty() ? categoryRepository.findAllById(DEFAULT_CATEGORIES) : categories;
    }

    /** 카테고리 선호가 있을 때: 그 카테고리에서 유효/미전송 제휴 찾기 */
    public List<Partnership> findActiveByCategoriesExcludeSent(
            List<Category> cats, LocalDate today, Long userId, Instant cutoff
    ) {
        return partnershipRepository.findActiveByCategoriesExcludeSent(
                cats, today, userId, cutoff);
    }
}
