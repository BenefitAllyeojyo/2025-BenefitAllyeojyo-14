package com.heyoung.domain.payment.entity;

import com.heyoung.global.encoding.service.EncodingService;

import jakarta.persistence.AttributeConverter;
import jakarta.persistence.Converter;
import lombok.RequiredArgsConstructor;

@Converter
@RequiredArgsConstructor
public class AccountConverter implements AttributeConverter<String,String> {

	private final EncodingService encodingService;

	@Override
	public String convertToDatabaseColumn(String attribute) {
		return encodingService.encode(attribute);
	}

	@Override
	public String convertToEntityAttribute(String dbData) {
		return encodingService.decode(dbData);
	}
}
