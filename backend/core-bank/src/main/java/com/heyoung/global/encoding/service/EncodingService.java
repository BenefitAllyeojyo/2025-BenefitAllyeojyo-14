package com.heyoung.global.encoding.service;

import org.jasypt.encryption.StringEncryptor;
import org.springframework.stereotype.Service;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class EncodingService {

	private final StringEncryptor jasyptEncryptor;

	public String encode(String value) {
		return jasyptEncryptor.encrypt(value);
	}

	public String decode(String encodedValue) {
		return jasyptEncryptor.decrypt(encodedValue);
	}
}
