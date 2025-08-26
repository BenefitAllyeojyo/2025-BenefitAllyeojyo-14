package com.heyoung.domain.outbox.dto.response;

import java.util.List;

public record SaveResponse(
        List<FailedResponseDto> failed
) { }
