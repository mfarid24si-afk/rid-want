const InputField = ({ label, id, error, ...props }) => (
  <div>
    {label && (
      <label htmlFor={id} className="block text-sm font-medium mb-1.5"
        style={{ color: 'var(--text-strong)' }}>
        {label}
      </label>
    )}
    <input
      id={id}
      className="w-full px-4 py-2.5 rounded-xl text-sm outline-none transition-all"
      style={{
        background: 'var(--bg-raised)',
        border: `1px solid ${error ? 'var(--danger)' : 'var(--border)'}`,
        color: 'var(--text-strong)',
      }}
      {...props}
    />
    {error && <p className="text-xs mt-1" style={{ color: 'var(--danger)' }}>{error}</p>}
  </div>
)

export default InputField