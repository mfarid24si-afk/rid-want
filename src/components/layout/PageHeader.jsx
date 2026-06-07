const PageHeader = ({ title, subtitle, children }) => {
  return (
    <div className="flex items-start justify-between mb-6 flex-wrap gap-3">
      <div>
        <h1 className="text-2xl font-bold mb-1" style={{ color: 'var(--text-heading)' }}>{title}</h1>
        {subtitle && <p className="text-sm" style={{ color: 'var(--text)' }}>{subtitle}</p>}
      </div>
      {children && <div className="flex items-center gap-2">{children}</div>}
    </div>
  )
}

export default PageHeader