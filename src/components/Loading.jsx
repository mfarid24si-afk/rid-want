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
        {/* Outer ring - Diubah menjadi zinc gelap transparan agar ring dalam lebih menonjol */}
        <div className={`${sizeClasses[size]} rounded-full border-4 border-zinc-800 animate-pulse`}></div>
        
        {/* Spinning ring - Menggunakan warna aksen biru langit cerah khas ByeWind */}
        <div className={`absolute inset-0 ${sizeClasses[size]} rounded-full border-4 border-transparent border-t-sky-400 animate-spin`}></div>
        
        {/* Center icon - Ikon bintang disesuaikan menjadi warna zinc terang netral */}
        <div className="absolute inset-0 flex items-center justify-center">
          <Sparkles className="w-5 h-5 text-zinc-400 animate-pulse" />
        </div>
      </div>
      
      {text && (
        // Warna teks dialihkan dari slate ke zinc medium
        <p className="text-sm text-zinc-400 font-medium animate-pulse">{text}</p>
      )}
    </div>
  )
}

export default Loading
