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
              {index > 0 && <ChevronRight className="w-4 h-4 text-slate-300" />}
              {crumb.path ? (
                <Link 
                  to={crumb.path} 
                  className="text-slate-500 hover:text-primary-600 transition-colors"
                >
                  {crumb.label}
                </Link>
              ) : (
                <span className="text-slate-800 font-medium">{crumb.label}</span>
              )}
            </div>
          ))}
        </nav>
      )}

      {/* Title and Action */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">{title}</h1>
          {subtitle && (
            <p className="text-sm text-slate-500 mt-1">{subtitle}</p>
          )}
        </div>
        
        {actionLabel && (
          <button
            onClick={onAction}
            className="btn-primary flex items-center gap-2"
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
