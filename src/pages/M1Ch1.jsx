import { useState, useCallback } from 'react'
import ComicNav from '../components/ComicNav'
import SpiderManSpeech from '../components/SpiderManSpeech'
import ComicPanel from '../components/ComicPanel'
import ActionWord from '../components/ActionWord'
import { speakText } from '../utils/tts'

const FLASHCARD_PAIRS = [
  { word: 'HOT', opposite: 'COLD' },
  { word: 'BIG', opposite: 'SMALL' },
  { word: 'FAST', opposite: 'SLOW' },
  { word: 'HAPPY', opposite: 'SAD' },
  { word: 'UP', opposite: 'DOWN' },
  { word: 'LIGHT', opposite: 'DARK' },
]

export default function M1Ch1() {
  const [currentCard, setCurrentCard] = useState(0)
  const [flipped, setFlipped] = useState(false)
  const [showAction, setShowAction] = useState(false)
  const [completed, setCompleted] = useState([])
  const [stage, setStage] = useState('intro') // intro, game, done

  const handleFlip = useCallback(() => {
    if (!flipped) {
      setFlipped(true)
      setShowAction(true)
      setTimeout(() => setShowAction(false), 1500)
      setCompleted(prev => [...prev, currentCard])

      // Auto-speak the opposite
      setTimeout(() => {
        speakText(
          `${FLASHCARD_PAIRS[currentCard].word} is the opposite of ${FLASHCARD_PAIRS[currentCard].opposite}!`
        )
      }, 600)
    }
  }, [flipped, currentCard])

  const handleNext = useCallback(() => {
    if (currentCard < FLASHCARD_PAIRS.length - 1) {
      setCurrentCard(prev => prev + 1)
      setFlipped(false)
    } else {
      setStage('done')
    }
  }, [currentCard])

  const pair = FLASHCARD_PAIRS[currentCard]

  return (
    <div className="page-container">
      <ComicNav />

      {/* Chapter Header */}
      <ComicPanel variant="red" className="mb-xl">
        <div className="text-center">
          <span style={{
            fontFamily: 'var(--font-heading)',
            fontSize: '0.9rem',
            letterSpacing: '2px',
            color: 'var(--spidey-red)',
            background: 'rgba(226,54,54,0.1)',
            padding: '4px 12px',
            borderRadius: '6px'
          }}>MODULE 1 — CHAPTER 1</span>
          <h1 className="comic-title" style={{ fontSize: '2.5rem', margin: '8px 0' }}>
            Discover Opposites
          </h1>
          <p className="comic-text">Learn what opposite words are through a fun flashcard game!</p>
        </div>
      </ComicPanel>

      {stage === 'intro' && (
        <>
          <SpiderManSpeech
            text="Alright, young hero! Let me tell you about OPPOSITES! Opposite words — or ANTONYMS — are words that mean the complete reverse of each other. Like HOT and COLD, or BIG and SMALL! When I say a word, think about what means the OPPOSITE. Ready? Let's play the flashcard game!"
            image="/spidey_teacher.png"
            imageAlt="Spider Hero teaching"
            autoSpeak={false}
          />
          <div className="text-center mt-lg">
            <button
              className="comic-btn comic-btn--primary"
              onClick={() => setStage('game')}
              id="start-game-btn"
            >
              Let's Start!
            </button>
          </div>
        </>
      )}

      {stage === 'game' && (
        <>
          {/* Progress */}
          <div className="mb-lg">
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
              <span className="comic-text" style={{ color: 'white' }}>
                Card {currentCard + 1} of {FLASHCARD_PAIRS.length}
              </span>
              <span className="comic-text" style={{ color: 'var(--action-yellow)' }}>
                {completed.length} discovered!
              </span>
            </div>
            <div className="web-progress">
              <div
                className="web-progress__fill"
                style={{ width: `${((currentCard + (flipped ? 1 : 0)) / FLASHCARD_PAIRS.length) * 100}%` }}
              />
            </div>
          </div>

          {/* Flashcard */}
          <div style={{ position: 'relative', maxWidth: '500px', margin: '0 auto' }}>
            <ActionWord type="thwip" show={showAction} position={{ top: '-30px', right: '-20px' }} />

            <div
              className={`flashcard ${flipped ? 'flashcard--flipped' : ''}`}
              onClick={handleFlip}
              id={`flashcard-${currentCard}`}
              style={{ marginBottom: 'var(--space-lg)' }}
            >
              <div className="flashcard__inner">
                <div className="flashcard__front">
                  <div className="text-center">
                    <div style={{
                      fontFamily: 'var(--font-body)',
                      fontSize: '0.9rem',
                      opacity: 0.8,
                      marginBottom: '8px',
                      fontWeight: 700
                    }}>
                      TAP TO REVEAL THE OPPOSITE!
                    </div>
                    <div className="flashcard__word">{pair.word}</div>
                  </div>
                </div>
                <div className="flashcard__back">
                  <div className="text-center">
                    <div style={{
                      fontFamily: 'var(--font-body)',
                      fontSize: '0.9rem',
                      opacity: 0.8,
                      marginBottom: '8px',
                      fontWeight: 700
                    }}>
                      THE OPPOSITE IS:
                    </div>
                    <div className="flashcard__word">{pair.opposite}</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Info under card */}
            {!flipped && (
              <div className="text-center">
                <p className="comic-text" style={{ color: 'rgba(255,255,255,0.7)' }}>
                  What is the opposite of <span style={{ color: 'var(--spidey-red)', fontFamily: 'var(--font-heading)', fontSize: '1.3em' }}>{pair.word}</span>?
                </p>
                <p style={{ color: 'rgba(255,255,255,0.5)', fontFamily: 'var(--font-body)', fontWeight: 700, marginTop: '4px' }}>
                  Click the card to find out!
                </p>
              </div>
            )}

            {flipped && (
              <div className="text-center flex-col gap-md" style={{ alignItems: 'center' }}>
                <ComicPanel style={{ display: 'inline-block', padding: '12px 24px' }}>
                  <span className="highlight-word highlight-word--red">{pair.word}</span>
                  {' '}<span className="comic-text" style={{ fontSize: '1.4rem' }}>is the opposite of</span>{' '}
                  <span className="highlight-word highlight-word--blue">{pair.opposite}</span>
                </ComicPanel>
                <button
                  className="comic-btn comic-btn--secondary"
                  onClick={handleNext}
                  id="next-card-btn"
                >
                  {currentCard < FLASHCARD_PAIRS.length - 1 ? 'Next Card' : 'Finish!'}
                </button>
              </div>
            )}
          </div>

          {/* Completed pairs */}
          {completed.length > 0 && (
            <div className="mt-lg">
              <p className="comic-text mb-sm" style={{ color: 'var(--action-yellow)' }}>Pairs Discovered:</p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                {completed.map(idx => (
                  <div key={idx} style={{
                    padding: '6px 12px',
                    background: 'rgba(255,255,255,0.1)',
                    borderRadius: '8px',
                    border: '2px solid rgba(255,255,255,0.2)',
                    fontFamily: 'var(--font-heading)',
                    color: 'white',
                    fontSize: '0.9rem',
                    letterSpacing: '1px'
                  }}>
                    {FLASHCARD_PAIRS[idx].word} ↔ {FLASHCARD_PAIRS[idx].opposite}
                  </div>
                ))}
              </div>
            </div>
          )}
        </>
      )}

      {stage === 'done' && (
        <div className="text-center">
          <SpiderManSpeech
            text="AMAZING JOB, young hero! You've discovered all the opposite pairs! You now know what ANTONYMS are — words that mean the complete opposite of each other! You're ready for the next challenge! Swing over to Chapter 2 to match even more opposites!"
            image="/spidey_teacher.png"
            imageAlt="Spider Hero celebrating"
            autoSpeak={false}
          />
          <div className="score-display mb-lg" style={{ display: 'inline-block' }}>
            ALL {FLASHCARD_PAIRS.length} PAIRS DISCOVERED!
          </div>
          <div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', justifyContent: 'center', marginTop: '16px' }}>
              {FLASHCARD_PAIRS.map((p, i) => (
                <ComicPanel key={i} style={{ padding: '10px 16px', display: 'inline-block' }}>
                  <span className="highlight-word highlight-word--red">{p.word}</span>
                  {' ↔ '}
                  <span className="highlight-word highlight-word--blue">{p.opposite}</span>
                </ComicPanel>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
