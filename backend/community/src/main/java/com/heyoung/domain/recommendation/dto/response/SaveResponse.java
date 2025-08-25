package com.heyoung.domain.recommendation.dto.response;

import java.util.List;

public record SaveResponse(
        List<FailedResponseDto> failed
) { }
