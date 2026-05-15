import { Link } from 'react-router-dom'
import { ChevronRight, Plus } from 'lucide-react'

const PageHeader = ({ 
  title, 
  subtitle,
  breadcrumbs = [], 
  actionLabel, 
  onAction,
  actionIcon: ActionIcon = Plus 
}) => {
  return (
    <div className="mb-6">
      {/* Breadcrumbs */}
      {breadcrumbs.length > 0 && (
        <nav className="flex items-center gap-2 text-sm mb-2">
          {breadcrumbs.map((crumb, index) => (
            <div key={index} className="flex items-center gap-2">
              {/* Mengubah warna chevron pemisah menjadi zinc gelap */}
              {index > 0 && <ChevronRight className="w-4 h-4 text-zinc-600" />}
              {crumb.path ? (
                // Mengubah link tidak aktif menjadi zinc redup dan hover ke putih terang
                <Link 
                  to={crumb.path} 
                  className="text-zinc-500 hover:text-zinc-200 transition-colors"
                >
                  {crumb.label}
                </Link>
              ) : (
                // Mengubah teks posisi halaman aktif saat ini menjadi zinc terang
                <span className="text-zinc-300 font-medium">{crumb.label}</span>
              )}
            </div>
          ))}
        </nav>
      )}

      {/* Title and Action */}
      <div className="flex items-center justify-between">
        <div>
          {/* Mengubah judul utama menjadi putih bersih */}
          <h1 className="text-2xl font-bold text-zinc-100">{title}</h1>
          {subtitle && (
            // Mengubah deskripsi sub-judul menjadi zinc medium
            <p className="text-sm text-zinc-400 mt-1">{subtitle}</p>
          )}
        </div>
        
        {actionLabel && (
          // Mengubah tombol aksi utama menjadi solid putih monokrom sesuai gaya ByeWind
          <button
            onClick={onAction}
            className="px-4 py-2.5 rounded-xl text-sm font-medium bg-zinc-200 text-zinc-900 hover:bg-zinc-300 transition-colors flex items-center gap-2 cursor-pointer"
          >
            <ActionIcon className="w-4 h-4" />
            <span>{actionLabel}</span>
          </button>
        )}
      </div>
    </div>
  )
}

export default PageHeader
