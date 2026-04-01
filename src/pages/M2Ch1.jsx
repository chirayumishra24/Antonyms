import { useState, useCallback } from 'react'
import ComicNav from '../components/ComicNav'
import SpiderManSpeech from '../components/SpiderManSpeech'
import ComicPanel from '../components/ComicPanel'
import ActionWord from '../components/ActionWord'
import { speakText } from '../utils/tts'

const STORY_PANELS = [
  {
    text: 'One day, a {big} elephant and a {small} mouse went to the park.',
    antonyms: ['big', 'small'],
  },
  {
    text: 'The elephant was very {big}, but the mouse was very {small}.',
    antonyms: ['big', 'small'],
  },
  {
    text: 'The sun was {hot}, so they sat under a tree.',
    antonyms: ['hot'],
  },
  {
    text: 'Then they ate ice cream because it was {cold} and yummy!',
    antonyms: ['cold'],
  },
  {
    text: 'The rabbit ran {fast}, but the turtle walked {slowly}.',
    antonyms: ['fast', 'slowly'],
  },
  {
    text: 'Everyone was {happy} and had fun.',
    antonyms: ['happy'],
  },
]

const STORY_FULL_TEXT = `One day, a big elephant and a small mouse went to the park. The elephant was very big, but the mouse was very small. The sun was hot, so they sat under a tree. Then they ate ice cream because it was cold and yummy! The rabbit ran fast, but the turtle walked slowly. Everyone was happy and had fun.`

const QUIZ_QUESTIONS = [
  {
    question: 'What is the opposite of BIG in the story?',
    options: ['Tall', 'Small', 'Large', 'Thin'],
    correct: 1,
  },
  {
    question: 'What is the opposite of HOT in the story?',
    options: ['Warm', 'Cool', 'Cold', 'Mild'],
    correct: 2,
  },
  {
    question: 'What is the opposite of FAST in the story?',
    options: ['Quick', 'Slowly', 'Running', 'Walking'],
    correct: 1,
  },
  {
    question: 'The elephant was big. The mouse was ___.',
    options: ['Tiny', 'Small', 'Short', 'Little'],
    correct: 1,
  },
]

