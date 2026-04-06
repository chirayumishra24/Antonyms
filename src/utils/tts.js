// Shared TTS utility — selects a male English voice for Spider-Man
export function getMaleVoice() {
  const voices = window.speechSynthesis.getVoices()

  // Prefer Google UK English Male or Microsoft David
  const malePreferred = [
    'Google UK English Male',
    'Microsoft David',
    'Microsoft Mark',
    'Google US English',
    'Alex',
    'Daniel',
    'James',
  ]

  for (const name of malePreferred) {
    const found = voices.find(v => v.name.includes(name) && v.lang.startsWith('en'))
    if (found) return found
  }

  // Fallback: any English voice with "Male" in the name
  const anyMale = voices.find(v =>
    v.lang.startsWith('en') && v.name.toLowerCase().includes('male')
  )
  if (anyMale) return anyMale

  // Last fallback: first English voice
  return voices.find(v => v.lang.startsWith('en')) || null
}

// Spell out a word letter by letter then say it: "B. I. G. big"
export function spellWord(word) {
  return word.toUpperCase().split('').join('. ') + '. ' + word.toLowerCase()
}

export function speakText(text, { rate = 0.9, pitch = 0.95, onEnd, onStart } = {}) {
  if (!('speechSynthesis' in window)) return

  window.speechSynthesis.cancel()
  const utterance = new SpeechSynthesisUtterance(text)
  utterance.rate = rate
  utterance.pitch = pitch
  utterance.volume = 1

  const voice = getMaleVoice()
  if (voice) utterance.voice = voice

  if (onStart) utterance.onstart = onStart
  if (onEnd) utterance.onend = onEnd
  utterance.onerror = () => onEnd?.()

  window.speechSynthesis.speak(utterance)
  return utterance
}
