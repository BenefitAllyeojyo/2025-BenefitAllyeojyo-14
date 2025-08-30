package com.heyoung.global.encoding.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.heyoung.global.encoding.service.EncodingService;

import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;

@Tag(name="암호화 API(백엔드 전용)", description = "암호화를 테스트하기 위한 API입니다. 실제 서비스에서는 사용되지 않습니다.")
@RestController
@RequestMapping("/encoding")
@RequiredArgsConstructor
public class EncodingController {

	private final EncodingService encodingService;

	@PostMapping("/encode")
	public String encode(String value) {
		return encodingService.encode(value);
	}

	@GetMapping("/decode")
	public String decode(String encodedValue) {
		return encodingService.decode(encodedValue);
	}
}
