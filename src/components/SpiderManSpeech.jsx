import { useState, useEffect, useRef, useCallback } from 'react'
import { getMaleVoice } from '../utils/tts'

export default function SpiderManSpeech({ text, image, imageAlt, reverse, autoSpeak, onSpeakEnd }) {
  const [isSpeaking, setIsSpeaking] = useState(false)
  const [displayedText, setDisplayedText] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const utteranceRef = useRef(null)
  const typingRef = useRef(null)

  const typeText = useCallback((fullText) => {
    setIsTyping(true)
    setDisplayedText('')
    let i = 0
    clearInterval(typingRef.current)
    typingRef.current = setInterval(() => {
      if (i < fullText.length) {
        setDisplayedText(fullText.slice(0, i + 1))
        i++
      } else {
        clearInterval(typingRef.current)
        setIsTyping(false)
      }
    }, 25)
  }, [])

  const speak = useCallback(() => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel()
      const utterance = new SpeechSynthesisUtterance(text)
      utterance.rate = 0.9
      utterance.pitch = 0.95
      utterance.volume = 1

      const voice = getMaleVoice()
      if (voice) utterance.voice = voice

      utterance.onstart = () => setIsSpeaking(true)
      utterance.onend = () => {
        setIsSpeaking(false)
        onSpeakEnd?.()
      }
      utterance.onerror = () => setIsSpeaking(false)
      utteranceRef.current = utterance
      window.speechSynthesis.speak(utterance)
    }
  }, [text, onSpeakEnd])

  const stopSpeaking = useCallback(() => {
    window.speechSynthesis.cancel()
    setIsSpeaking(false)
  }, [])

  useEffect(() => {
    typeText(text)
    if (autoSpeak) {
      const timer = setTimeout(() => speak(), 300)
      return () => clearTimeout(timer)
    }
    return () => {
      clearInterval(typingRef.current)
      window.speechSynthesis.cancel()
    }
  }, [text, autoSpeak, speak, typeText])

  useEffect(() => {
    return () => {
      clearInterval(typingRef.current)
      window.speechSynthesis.cancel()
    }
  }, [])

  return (
    <div className={`spidey-dialogue ${reverse ? 'spidey-dialogue--reverse' : ''}`}>
      <div>
        <img
          src={image || '/spidey_teacher.png'}
          alt={imageAlt || 'Spider Hero'}
          className="spidey-img"
        />
      </div>
      <div className="spidey-dialogue__bubble flex-col gap-sm">
        <div className={`speech-bubble ${reverse ? 'speech-bubble--right' : ''}`}>
          {displayedText}
          {isTyping && <span className="typing-cursor">|</span>}
        </div>
        <div className="tts-controls">
          <button
            className={`tts-btn ${isSpeaking ? 'tts-btn--speaking' : ''}`}
            onClick={isSpeaking ? stopSpeaking : speak}
            title={isSpeaking ? 'Stop speaking' : 'Listen'}
            id="tts-play-btn"
          >
            {isSpeaking ? '■' : '▶'}
          </button>
          <span style={{ fontFamily: 'var(--font-body)', fontWeight: 700, color: 'white', fontSize: '0.85rem' }}>
            {isSpeaking ? 'Speaking...' : 'Click to listen!'}
          </span>
        </div>
      </div>
    </div>
  )
}
