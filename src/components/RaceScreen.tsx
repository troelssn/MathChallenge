import { useEffect, useRef, useState } from 'react'
import { SYMBOLS, type Exercise } from '../game'
import type { Strings } from '../i18n'
import { LOOKS, type Theme } from '../theme'

type Props = {
  t: Strings
  exercise: Exercise
  index: number
  total: number
  correctCount: number
  lastWasCorrect: boolean
  theme: Theme
  onAnswer: (given: string) => void
  onQuit: () => void
}

export function RaceScreen({ t, exercise, index, total, correctCount, lastWasCorrect, theme, onAnswer, onQuit }: Props) {
  const look = LOOKS[theme]
  const [given, setGiven] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)

  // The parent remounts this screen per problem, so focusing once on mount is enough.
  useEffect(() => inputRef.current?.focus(), [])

  function change(value: string) {
    const digitsOnly = value.replace(/\D/g, '')
    setGiven(digitsOnly)
    // Move on as soon as the typed answer is right, so fast players never need Enter.
    if (digitsOnly !== '' && Number(digitsOnly) === exercise.answer) onAnswer(digitsOnly)
  }

  return (
    <section className="card race" aria-labelledby="problem">
      <div className="progress-row">
        <span>{t.problemOf(index + 1, total)}</span>
        <span>{t.correctSoFar(correctCount)}</span>
      </div>
      <div className="progress-track" aria-hidden="true">
        <span className="progress-fill" style={{ width: `${(index / total) * 100}%` }} />
        <span className="progress-runner" style={{ left: `${(index / total) * 100}%` }}>
          {look.runner}
        </span>
        <span className="progress-goal">{look.goal}</span>
      </div>
      {lastWasCorrect && (
        <span className="correct-pop" aria-hidden="true">
          {look.correct}
        </span>
      )}
      <form
        className="answer-form"
        onSubmit={(event) => {
          event.preventDefault()
          if (given !== '') onAnswer(given)
        }}
      >
        <p id="problem" className={`problem op-${exercise.operation}`}>
          {exercise.left} <span className="symbol">{SYMBOLS[exercise.operation]}</span> {exercise.right} <span className="symbol">=</span>
        </p>
        <label className="sr-only" htmlFor="answer">
          {t.yourAnswer}
        </label>
        <input
          id="answer"
          ref={inputRef}
          className="answer-input"
          value={given}
          onChange={(event) => change(event.target.value)}
          inputMode="numeric"
          autoComplete="off"
          placeholder="?"
        />
        <div className="race-actions">
          <button className="secondary" type="button" onClick={onQuit}>
            {t.quit}
          </button>
          <button className="primary" type="submit" disabled={given === ''}>
            {t.next}
          </button>
        </div>
      </form>
    </section>
  )
}
