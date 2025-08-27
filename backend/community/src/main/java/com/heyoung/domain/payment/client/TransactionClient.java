package com.heyoung.domain.payment.client;

import java.util.List;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import com.heyoung.domain.payment.dto.PaymentRequestDto;
import com.heyoung.domain.payment.dto.PaymentResponseDto;
import com.heyoung.domain.payment.dto.QrDataDto;
import com.heyoung.global.exception.BaseResponse;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class TransactionClient {
	private final RestTemplate restTemplate;

	@Value("${api.core-bank.url}")
	private String paymentApiBaseUrl;

	public QrDataDto requestQrData(Long memberId) {
		String url = paymentApiBaseUrl + "/transactions/qr-data";
		HttpHeaders headers = new HttpHeaders();
		headers.setAccept(List.of(MediaType.APPLICATION_JSON));
		HttpEntity<Void> httpEntity = new HttpEntity<>(headers);

		ResponseEntity<BaseResponse<QrDataDto>> resp = restTemplate.exchange(
			url,
			HttpMethod.GET,
			httpEntity,
			new ParameterizedTypeReference<>() {
			}
		);

		BaseResponse<QrDataDto> body = ensureBody(resp);
		ensureSuccess(body);
		return body.getResult();
	}

	public PaymentResponseDto executePayment(PaymentRequestDto requestDto) {
		String url = paymentApiBaseUrl + "/transactions/execute";
		HttpHeaders headers = new HttpHeaders();
		headers.setContentType(MediaType.APPLICATION_JSON);

		HttpEntity<PaymentRequestDto> request = new HttpEntity<>(requestDto, headers);

		ResponseEntity<BaseResponse<PaymentResponseDto>> resp = restTemplate.exchange(
			url,
			HttpMethod.POST,
			request,
			new ParameterizedTypeReference<BaseResponse<PaymentResponseDto>>() {}
		);

		BaseResponse<PaymentResponseDto> body = ensureBody(resp);
		ensureSuccess(body);
		return body.getResult();
	}

	private <T> BaseResponse<T> ensureBody(ResponseEntity<BaseResponse<T>> resp) {
		if (resp.getBody() == null) {
			throw new IllegalStateException("Empty response body from payment API");
		}
		return resp.getBody();
	}

	private void ensureSuccess(BaseResponse<?> body) {
		if (Boolean.FALSE.equals(body.getIsSuccess())) {
			throw new IllegalStateException(
				"Payment API failed: code=" + body.getCode() + ", message=" + body.getMessage()
			);
		}
	}
}
