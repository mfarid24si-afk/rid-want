import React from 'react'

const StatCard = ({ title, value, change, isPositive, icon: Icon }) => {
  return (
    <div
      className="p-5 rounded-2xl border transition-all duration-300 hover:shadow-md flex items-center justify-between"
      style={{
        backgroundColor: 'var(--bg-surface)',
        borderColor: 'var(--border)',
      }}
    >
      <div className="flex-1 min-w-0">
        <span
          className="text-xs font-medium uppercase tracking-wider block mb-1"
          style={{ color: 'var(--text)' }}
        >
          {title}
        </span>
        <h3
          className="text-xl lg:text-2xl font-bold tracking-tight"
          style={{ color: 'var(--text-heading)' }}
        >
          {value}
        </h3>
        {change && (
          <div className="flex items-center gap-1 mt-2">
            <span
              className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
                isPositive
                  ? 'bg-[var(--success-soft)] text-[var(--success)]'
                  : 'bg-[var(--danger-soft)] text-[var(--danger)]'
              }`}
            >
              {change}
            </span>
            <span className="text-[10px]" style={{ color: 'var(--text)' }}>
              vs bulan lalu
            </span>
          </div>
        )}
      </div>
      {Icon && (
        <div
          className="p-3 rounded-xl flex items-center justify-center shrink-0 ml-4"
          style={{
            backgroundColor: 'var(--accent-soft)',
            color: 'var(--accent)'
          }}
        >
          <Icon className="w-5 h-5 lg:w-6 lg:h-6" />
        </div>
      )}
    </div>
  )
}

export default StatCard