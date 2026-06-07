const colors = [
  'var(--accent)', '#6B8FC9', '#6B9E7A', '#C96B6B',
  '#D4956A', '#9B6BC9', '#6BC9C9',
]

const Avatar = ({ initials = '?', size = 'md', index = 0 }) => {
  const sizes = { sm: 'w-7 h-7 text-xs', md: 'w-9 h-9 text-sm', lg: 'w-12 h-12 text-base' }
  const bg = colors[index % colors.length]

  return (
    <div
      className={`rounded-xl flex items-center justify-center font-bold text-white flex-shrink-0 ${sizes[size]}`}
      style={{ background: bg }}
    >
      {initials.slice(0, 2).toUpperCase()}
    </div>
  )
}

export default Avatar