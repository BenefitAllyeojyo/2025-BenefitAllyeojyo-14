package com.heyoung.domain.benefit.dto;

import com.heyoung.domain.benefit.entity.PartnershipImage;
import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class PartnershipImageDto {
    private Long id;
    private String imageUrl;
    private Long partnershipId;

    public PartnershipImageDto(PartnershipImage image) {
        this.id = image.getId();
        this.imageUrl = image.getImageUrl();
        this.partnershipId = image.getPartnership().getId();
    }
}
