import { useState, useCallback } from 'react'
import ComicNav from '../components/ComicNav'
import SpiderManSpeech from '../components/SpiderManSpeech'
import ComicPanel from '../components/ComicPanel'
import { getMaleVoice } from '../utils/tts'

const WORD_PAIRS = [
  { word: 'Big', opposite: 'Small', colorA: '--spidey-red', colorB: '--spidey-blue' },
  { word: 'Hot', opposite: 'Cold', colorA: '--spidey-red', colorB: '--spidey-blue' },
  { word: 'Fast', opposite: 'Slow', colorA: '--spidey-red', colorB: '--spidey-blue' },
  { word: 'Happy', opposite: 'Sad', colorA: '--spidey-red', colorB: '--spidey-blue' },
  { word: 'Near', opposite: 'Far', colorA: '--spidey-red', colorB: '--spidey-blue' },
  { word: 'Give', opposite: 'Take', colorA: '--spidey-red', colorB: '--spidey-blue' },
  { word: 'Brave', opposite: 'Afraid', colorA: '--spidey-red', colorB: '--spidey-blue' },
  { word: 'Strong', opposite: 'Weak', colorA: '--spidey-red', colorB: '--spidey-blue' },
  { word: 'Kind', opposite: 'Mean', colorA: '--spidey-red', colorB: '--spidey-blue' },
  { word: 'Push', opposite: 'Pull', colorA: '--spidey-red', colorB: '--spidey-blue' },
]

