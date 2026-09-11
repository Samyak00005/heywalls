import { Heart } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext.jsx'
import { useFavorites } from '../../hooks/useFavorites.js'

export default function FavoriteButton({ wallpaperId, variant = 'icon' }) {
  const { user } = useAuth()
  const navigate = useNavigate()
  const { isFavorite, toggle } = useFavorites()
  const active = isFavorite(wallpaperId)

  function handleClick(e) {
    e.preventDefault()
    e.stopPropagation()
    if (!user) {
      navigate('/login')
      return
    }
    toggle(wallpaperId)
  }

  if (variant === 'primary') {
    return (
      <button
        type="button"
        onClick={handleClick}
        className={
          'rounded-md px-lg py-sm text-body font-medium inline-flex items-center gap-sm border ' +
          (active
            ? 'bg-accent-2 text-accent-contrast border-accent-2'
            : 'border-ink text-ink')
        }
      >
        <Heart size={16} fill={active ? 'currentColor' : 'none'} />
        {active ? 'Saved' : 'Save'}
      </button>
    )
  }

  const iconClasses = variant === 'icon-static'
    ? 'bg-bg/90 hover:bg-bg text-ink rounded-sm p-sm shadow-hung transition-colors'
    : 'absolute top-sm left-sm bg-bg/90 hover:bg-bg text-ink rounded-sm p-sm shadow-hung transition-colors'

  return (
    <button
      type="button"
      onClick={handleClick}
      aria-label={active ? 'Remove from favorites' : 'Add to favorites'}
      className={iconClasses}
    >
      <Heart size={16} fill={active ? 'currentColor' : 'none'} className={active ? 'text-accent-2' : ''} />
    </button>
  )
}
