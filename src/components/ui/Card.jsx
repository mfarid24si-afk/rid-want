const Card = ({ children, className = '', style = {} }) => {
  return (
    <div
      className={`rounded-2xl p-5 ${className}`}
      style={{
        background: 'var(--bg-surface)',
        border: '1px solid var(--border)',
        boxShadow: 'var(--shadow-sm)',
        ...style
      }}
    >
      {children}
    </div>
  )
}

export default Card