export default function M2Ch2() {
  const [stage, setStage] = useState('intro') // intro, write, preview
  const [story, setStory] = useState('')
  const [usedPairs, setUsedPairs] = useState([])
  const [isSpeaking, setIsSpeaking] = useState(false)

  const detectPairs = useCallback((text) => {
    const lower = text.toLowerCase()
    const found = []
    WORD_PAIRS.forEach((pair) => {
      const hasWord = lower.includes(pair.word.toLowerCase())
      const hasOpposite = lower.includes(pair.opposite.toLowerCase())
      if (hasWord || hasOpposite) {
        found.push({ ...pair, hasBoth: hasWord && hasOpposite })
      }
    })
    return found
  }, [])

  const handleStoryChange = useCallback((e) => {
    const text = e.target.value
    setStory(text)
    setUsedPairs(detectPairs(text))
  }, [detectPairs])

  const readStory = useCallback(() => {
    if ('speechSynthesis' in window && story.trim()) {
      window.speechSynthesis.cancel()
      const utterance = new SpeechSynthesisUtterance(story)
      utterance.rate = 0.9
      utterance.pitch = 0.95

      const voice = getMaleVoice()
      if (voice) utterance.voice = voice

      utterance.onstart = () => setIsSpeaking(true)
      utterance.onend = () => setIsSpeaking(false)
      utterance.onerror = () => setIsSpeaking(false)
      window.speechSynthesis.speak(utterance)
    }
  }, [story])

  const stopReading = useCallback(() => {
    window.speechSynthesis.cancel()
    setIsSpeaking(false)
  }, [])

  const completePairs = usedPairs.filter(p => p.hasBoth)
  const isStoryGood = completePairs.length >= 2

  const renderHighlightedStory = useCallback(() => {
    if (!story.trim()) return null
    // Split text by word boundaries and highlight matching words
    const words = story.split(/(\s+)/)
    return words.map((word, i) => {
      const cleanWord = word.replace(/[^a-zA-Z]/g, '').toLowerCase()
      const isWordMatch = WORD_PAIRS.some(p => p.word.toLowerCase() === cleanWord)
      const isOppMatch = WORD_PAIRS.some(p => p.opposite.toLowerCase() === cleanWord)

      if (isWordMatch) {
        return <span key={i} className="highlight-word highlight-word--red">{word}</span>
      }
      if (isOppMatch) {
        return <span key={i} className="highlight-word highlight-word--blue">{word}</span>
      }
      return <span key={i}>{word}</span>
    })
  }, [story])

  return (
    <div className="page-container">
      <ComicNav />

      {/* Chapter Header */}
      <ComicPanel variant="blue" className="mb-xl">
        <div className="text-center">
          <span style={{
            fontFamily: 'var(--font-heading)',
            fontSize: '0.9rem',
            letterSpacing: '2px',
            color: 'var(--spidey-blue)',
            background: 'rgba(43,55,132,0.1)',
            padding: '4px 12px',
            borderRadius: '6px'
          }}>MODULE 2 — CHAPTER 2</span>
          <h1 className="comic-title" style={{ fontSize: '2.5rem', margin: '8px 0', color: 'var(--spidey-blue)', textShadow: '3px 3px 0 rgba(226,54,54,0.3)' }}>
            Speak & Create
          </h1>
          <p className="comic-text">Create your own mini story using opposite words!</p>
        </div>
      </ComicPanel>

      {stage === 'intro' && (
        <>
          <SpiderManSpeech
            text="Now it's YOUR turn to be the storyteller, young hero! I want you to write your own mini story using at least 2 pairs of opposite words. Pick words from the word bank below and weave them into an exciting tale! Maybe a hero fights a villain, or a brave mouse meets an afraid cat — the sky's the limit! Remember, use at least 2 OPPOSITE PAIRS in your story."
            image="/spidey_storyteller.png"
            imageAlt="Spider Hero encouraging creativity"
            autoSpeak={false}
          />
          <div className="text-center mt-lg">
            <button
              className="comic-btn comic-btn--primary"
              onClick={() => setStage('write')}
              id="start-writing-btn"
            >
              Start Creating!
            </button>
          </div>
        </>
      )}

      {(stage === 'write' || stage === 'preview') && (
        <>
          {/* Word Bank */}
          <ComicPanel className="mb-lg">
            <h3 className="comic-subtitle mb-md" style={{ fontSize: '1.3rem', textAlign: 'center' }}>
              Word Bank — Pick Your Opposite Pairs
            </h3>
            <div className="word-bank" style={{ justifyContent: 'center' }}>
              {WORD_PAIRS.map((pair, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <span
                    className={`word-chip word-chip--red ${usedPairs.some(p => p.word === pair.word && p.hasBoth) ? '' : ''}`}
                    onClick={() => {
                      setStory(prev => prev + (prev ? ' ' : '') + pair.word)
                      setUsedPairs(detectPairs(story + ' ' + pair.word))
                    }}
                    style={{ cursor: 'pointer' }}
                  >
                    {pair.word}
                  </span>
                  <span style={{ fontFamily: 'var(--font-heading)', color: 'var(--border-color)', fontSize: '0.8rem' }}>↔</span>
                  <span
                    className="word-chip word-chip--blue"
                    onClick={() => {
                      setStory(prev => prev + (prev ? ' ' : '') + pair.opposite)
                      setUsedPairs(detectPairs(story + ' ' + pair.opposite))
                    }}
                    style={{ cursor: 'pointer' }}
                  >
                    {pair.opposite}
                  </span>
                </div>
              ))}
            </div>
          </ComicPanel>

          {/* Writing Area */}
          <ComicPanel className="mb-lg" style={{ background: 'var(--bg-panel-alt)' }}>
            <h3 className="comic-subtitle mb-md" style={{ fontSize: '1.3rem' }}>
              Your Story
            </h3>
            <textarea
              className="comic-textarea"
              value={story}
              onChange={handleStoryChange}
              placeholder="Once upon a time, a big hero and a small villain..."
              rows={6}
              id="story-textarea"
            />

            {/* Live pair tracker */}
            <div style={{ marginTop: '16px' }}>
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '8px'
              }}>
                <span className="comic-text" style={{ fontSize: '0.95rem' }}>
                  Opposite pairs used:
                </span>
                <span style={{
                  fontFamily: 'var(--font-heading)',
                  fontSize: '1.1rem',
                  letterSpacing: '1px',
                  color: isStoryGood ? 'var(--correct-green)' : 'var(--wrong-red)',
                }}>
                  {completePairs.length} / 2 minimum
                </span>
              </div>
              <div className="web-progress" style={{ height: '14px' }}>
                <div
                  className="web-progress__fill"
                  style={{
                    width: `${Math.min((completePairs.length / 2) * 100, 100)}%`,
                    background: isStoryGood
                      ? 'var(--correct-green)'
                      : 'linear-gradient(90deg, var(--spidey-red), var(--spidey-blue))',
                  }}
                />
              </div>
              {completePairs.length > 0 && (
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginTop: '8px' }}>
                  {completePairs.map((pair, i) => (
                    <span key={i} style={{
                      padding: '4px 10px',
                      background: 'var(--correct-green)',
                      color: 'white',
                      borderRadius: '6px',
                      fontFamily: 'var(--font-heading)',
                      fontSize: '0.8rem',
                      letterSpacing: '1px',
                    }}>
                      {pair.word} ↔ {pair.opposite}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </ComicPanel>

          {/* Action Buttons */}
          <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <button
              className={`comic-btn ${isSpeaking ? 'comic-btn--primary' : 'comic-btn--secondary'}`}
              onClick={isSpeaking ? stopReading : readStory}
              disabled={!story.trim()}
              id="read-story-btn"
              style={{ opacity: story.trim() ? 1 : 0.5 }}
            >
              <SpeakerIcon /> {isSpeaking ? 'Stop Reading' : 'Read My Story!'}
            </button>
            {story.trim() && (
              <button
                className="comic-btn comic-btn--primary"
                onClick={() => setStage('preview')}
                id="preview-story-btn"
              >
                Preview My Story
              </button>
            )}
          </div>

          {/* Preview */}
          {stage === 'preview' && story.trim() && (
            <div style={{ marginTop: '24px' }}>
              <SpiderManSpeech
                text={
                  isStoryGood
                    ? `WOW! What an AMAZING story! You used ${completePairs.length} opposite pairs! You're a true creative hero! Your vocabulary skills are SPECTACULAR!`
                    : `Great start, hero! Try adding a few more opposite word pairs to make your story even more AMAZING! You need at least 2 complete pairs.`
                }
                image={isStoryGood ? '/spidey_teacher.png' : '/spidey_thinking.png'}
                imageAlt="Spider Hero reviewing your story"
                autoSpeak={false}
              />

              <ComicPanel style={{ marginTop: '16px', background: 'var(--bg-panel-alt)' }}>
                <h3 className="comic-subtitle mb-md text-center" style={{ color: 'var(--spidey-red)' }}>
                  Your Story with Highlighted Opposites
                </h3>
                <div className="story-panel__text" style={{
                  fontSize: '1.3rem',
                  lineHeight: 2,
                  textAlign: 'center',
                  padding: '8px 16px',
                }}>
                  {renderHighlightedStory()}
                </div>

                {isStoryGood && (
                  <div className="text-center" style={{ marginTop: '20px' }}>
                    <div className="score-display" style={{ display: 'inline-block' }}>
                      STORY COMPLETE! {completePairs.length} OPPOSITE PAIRS USED!
                    </div>
                  </div>
                )}
              </ComicPanel>
            </div>
          )}
        </>
      )}
    </div>
  )
}

function SpeakerIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
      <polygon points="11,5 6,9 2,9 2,15 6,15 11,19" fill="currentColor" />
      <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
      <path d="M19.07 4.93a10 10 0 0 1 0 14.14" />
    </svg>
  )
}
