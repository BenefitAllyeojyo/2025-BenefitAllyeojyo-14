import React from 'react';

// 공통 버튼 스타일을 위한 base 컴포넌트
export const ButtonBase = React.forwardRef(({ 
  children, 
  variant = 'default',
  size = 'medium',
  disabled = false,
  onClick,
  className = '',
  style = {},
  ...props 
}, ref) => {
  
  const baseStyles = {
    display: 'inline-flex',
    justifyContent: 'center',
    alignItems: 'center',
    border: 'none',
    cursor: disabled ? 'default' : 'pointer',
    opacity: disabled ? 0.6 : 1,
    transition: 'all 0.2s ease',
    fontFamily: 'var(--font-sans)',
    ...style
  };

  const sizeStyles = {
    small: {
      height: 'var(--button-mini-height)',
      padding: 'var(--button-mini-padding)',
      gap: 'var(--button-mini-gap)',
      fontSize: 'var(--font-size-s)',
      fontWeight: 'var(--font-weight-body)',
      borderRadius: 'var(--radius-md)'
    },
    medium: {
      height: 'var(--button-long-height)',
      padding: 'var(--button-long-padding)',
      gap: 'var(--button-long-gap)',
      fontSize: 'var(--font-size-h4)',
      fontWeight: 'var(--font-weight-heading)',
      borderRadius: 'var(--radius-md)'
    }
  };

  const variantStyles = {
    default: {
      background: 'var(--neutral-light-lightest)',
      color: 'var(--neutral-dark-darkest)'
    },
    primary: {
      background: 'var(--color-highlight)',
      color: 'var(--neutral-light-lightest)'
    },
    secondary: {
      background: 'var(--Highlight-BackGround)',
      color: 'var(--neutral-light-lightest)'
    }
  };

  const combinedStyles = {
    ...baseStyles,
    ...sizeStyles[size],
    ...variantStyles[variant]
  };

  return (
    <button
      ref={ref}
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={className}
      style={combinedStyles}
      {...props}
    >
      {children}
    </button>
  );
});

ButtonBase.displayName = 'ButtonBase';
