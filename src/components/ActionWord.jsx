import { useState, useEffect } from 'react'

const ACTION_WORDS = {
  thwip: 'THWIP!',
  pow: 'POW!',
  amazing: 'AMAZING!',
  zap: 'ZAP!',
  wham: 'WHAM!',
  correct: 'CORRECT!',
  great: 'GREAT!',
  super: 'SUPER!',
}

export default function ActionWord({ type, show, position }) {
  const [visible, setVisible] = useState(false)
  const [fadeOut, setFadeOut] = useState(false)

  useEffect(() => {
    if (show) {
      setVisible(true)
      setFadeOut(false)
      const timer = setTimeout(() => {
        setFadeOut(true)
        setTimeout(() => setVisible(false), 500)
      }, 1200)
      return () => clearTimeout(timer)
    }
  }, [show])

  if (!visible) return null

  const word = ACTION_WORDS[type] || type?.toUpperCase() || 'THWIP!'
  const pos = position || { top: '20%', right: '10%' }

  return (
    <div
      className={`action-word action-word--${type || 'thwip'}`}
      style={{
        ...pos,
        animation: fadeOut
          ? 'actionFadeOut 0.5s ease forwards'
          : 'actionPop 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards',
      }}
    >
      {word}
    </div>
  )
}
