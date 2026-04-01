import { Link } from 'react-router-dom'
import { useState, useCallback } from 'react'

export default function ComicNav() {
  const [isFullscreen, setIsFullscreen] = useState(false)

  const toggleFullscreen = useCallback(() => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen()
      setIsFullscreen(true)
    } else {
      document.exitFullscreen()
      setIsFullscreen(false)
    }
  }, [])

  return (
    <nav className="comic-nav">
      <Link to="/" className="comic-nav__logo" id="nav-home-link">
        <WebIcon />
        SPIDER HERO ACADEMY
      </Link>
      <button
        onClick={toggleFullscreen}
        id="fullscreen-btn"
        title={isFullscreen ? 'Exit Fullscreen' : 'Enter Fullscreen'}
        style={{
          background: 'rgba(255,255,255,0.1)',
          border: '2px solid rgba(255,255,255,0.5)',
          borderRadius: '8px',
          padding: '8px 12px',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          color: 'white',
          fontFamily: 'var(--font-heading)',
          fontSize: '0.85rem',
          letterSpacing: '1px',
          transition: 'all 0.2s ease',
          boxShadow: '2px 2px 0 rgba(0,0,0,0.3)',
        }}
        onMouseEnter={e => {
          e.currentTarget.style.background = 'rgba(226,54,54,0.6)'
          e.currentTarget.style.borderColor = 'var(--spidey-red)'
        }}
        onMouseLeave={e => {
          e.currentTarget.style.background = 'rgba(255,255,255,0.1)'
          e.currentTarget.style.borderColor = 'rgba(255,255,255,0.5)'
        }}
      >
        {isFullscreen ? <ExitFullscreenIcon /> : <FullscreenIcon />}
        {isFullscreen ? 'EXIT' : 'FULLSCREEN'}
      </button>
    </nav>
  )
}

function WebIcon() {
  return (
    <svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="14" cy="14" r="13" stroke="currentColor" strokeWidth="2" />
      <circle cx="14" cy="14" r="7" stroke="currentColor" strokeWidth="1.5" />
      <circle cx="14" cy="14" r="2" fill="currentColor" />
      <line x1="14" y1="1" x2="14" y2="27" stroke="currentColor" strokeWidth="1.2" />
      <line x1="1" y1="14" x2="27" y2="14" stroke="currentColor" strokeWidth="1.2" />
      <line x1="4" y1="4" x2="24" y2="24" stroke="currentColor" strokeWidth="1.2" />
      <line x1="24" y1="4" x2="4" y2="24" stroke="currentColor" strokeWidth="1.2" />
    </svg>
  )
}

function FullscreenIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="15,3 21,3 21,9" />
      <polyline points="9,21 3,21 3,15" />
      <line x1="21" y1="3" x2="14" y2="10" />
      <line x1="3" y1="21" x2="10" y2="14" />
    </svg>
  )
}

function ExitFullscreenIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="4,14 10,14 10,20" />
      <polyline points="20,10 14,10 14,4" />
      <line x1="14" y1="10" x2="21" y2="3" />
      <line x1="3" y1="21" x2="10" y2="14" />
    </svg>
  )
}

