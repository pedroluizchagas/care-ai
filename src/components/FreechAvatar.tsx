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
        alt="Freech - Assistente CareAI"
        className="w-full h-full object-cover"
      />
    </div>
  )
}
