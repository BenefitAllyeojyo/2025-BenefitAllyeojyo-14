package com.heyoung.global.webconfig;

import org.springframework.core.MethodParameter;
import org.springframework.stereotype.Component;
import org.springframework.web.bind.support.WebDataBinderFactory;
import org.springframework.web.context.request.NativeWebRequest;
import org.springframework.web.method.support.HandlerMethodArgumentResolver;
import org.springframework.web.method.support.ModelAndViewContainer;

@Component
public class ManagerIdArgumentResolver implements HandlerMethodArgumentResolver {

	private final Long MANAGER_ID = 2L;

	@Override
	public boolean supportsParameter(MethodParameter parameter) {
		return parameter.getParameterAnnotation(ManagerId.class) != null;
	}

	/*
	 * 추후 로그인 기능이 구현되면 세션에서 회원 ID를 가져오도록 수정할 예정
	 */
	@Override
	public Object resolveArgument(MethodParameter parameter, ModelAndViewContainer mavContainer,
		NativeWebRequest webRequest, WebDataBinderFactory binderFactory) throws Exception {
		return MANAGER_ID;
	}
}
