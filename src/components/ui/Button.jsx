const variantStyles = {
  primary: {
    background: 'var(--accent)',
    color: '#fff',
    border: '1px solid var(--accent)',
  },
  secondary: {
    background: 'var(--accent-soft)',
    color: 'var(--accent)',
    border: '1px solid var(--border)',
  },
  outline: {
    background: 'transparent',
    color: 'var(--text-strong)',
    border: '1px solid var(--border)',
  },
  danger: {
    background: 'var(--danger-soft)',
    color: 'var(--danger)',
    border: '1px solid var(--danger)',
  },
  ghost: {
    background: 'transparent',
    color: 'var(--text)',
    border: '1px solid transparent',
  },
}

const sizeStyles = {
  sm: 'px-3 py-1.5 text-xs rounded-lg',
  md: 'px-4 py-2 text-sm rounded-xl',
  lg: 'px-5 py-2.5 text-base rounded-xl',
}

const Button = ({
  children,
  variant = 'primary',
  size = 'md',
  onClick,
  disabled = false,
  className = '',
  type = 'button',
  icon: Icon,
}) => {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`inline-flex items-center justify-center gap-2 font-medium transition-all
        ${sizeStyles[size]} ${className}
        ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer hover:opacity-90 active:scale-95'}`}
      style={variantStyles[variant]}
    >
      {Icon && <Icon className="w-4 h-4" />}
      {children}
    </button>
  )
}

export default Button