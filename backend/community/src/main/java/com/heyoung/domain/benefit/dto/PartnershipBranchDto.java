package com.heyoung.domain.benefit.dto;

import com.heyoung.domain.benefit.entity.PartnershipBranch;
import com.heyoung.domain.benefit.entity.PartnershipImage;
import lombok.AllArgsConstructor;
import lombok.Getter;
import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;
import org.locationtech.jts.geom.Point;

@Getter
@AllArgsConstructor
public class PartnershipBranchDto {
    private Long id;
    private String name;
    private String address;
//    private Point location;
    private Double latitude; // Point 대신 위도
    private Double longitude; // Point 대신 경도
    private String phone;
    private String businessHoursJson;
    private LocalDate startDate;
    private LocalDate endDate;
    private String status;
    private Long partnershipId;
    private List<String> images; // 이미지 URL 리스트

    public PartnershipBranchDto(PartnershipBranch branch) {
        this.id = branch.getId();
        this.name = branch.getName();
        this.address = branch.getAddress();
//        this.location = branch.getLocation();
        // Point 를 위도/경도로 변환 
        Point location = branch.getLocation();
        if(location != null) {
            this.latitude = location.getX();
            this.longitude = location.getY();
        }
        this.phone = branch.getPhone();
        this.businessHoursJson = branch.getBusinessHoursJson();
        this.startDate = branch.getStartDate();
        this.endDate = branch.getEndDate();
        this.status = branch.getStatus().name();
        this.partnershipId = branch.getPartnership().getId();
        this.images = branch.getPartnership()
                .getPartnershipImages()
                .stream()
                .map(PartnershipImage::getImageUrl)
                .collect(Collectors.toList());
    }

}
