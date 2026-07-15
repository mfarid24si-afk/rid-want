import { ChevronLeft, ChevronRight } from 'lucide-react'

const Pagination = ({ currentPage, totalPages, totalItems, itemsPerPage, onPageChange }) => {
  if (totalPages <= 1) return null

  // Buat array nomor halaman dengan ellipsis
  const getPageNumbers = () => {
    const pages = []
    const maxVisible = 5

    if (totalPages <= maxVisible + 2) {
      for (let i = 1; i <= totalPages; i++) pages.push(i)
    } else {
      pages.push(1)
      let start = Math.max(2, currentPage - 1)
      let end = Math.min(totalPages - 1, currentPage + 1)

      if (currentPage <= 3) {
        start = 2
        end = Math.min(maxVisible, totalPages - 1)
      } else if (currentPage >= totalPages - 2) {
        start = Math.max(2, totalPages - maxVisible + 1)
        end = totalPages - 1
      }

      if (start > 2) pages.push('...')
      for (let i = start; i <= end; i++) pages.push(i)
      if (end < totalPages - 1) pages.push('...')
      pages.push(totalPages)
    }
    return pages
  }

  const startItem = (currentPage - 1) * itemsPerPage + 1
  const endItem = Math.min(currentPage * itemsPerPage, totalItems)

  return (
    <div
      className="flex items-center justify-between px-6 py-4 border-t transition-all"
      style={{ borderColor: 'var(--border)' }}
    >
      <p className="text-xs" style={{ color: 'var(--text)' }}>
        Menampilkan <strong style={{ color: 'var(--text-strong)' }}>{startItem}</strong> 
        {' '}sampai{' '}
        <strong style={{ color: 'var(--text-strong)' }}>{endItem}</strong>
        {' '}dari{' '}
        <strong style={{ color: 'var(--text-strong)' }}>{totalItems}</strong> data
      </p>

      <div className="flex items-center gap-1.5">
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="p-1.5 rounded-lg transition-all disabled:opacity-30"
          style={{ color: 'var(--text)' }}
          onMouseEnter={e => { if (currentPage > 1) e.currentTarget.style.background = 'var(--bg-raised)' }}
          onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
        >
          <ChevronLeft className="w-4 h-4" />
        </button>

        {getPageNumbers().map((page, i) =>
          page === '...' ? (
            <span key={`e${i}`} className="px-1 text-xs" style={{ color: 'var(--text)' }}>...</span>
          ) : (
            <button
              key={page}
              onClick={() => onPageChange(page)}
              className="min-w-[32px] h-8 rounded-lg text-xs font-medium transition-all"
              style={page === currentPage
                ? { background: 'var(--accent)', color: '#fff' }
                : { color: 'var(--text)' }
              }
              onMouseEnter={e => {
                if (page !== currentPage) e.currentTarget.style.background = 'var(--bg-raised)'
              }}
              onMouseLeave={e => {
                if (page !== currentPage) e.currentTarget.style.background = 'transparent'
              }}
            >
              {page}
            </button>
          )
        )}

        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="p-1.5 rounded-lg transition-all disabled:opacity-30"
          style={{ color: 'var(--text)' }}
          onMouseEnter={e => { if (currentPage < totalPages) e.currentTarget.style.background = 'var(--bg-raised)' }}
          onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  )
}

export default Pagination
