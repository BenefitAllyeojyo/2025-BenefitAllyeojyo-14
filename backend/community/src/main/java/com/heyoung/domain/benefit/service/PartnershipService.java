package com.heyoung.domain.benefit.service;

import com.heyoung.domain.benefit.dto.PartnershipDto;
import com.heyoung.domain.benefit.entity.Category;
import com.heyoung.domain.benefit.entity.Partnership;
import com.heyoung.domain.benefit.repository.CategoryRepository;
import com.heyoung.domain.benefit.repository.PartnershipRepository;
import com.heyoung.domain.university.entity.UserUniversity;
import com.heyoung.domain.university.repository.UserUniversityRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;


@Service
public class PartnershipService {
    private final PartnershipRepository partnershipRepository;
    private final UserUniversityRepository userUniversityRepository;
	private final CategoryRepository categoryRepository;

    public PartnershipService(PartnershipRepository partnershipRepository, UserUniversityRepository userUniversityRepository,
		CategoryRepository categoryRepository) {
        this.partnershipRepository = partnershipRepository;
        this.userUniversityRepository = userUniversityRepository;
		this.categoryRepository = categoryRepository;
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
}
