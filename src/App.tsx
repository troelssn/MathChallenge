import { useEffect, useState } from 'react'
import { RaceScreen } from './components/RaceScreen'
import { ResultsScreen } from './components/ResultsScreen'
import { SetupScreen } from './components/SetupScreen'
import { SuggestionDialog } from './components/SuggestionDialog'
import { checkAnswer, createRace, DEFAULT_SETTINGS, formatTime, resetExercises, settingsKey, type Exercise, type Settings } from './game'
import { STRINGS, type Language } from './i18n'
import { load, save } from './storage'

type Screen = 'setup' | 'race' | 'results'
type Records = Record<string, number>

function initialLanguage(): Language {
  const stored = load<Language | null>('language', null)
  if (stored === 'da' || stored === 'en') return stored
  return navigator.language.toLowerCase().startsWith('da') ? 'da' : 'en'
}

export default function App() {
  const [language, setLanguage] = useState<Language>(initialLanguage)
  const [settings, setSettings] = useState<Settings>(() => ({ ...DEFAULT_SETTINGS, ...load<Partial<Settings>>('settings', {}) }))
  const [records, setRecords] = useState<Records>(() => load<Records>('records', {}))
  const [screen, setScreen] = useState<Screen>('setup')
  const [exercises, setExercises] = useState<Exercise[]>([])
  const [index, setIndex] = useState(0)
  const [round, setRound] = useState(0)
  // Only full races with the chosen settings can set a record, not practice rounds.
  const [isPractice, setIsPractice] = useState(false)
  const [isRecord, setIsRecord] = useState(false)
  const [startedAt, setStartedAt] = useState(0)
  const [seconds, setSeconds] = useState(0)
  const [suggestOpen, setSuggestOpen] = useState(false)
  const t = STRINGS[language]

  useEffect(() => {
    document.documentElement.lang = language
    save('language', language)
  }, [language])

  useEffect(() => {
    if (screen !== 'race') return
    const timer = window.setInterval(() => setSeconds(Math.floor((Date.now() - startedAt) / 1000)), 250)
    return () => window.clearInterval(timer)
  }, [screen, startedAt])

  function begin(nextExercises: Exercise[], practice: boolean) {
    setExercises(nextExercises)
    setIndex(0)
    setRound((current) => current + 1)
    setIsPractice(practice)
    setIsRecord(false)
    setStartedAt(Date.now())
    setSeconds(0)
    setScreen('race')
  }

  function startRace(nextSettings: Settings) {
    setSettings(nextSettings)
    save('settings', nextSettings)
    begin(createRace(nextSettings), false)
  }

  function answer(given: string) {
    const updated = exercises.map((exercise, position) => (position === index ? checkAnswer(exercise, given) : exercise))
    setExercises(updated)
    if (index < updated.length - 1) {
      setIndex(index + 1)
      return
    }
    const finalSeconds = Math.max(1, Math.round((Date.now() - startedAt) / 1000))
    setSeconds(finalSeconds)
    const allCorrect = updated.every(({ isCorrect }) => isCorrect)
    const key = settingsKey(settings)
    // A record needs every answer right, otherwise guessing fast would win.
    if (!isPractice && allCorrect && (records[key] === undefined || finalSeconds < records[key])) {
      const nextRecords = { ...records, [key]: finalSeconds }
      setRecords(nextRecords)
      save('records', nextRecords)
      setIsRecord(true)
    }
    setScreen('results')
  }

  const current = exercises[index]
  const correctCount = exercises.filter(({ isCorrect }) => isCorrect).length

  return (
    <div className="app">
      <header className="topbar">
        <button className="brand" type="button" onClick={() => setScreen('setup')}>
          <span className="brand-mark" aria-hidden="true">
            ±
          </span>
          MathChallenge
        </button>
        {screen === 'race' && (
          <span className="timer" aria-live="off">
            ⏱ {formatTime(seconds)}
          </span>
        )}
        <div className="topbar-actions">
          <button className="ghost" type="button" onClick={() => setSuggestOpen(true)}>
            💡 {t.suggest}
          </button>
          <button
            className="ghost"
            type="button"
            aria-label={t.language}
            title={t.language}
            onClick={() => setLanguage(language === 'da' ? 'en' : 'da')}
          >
            {language === 'da' ? 'EN' : 'DA'}
          </button>
        </div>
      </header>

      <main>
        {screen === 'setup' && (
          <SetupScreen t={t} initial={settings} bestTimeFor={(chosen) => records[settingsKey(chosen)] ?? null} onStart={startRace} />
        )}
        {screen === 'race' && current && (
          <RaceScreen
            key={`${round}-${index}`}
            t={t}
            exercise={current}
            index={index}
            total={exercises.length}
            correctCount={correctCount}
            onAnswer={answer}
            onQuit={() => setScreen('setup')}
          />
        )}
        {screen === 'results' && (
          <ResultsScreen
            t={t}
            exercises={exercises}
            seconds={seconds}
            isRecord={isRecord}
            onPracticeMistakes={() => begin(resetExercises(exercises.filter(({ isCorrect }) => isCorrect === false)), true)}
            onTryAgain={() => startRace(settings)}
            onChangeSettings={() => setScreen('setup')}
          />
        )}
      </main>

      <SuggestionDialog t={t} open={suggestOpen} onClose={() => setSuggestOpen(false)} />
    </div>
  )
}
