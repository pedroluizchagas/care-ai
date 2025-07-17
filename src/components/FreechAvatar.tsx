interface FreechAvatarProps {
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

export default function FreechAvatar({
  size = 'md',
  className = '',
}: FreechAvatarProps) {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8',
  }

  return (
    <div
      className={`${sizeClasses[size]} ${className} rounded-full overflow-hidden`}
    >
      <img
        src="/freech-avatar.jpg"
        alt="Freech - Assistente Inteligente"
        className="w-full h-full object-cover"
        onError={(e) => {
          // Fallback para ícone se a imagem não existir
          const target = e.target as HTMLImageElement
          target.style.display = 'none'
          target.nextElementSibling?.classList.remove('hidden')
        }}
      />
      {/* Fallback icon */}
      <div className="hidden w-full h-full bg-gradient-accent flex items-center justify-center">
        <span className="text-white font-bold text-xs">F</span>
      </div>
    </div>
  )
}
