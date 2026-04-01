import { useState, useCallback } from 'react'
import ComicNav from '../components/ComicNav'
import SpiderManSpeech from '../components/SpiderManSpeech'
import ComicPanel from '../components/ComicPanel'
import ActionWord from '../components/ActionWord'
import CustomVideoPlayer from '../components/CustomVideoPlayer'
import { speakText } from '../utils/tts'

const ANTONYM_PAIRS = [
  { word: 'Near', answer: 'Far' },
  { word: 'Above', answer: 'Below' },
  { word: 'Inside', answer: 'Outside' },
  { word: 'Start', answer: 'Finish' },
  { word: 'Give', answer: 'Take' },
  { word: 'Buy', answer: 'Sell' },
  { word: 'Push', answer: 'Pull' },
  { word: 'Laugh', answer: 'Cry' },
  { word: 'Kind', answer: 'Mean' },
  { word: 'Brave', answer: 'Afraid' },
  { word: 'Strong', answer: 'Weak' },
  { word: 'Rich', answer: 'Poor' },
  { word: 'Easy', answer: 'Difficult' },
  { word: 'Right', answer: 'Wrong' },
]

export default function M1Ch2() {
  const [answers, setAnswers] = useState(Array(ANTONYM_PAIRS.length).fill(''))
  const [results, setResults] = useState(Array(ANTONYM_PAIRS.length).fill(null)) // null, 'correct', 'wrong'
  const [showAction, setShowAction] = useState(false)
  const [actionType, setActionType] = useState('thwip')
  const [actionPos, setActionPos] = useState({ top: '0', right: '0' })
  const [score, setScore] = useState(null)
  const [stage, setStage] = useState('intro') // intro, quiz, results

  const handleInputChange = useCallback((index, value) => {
    setAnswers(prev => {
      const next = [...prev]
      next[index] = value
      return next
    })
    // Reset result for this index when typing
    setResults(prev => {
      const next = [...prev]
      next[index] = null
      return next
    })
  }, [])

  const checkAnswer = useCallback((index) => {
    const userAnswer = answers[index].trim().toLowerCase()
    const correctAnswer = ANTONYM_PAIRS[index].answer.toLowerCase()
    const isCorrect = userAnswer === correctAnswer

    setResults(prev => {
      const next = [...prev]
      next[index] = isCorrect ? 'correct' : 'wrong'
      return next
    })

    // Show action word
    setActionType(isCorrect ? 'amazing' : 'zap')
    setActionPos({ top: `${50 + index * 2}px`, right: '20px' })
    setShowAction(true)
    setTimeout(() => setShowAction(false), 1500)

    // TTS feedback
    const msg = isCorrect
      ? `Great job! ${ANTONYM_PAIRS[index].word} and ${ANTONYM_PAIRS[index].answer} are opposites!`
      : `Not quite! Try again, hero!`
    speakText(msg)

    if (isCorrect) {
      // Auto-fill correct answer
      setAnswers(prev => {
        const next = [...prev]
        next[index] = ANTONYM_PAIRS[index].answer
        return next
      })
    }
  }, [answers])

  const handleSubmitAll = useCallback(() => {
    let correctCount = 0
    const newResults = ANTONYM_PAIRS.map((pair, i) => {
      const isCorrect = answers[i].trim().toLowerCase() === pair.answer.toLowerCase()
      if (isCorrect) correctCount++
      return isCorrect ? 'correct' : 'wrong'
    })
    setResults(newResults)
    setScore(correctCount)

    setStage('results')
  }, [answers])

  const handleKeyDown = useCallback((e, index) => {
    if (e.key === 'Enter') {
      checkAnswer(index)
    }
  }, [checkAnswer])

  const correctCount = results.filter(r => r === 'correct').length

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
          }}>MODULE 1 — CHAPTER 2</span>
          <h1 className="comic-title" style={{ fontSize: '2.5rem', margin: '8px 0' }}>
            Match the Opposites
          </h1>
          <p className="comic-text">Fill in the blank with the correct opposite word!</p>
        </div>
      </ComicPanel>

      {/* Video Redirect */}
      <ComicPanel className="mb-lg" style={{ textAlign: 'center' }}>
        <p className="comic-text mb-md">Watch this video to learn more about antonyms:</p>
        <div style={{ padding: '20px 0' }}>
          <a
            href="https://youtu.be/bsqRLqXvIfU"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '10px',
              padding: '15px 30px',
              backgroundColor: '#FF0000', // YouTube Red
              color: 'white',
              fontFamily: 'var(--font-heading)',
              fontSize: '1.2rem',
              letterSpacing: '1px',
              textDecoration: 'none',
              borderRadius: '50px',
              border: '3px solid white',
              boxShadow: '4px 4px 0 var(--border-color)',
              transition: 'transform 0.2s',
            }}
            onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
            onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
              <polygon points="5 3 19 12 5 21 5 3"></polygon>
            </svg>
            WATCH ON YOUTUBE
          </a>
          <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.9rem', marginTop: '15px', color: '#666' }}>
            (Opens in a new tab)
          </p>
        </div>
      </ComicPanel>

      {stage === 'intro' && (
        <>
          <SpiderManSpeech
            text="Time for a real challenge, hero! The villains have scrambled all the opposite words! For each word I show you, type in the correct OPPOSITE. Think carefully! If you get stuck, press ENTER to check your answer. Ready? Let's go!"
            image="/spidey_teacher.png"
            imageAlt="Spider Hero explaining the challenge"
            autoSpeak={false}
          />
          <div className="text-center mt-lg mb-lg">
            <button
              className="comic-btn comic-btn--primary"
              onClick={() => setStage('quiz')}
              id="start-quiz-btn"
            >
              Start the Challenge!
            </button>
          </div>
        </>
      )}

      {(stage === 'quiz' || stage === 'results') && (
        <>
          {/* Progress */}
          <div className="mb-lg">
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
              <span className="comic-text" style={{ color: 'white' }}>
                {correctCount} of {ANTONYM_PAIRS.length} correct
              </span>
            </div>
            <div className="web-progress">
              <div
                className="web-progress__fill"
                style={{ width: `${(correctCount / ANTONYM_PAIRS.length) * 100}%` }}
              />
            </div>
          </div>

          {/* Action word */}
          <div style={{ position: 'relative' }}>
            <ActionWord type={actionType} show={showAction} position={actionPos} />
          </div>

          {/* Quiz Rows */}
          <div className="flex-col gap-md mb-xl">
            {ANTONYM_PAIRS.map((pair, i) => (
              <div
                key={i}
                className={`quiz-row ${results[i] === 'correct' ? 'quiz-row--correct' : ''} ${results[i] === 'wrong' ? 'quiz-row--wrong' : ''}`}
                id={`quiz-row-${i}`}
              >
                <span className="quiz-row__word">{pair.word}</span>
                <span className="quiz-row__dash">—</span>
                <div className="quiz-row__input">
                  <input
                    type="text"
                    className={`comic-input ${results[i] === 'correct' ? 'comic-input--correct' : ''} ${results[i] === 'wrong' ? 'comic-input--wrong' : ''}`}
                    value={answers[i]}
                    onChange={(e) => handleInputChange(i, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(e, i)}
                    placeholder="Type the opposite..."
                    disabled={results[i] === 'correct' || stage === 'results'}
                    id={`quiz-input-${i}`}
                  />
                </div>
                <div className="quiz-row__status" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  {results[i] === 'correct' && <CheckIcon />}
                  {results[i] === 'wrong' && (
                    <>
                      <CrossIcon />
                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px',
                        background: 'rgba(76, 175, 80, 0.2)',
                        padding: '4px 8px',
                        borderRadius: '6px',
                        border: '2px solid var(--success-color)'
                      }}>
                        <span style={{
                          color: 'var(--success-color)',
                          fontFamily: 'var(--font-heading)',
                          fontSize: '1.2rem',
                          textTransform: 'uppercase'
                        }}>
                          {pair.answer}
                        </span>
                        <CheckIcon />
                      </div>
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Submit Button */}
          {stage === 'quiz' && (
            <div className="text-center mb-lg">
              <button
                className="comic-btn comic-btn--primary"
                onClick={handleSubmitAll}
                id="submit-all-btn"
              >
                Check All Answers!
              </button>
            </div>
          )}

          {/* Results */}
          {stage === 'results' && (
            <div className="text-center">
              <SpiderManSpeech
                text={
                  score === ANTONYM_PAIRS.length
                    ? "SPECTACULAR! You got every single one right! You're a true Antonym Hero! The villains don't stand a chance against your vocabulary!"
                    : score >= ANTONYM_PAIRS.length * 0.7
                    ? `Great work, hero! You got ${score} out of ${ANTONYM_PAIRS.length}! That's impressive! The correct answers are filled in for you. Review them and you'll be unstoppable!`
                    : `Good try, young hero! You got ${score} out of ${ANTONYM_PAIRS.length}. Don't worry — even heroes need practice! The correct answers are shown above. Study them and try again!`
                }
                image={score === ANTONYM_PAIRS.length ? '/spidey_teacher.png' : '/spidey_thinking.png'}
                imageAlt="Spider Hero giving feedback"
                autoSpeak={false}
              />
              <div className="score-display" style={{ display: 'inline-block', marginTop: '16px' }}>
                SCORE: {score} / {ANTONYM_PAIRS.length}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  )
}

function CheckIcon() {
  return (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="var(--correct-green)" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20,6 9,17 4,12" />
    </svg>
  )
}

function CrossIcon() {
  return (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="var(--wrong-red)" strokeWidth="3" strokeLinecap="round">
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  )
}

function PlayIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="white">
      <polygon points="5,3 19,12 5,21" />
    </svg>
  )
}
