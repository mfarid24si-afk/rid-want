import { Sparkles } from 'lucide-react'

const Loading = ({ size = 'default', text = 'Memuat...' }) => {
  const sizeClasses = {
    small: 'w-8 h-8',
    default: 'w-12 h-12',
    large: 'w-16 h-16'
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-[200px] gap-4">
      <div className="relative">
        {/* Outer ring */}
        <div className={`${sizeClasses[size]} rounded-full border-4 border-primary-100 animate-pulse`}></div>
        
        {/* Spinning ring */}
        <div className={`absolute inset-0 ${sizeClasses[size]} rounded-full border-4 border-transparent border-t-primary-500 animate-spin`}></div>
        
        {/* Center icon */}
        <div className="absolute inset-0 flex items-center justify-center">
          <Sparkles className="w-5 h-5 text-primary-400 animate-pulse" />
        </div>
      </div>
      
      {text && (
        <p className="text-sm text-slate-500 font-medium animate-pulse">{text}</p>
      )}
    </div>
  )
}

export default Loading
