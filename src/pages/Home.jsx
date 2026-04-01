import { Link } from 'react-router-dom'
import SpiderManSpeech from '../components/SpiderManSpeech'
import ComicPanel from '../components/ComicPanel'

const chapters = [
  {
    module: 'Module 1',
    chapter: 'Chapter 1',
    title: 'Discover Opposites',
    desc: 'Learn what opposite words are with a quick flashcard game!',
    path: '/m1/ch1',
    variant: 'm1',
    icon: '🕸️',
  },
  {
    module: 'Module 1',
    chapter: 'Chapter 2',
    title: 'Match the Opposites',
    desc: 'Fill in the blanks with the correct opposite words!',
    path: '/m1/ch2',
    variant: 'm1',
    icon: '🎯',
  },
  {
    module: 'Module 2',
    chapter: 'Chapter 1',
    title: 'Listen & Learn Through Story',
    desc: 'Hear a fun story and spot the opposite word pairs!',
    path: '/m2/ch1',
    variant: 'm2',
    icon: '📖',
  },
  {
    module: 'Module 2',
    chapter: 'Chapter 2',
    title: 'Speak & Create',
    desc: 'Create your own mini story using opposite words!',
    path: '/m2/ch2',
    variant: 'm2',
    icon: '✏️',
  },
]

export default function Home() {
  return (
    <div className="page-container">
      {/* Header */}
      <div className="text-center mb-2xl">
        <h1 className="comic-title" style={{ fontSize: '3.5rem', marginBottom: '8px' }}>
          Antonyms Explorer
        </h1>
        <p className="comic-subtitle" style={{ color: 'var(--action-yellow)' }}>
          Spider Hero Academy
        </p>
      </div>

      {/* Spider-Man Welcome */}
      <SpiderManSpeech
        text="Hey there, young hero! Welcome to Spider Hero Academy! Today, we're going to learn about OPPOSITES — words that mean the complete reverse of each other! Like how I'm a HERO and the villains are... well, the OPPOSITE! Are you ready to swing into action? Pick a chapter below and let's go!"
        image="/spidey_teacher.png"
        imageAlt="Spider Hero welcoming you"
        autoSpeak={false}
      />

      {/* Chapter Grid */}
      <div className="grid-2 mb-xl">
        {chapters.map((ch, i) => (
          <Link
            key={ch.path}
            to={ch.path}
            className={`chapter-card chapter-card--${ch.variant}`}
            id={`chapter-card-${i}`}
          >
            <span className="chapter-card__module">
              {ch.module} — {ch.chapter}
            </span>
            <h2 className="chapter-card__title">{ch.title}</h2>
            <p className="chapter-card__desc">{ch.desc}</p>
          </Link>
        ))}
      </div>

      {/* Skills Section */}
      <ComicPanel variant="blue">
        <h2 className="comic-subtitle mb-md" style={{ color: 'var(--spidey-red)' }}>
          Skills You Will Acquire
        </h2>
        <div className="grid-3" style={{ gap: '12px' }}>
          {[
            { title: 'Vocabulary Enhancement', icon: StarIcon },
            { title: 'Sentence Formation', icon: PenIcon },
            { title: 'Listening Skills', icon: EarIcon },
            { title: 'Speaking Confidence', icon: MicIcon },
            { title: 'Comprehension & Recall', icon: BrainIcon },
            { title: 'Creative Thinking', icon: LightbulbIcon },
          ].map((skill) => (
            <div key={skill.title} style={{
              display: 'flex', alignItems: 'center', gap: '8px',
              padding: '8px 12px', background: 'white',
              borderRadius: '8px', border: '2px solid var(--border-color)',
              boxShadow: '2px 2px 0 var(--border-color)'
            }}>
              <skill.icon />
              <span style={{ fontFamily: 'var(--font-body)', fontWeight: 700, fontSize: '0.9rem' }}>
                {skill.title}
              </span>
            </div>
          ))}
        </div>
      </ComicPanel>
    </div>
  )
}

/* SVG Icons */
function StarIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="var(--action-yellow)" stroke="var(--border-color)" strokeWidth="1.5">
      <polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26" />
    </svg>
  )
}

function PenIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="var(--spidey-blue)" strokeWidth="2" strokeLinecap="round">
      <path d="M17 3a2.85 2.85 0 0 1 4 4L7.5 20.5 2 22l1.5-5.5Z" />
    </svg>
  )
}

function EarIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="var(--spidey-red)" strokeWidth="2" strokeLinecap="round">
      <path d="M6 8.5a6.5 6.5 0 1 1 13 0c0 6-6 6-6 10.5" />
      <path d="M13 19.5v.5" />
    </svg>
  )
}

function MicIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="var(--correct-green)" strokeWidth="2" strokeLinecap="round">
      <rect x="9" y="2" width="6" height="11" rx="3" />
      <path d="M5 10a7 7 0 0 0 14 0" />
      <line x1="12" y1="19" x2="12" y2="22" />
    </svg>
  )
}

function BrainIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="var(--goblin-purple)" strokeWidth="2" strokeLinecap="round">
      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z" />
      <path d="M12 2c-3 2-5 6-5 10s2 8 5 10" />
      <path d="M12 2c3 2 5 6 5 10s-2 8-5 10" />
      <line x1="2" y1="12" x2="22" y2="12" />
    </svg>
  )
}

function LightbulbIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="var(--action-orange)" strokeWidth="2" strokeLinecap="round">
      <path d="M9 18h6" />
      <path d="M10 22h4" />
      <path d="M12 2a7 7 0 0 0-4 12.7V17h8v-2.3A7 7 0 0 0 12 2Z" />
    </svg>
  )
}