export default function M2Ch1() {
  const [stage, setStage] = useState('intro') // intro, story, quiz, done
  const [currentPanel, setCurrentPanel] = useState(0)
  const [quizIndex, setQuizIndex] = useState(0)
  const [quizResults, setQuizResults] = useState([])
  const [selectedAnswer, setSelectedAnswer] = useState(null)
  const [showAction, setShowAction] = useState(false)
  const [actionType, setActionType] = useState('amazing')

  const handleStoryNext = useCallback(() => {
    if (currentPanel < STORY_PANELS.length - 1) {
      setCurrentPanel(prev => prev + 1)
    } else {
      setStage('quiz')
    }
  }, [currentPanel])

  const handleAnswer = useCallback((optionIndex) => {
    if (selectedAnswer !== null) return
    setSelectedAnswer(optionIndex)
    const isCorrect = optionIndex === QUIZ_QUESTIONS[quizIndex].correct

    setQuizResults(prev => [...prev, isCorrect])

    setActionType(isCorrect ? 'amazing' : 'zap')
    setShowAction(true)
    setTimeout(() => setShowAction(false), 1500)

    const msg = isCorrect ? 'Correct! Great job, hero!' : `Not quite. The answer is ${QUIZ_QUESTIONS[quizIndex].options[QUIZ_QUESTIONS[quizIndex].correct]}.`
    speakText(msg)

    setTimeout(() => {
      if (quizIndex < QUIZ_QUESTIONS.length - 1) {
        setQuizIndex(prev => prev + 1)
        setSelectedAnswer(null)
      } else {
        setStage('done')
      }
    }, 2000)
  }, [selectedAnswer, quizIndex])

  const renderStoryText = (text) => {
    const parts = text.split(/\{(\w+)\}/g)
    return parts.map((part, i) => {
      if (i % 2 === 1) {
        // This is an antonym word
        return (
          <span
            key={i}
            className={`highlight-word ${i % 4 === 1 ? 'highlight-word--red' : 'highlight-word--blue'}`}
          >
            {part.toUpperCase()}
          </span>
        )
      }
      return <span key={i}>{part}</span>
    })
  }

  const totalCorrect = quizResults.filter(Boolean).length

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
          }}>MODULE 2 — CHAPTER 1</span>
          <h1 className="comic-title" style={{ fontSize: '2.5rem', margin: '8px 0', color: 'var(--spidey-blue)', textShadow: '3px 3px 0 rgba(226,54,54,0.3)' }}>
            Listen & Learn Through Story
          </h1>
          <p className="comic-text">Hear a fun story and spot the opposite words!</p>
        </div>
      </ComicPanel>

      {stage === 'intro' && (
        <>
          <SpiderManSpeech
            text="Story time, young hero! I'm going to tell you a fun story called 'Big and Small Day'. Listen carefully and pay attention to the OPPOSITE WORDS! After the story, I'll quiz you to see how many you caught. Ready? Let's begin!"
            image="/spidey_storyteller.png"
            imageAlt="Spider Hero with a storybook"
            autoSpeak={false}
          />

          {/* Full Story Preview */}
          <ComicPanel className="mb-lg" style={{ background: 'var(--bg-panel-alt)' }}>
            <h2 className="comic-subtitle mb-md" style={{ color: 'var(--spidey-red)', textAlign: 'center' }}>
              "Big and Small Day"
            </h2>
            <div className="story-panel__text" style={{ textAlign: 'center', lineHeight: 2 }}>
              {STORY_PANELS.map((panel, i) => (
                <p key={i} style={{ marginBottom: '8px' }}>
                  {renderStoryText(panel.text)}
                </p>
              ))}
            </div>
          </ComicPanel>

          <div className="text-center mt-lg">
            <button
              className="comic-btn comic-btn--primary"
              onClick={() => {
                setStage('story')
                // Read the full story aloud
                speakText(STORY_FULL_TEXT, { rate: 0.85 })
              }}
              id="listen-story-btn"
            >
              Listen to the Story
            </button>
          </div>
        </>
      )}

      {stage === 'story' && (
        <>
          {/* Progress */}
          <div className="mb-lg">
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
              <span className="comic-text" style={{ color: 'white' }}>
                Panel {currentPanel + 1} of {STORY_PANELS.length}
              </span>
            </div>
            <div className="web-progress">
              <div
                className="web-progress__fill"
                style={{ width: `${((currentPanel + 1) / STORY_PANELS.length) * 100}%` }}
              />
            </div>
          </div>

          {/* Story Strip */}
          <div className="story-strip mb-xl">
            <div className="story-panel" style={{ minHeight: '150px' }}>
              <div className="story-panel__number">{currentPanel + 1}</div>
              <div className="story-panel__text" style={{ fontSize: '1.4rem', padding: '8px 0 8px 24px' }}>
                {renderStoryText(STORY_PANELS[currentPanel].text)}
              </div>
              <div style={{ marginTop: '12px', paddingLeft: '24px' }}>
                <span style={{
                  fontFamily: 'var(--font-heading)',
                  fontSize: '0.85rem',
                  letterSpacing: '1px',
                  color: 'var(--spidey-blue)',
                  opacity: 0.7
                }}>
                  OPPOSITE WORDS: {STORY_PANELS[currentPanel].antonyms.map(w => w.toUpperCase()).join(', ')}
                </span>
              </div>
            </div>
          </div>

          <div className="text-center">
            <button
              className="comic-btn comic-btn--secondary"
              onClick={handleStoryNext}
              id="next-panel-btn"
            >
              {currentPanel < STORY_PANELS.length - 1 ? 'Next Panel' : 'Take the Quiz!'}
            </button>
          </div>
        </>
      )}

      {stage === 'quiz' && (
        <>
          <SpiderManSpeech
            text="Now let's see how well you listened! Answer these questions about the opposite words in the story. Choose the correct answer!"
            image="/spidey_thinking.png"
            imageAlt="Spider Hero quizzing"
            autoSpeak={false}
          />

          <div style={{ position: 'relative' }}>
            <ActionWord type={actionType} show={showAction} position={{ top: '-20px', right: '40px' }} />
          </div>

          <ComicPanel className="mb-lg">
            <div style={{
              fontFamily: 'var(--font-heading)',
              fontSize: '0.9rem',
              letterSpacing: '2px',
              color: 'var(--spidey-blue)',
              marginBottom: '16px'
            }}>
              QUESTION {quizIndex + 1} OF {QUIZ_QUESTIONS.length}
            </div>
            <h3 className="comic-subtitle mb-lg" style={{ fontSize: '1.5rem' }}>
              {QUIZ_QUESTIONS[quizIndex].question}
            </h3>
            <div className="grid-2">
              {QUIZ_QUESTIONS[quizIndex].options.map((option, i) => {
                let btnClass = 'comic-btn comic-btn--ghost'
                let btnStyle = {
                  width: '100%',
                  justifyContent: 'center',
                  color: 'var(--border-color)',
                  borderColor: 'var(--border-color)',
                  background: 'white',
                  boxShadow: '3px 3px 0 var(--border-color)',
                }

                if (selectedAnswer !== null) {
                  if (i === QUIZ_QUESTIONS[quizIndex].correct) {
                    btnStyle.background = 'var(--correct-green)'
                    btnStyle.color = 'white'
                    btnStyle.borderColor = 'var(--correct-green)'
                  } else if (i === selectedAnswer && i !== QUIZ_QUESTIONS[quizIndex].correct) {
                    btnStyle.background = 'var(--wrong-red)'
                    btnStyle.color = 'white'
                    btnStyle.borderColor = 'var(--wrong-red)'
                  }
                }

                return (
                  <button
                    key={i}
                    className={btnClass}
                    style={btnStyle}
                    onClick={() => handleAnswer(i)}
                    disabled={selectedAnswer !== null}
                    id={`quiz-option-${i}`}
                  >
                    {option}
                  </button>
                )
              })}
            </div>
          </ComicPanel>

          {/* Progress dots */}
          <div className="text-center">
            <div style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}>
              {QUIZ_QUESTIONS.map((_, i) => (
                <div key={i} style={{
                  width: '14px',
                  height: '14px',
                  borderRadius: '50%',
                  border: '2px solid white',
                  background: i < quizResults.length
                    ? (quizResults[i] ? 'var(--correct-green)' : 'var(--wrong-red)')
                    : i === quizIndex
                    ? 'var(--action-yellow)'
                    : 'transparent',
                }} />
              ))}
            </div>
          </div>
        </>
      )}

      {stage === 'done' && (
        <div className="text-center">
          <SpiderManSpeech
            text={
              totalCorrect === QUIZ_QUESTIONS.length
                ? "PERFECT SCORE! You caught every single opposite word in the story! Your listening skills are AMAZING! You're truly a Spider Hero Academy star!"
                : totalCorrect >= QUIZ_QUESTIONS.length * 0.5
                ? `Nice work, hero! You got ${totalCorrect} out of ${QUIZ_QUESTIONS.length}! You've got great listening skills. Keep practicing and you'll master all the opposites!`
                : `Good try! You got ${totalCorrect} out of ${QUIZ_QUESTIONS.length}. Read the story again and try to spot all the opposite words. Every hero needs practice!`
            }
            image="/spidey_teacher.png"
            imageAlt="Spider Hero celebrating"
            autoSpeak={false}
          />
          <div className="score-display" style={{ display: 'inline-block', marginTop: '16px' }}>
            STORY QUIZ: {totalCorrect} / {QUIZ_QUESTIONS.length}
          </div>

          <div style={{ marginTop: '24px' }}>
            <ComicPanel style={{ textAlign: 'left' }}>
              <h3 className="comic-subtitle mb-md" style={{ textAlign: 'center' }}>
                Opposite Pairs from the Story
              </h3>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', justifyContent: 'center' }}>
                {[
                  ['Big', 'Small'],
                  ['Hot', 'Cold'],
                  ['Fast', 'Slowly'],
                  ['Happy', 'Sad'],
                ].map(([a, b], i) => (
                  <div key={i} style={{
                    padding: '8px 16px',
                    background: 'white',
                    border: '3px solid var(--border-color)',
                    borderRadius: '10px',
                    boxShadow: '3px 3px 0 var(--border-color)',
                    fontFamily: 'var(--font-heading)',
                    fontSize: '1.1rem',
                    letterSpacing: '1px',
                  }}>
                    <span className="highlight-word highlight-word--red">{a}</span>
                    {' ↔ '}
                    <span className="highlight-word highlight-word--blue">{b}</span>
                  </div>
                ))}
              </div>
            </ComicPanel>
          </div>
        </div>
      )}
    </div>
  )
}
