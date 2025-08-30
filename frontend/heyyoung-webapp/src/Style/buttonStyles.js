// 버튼 스타일을 위한 유틸리티 함수들

export const getButtonSize = (size) => {
  const sizes = {
    small: {
      height: 'var(--button-mini-height)',
      padding: 'var(--button-mini-padding)',
      gap: 'var(--button-mini-gap)',
      fontSize: 'var(--font-size-s)',
      fontWeight: 'var(--font-weight-body)'
    },
    medium: {
      height: 'var(--button-long-height)',
      padding: 'var(--button-long-padding)',
      gap: 'var(--button-long-gap)',
      fontSize: 'var(--font-size-h4)',
      fontWeight: 'var(--font-weight-heading)'
    },
    large: {
      height: '60px',
      padding: '20px',
      gap: '20px',
      fontSize: 'var(--font-size-h3)',
      fontWeight: 'var(--font-weight-heading)'
    }
  };
  
  return sizes[size] || sizes.medium;
};

export const getButtonVariant = (variant) => {
  const variants = {
    default: {
      background: 'var(--neutral-light-lightest)',
      color: 'var(--neutral-dark-darkest)',
      border: 'none'
    },
    primary: {
      background: 'var(--color-highlight)',
      color: 'var(--neutral-light-lightest)',
      border: 'none'
    },
    secondary: {
      background: 'var(--Highlight-BackGround)',
      color: 'var(--neutral-light-lightest)',
      border: 'none'
    },
    outline: {
      background: 'transparent',
      color: 'var(--Highlight-BackGround)',
      border: '2px solid var(--Highlight-BackGround)'
    }
  };
  
  return variants[variant] || variants.default;
};

export const getCommonButtonStyles = () => ({
  display: 'inline-flex',
  justifyContent: 'center',
  alignItems: 'center',
  borderRadius: 'var(--radius-md)',
  cursor: 'pointer',
  opacity: 1,
  transition: 'all 0.2s ease',
  fontFamily: 'var(--font-sans)',
  textAlign: 'center'
});

export const getDisabledStyles = (disabled) => ({
  cursor: disabled ? 'default' : 'pointer',
  opacity: disabled ? 0.6 : 1
});
