import { formatTime, operationStats, SYMBOLS, type Exercise } from '../game'
import type { Strings } from '../i18n'

type Props = {
  t: Strings
  exercises: Exercise[]
  seconds: number
  isRecord: boolean
  onPracticeMistakes: () => void
  onTryAgain: () => void
  onChangeSettings: () => void
}

export function ResultsScreen({ t, exercises, seconds, isRecord, onPracticeMistakes, onTryAgain, onChangeSettings }: Props) {
  const correct = exercises.filter(({ isCorrect }) => isCorrect).length
  const mistakes = exercises.filter(({ isCorrect }) => isCorrect === false)
  const accuracy = exercises.length ? Math.round((correct / exercises.length) * 100) : 0
  const perProblem = exercises.length ? (seconds / exercises.length).toFixed(1) : '0'
  const stats = operationStats(exercises)

  return (
    <section className="card results" aria-labelledby="results-title">
      <p className="eyebrow">{t.finished}</p>
      <h1 id="results-title">{isRecord ? `🏆 ${t.newRecord}` : t.wellDone}</h1>

      <div className="score-grid">
        <Score value={formatTime(seconds)} label={t.time} />
        <Score value={`${correct}/${exercises.length}`} label={t.correct} />
        <Score value={`${accuracy}%`} label={t.accuracy} />
        <Score value={`${perProblem} ${t.seconds}`} label={t.perProblem} />
      </div>

      {stats.length > 1 && (
        <div className="stat-list">
          <h2>{t.byOperation}</h2>
          {stats.map(({ operation, correct: right, wrong }) => (
            <div key={operation} className={`stat op-${operation}`}>
              <span>
                <span className="operation-symbol">{SYMBOLS[operation]}</span> {t.operations[operation]}
              </span>
              <span>{t.statLine(right, wrong)}</span>
            </div>
          ))}
        </div>
      )}

      {mistakes.length ? (
        <div className="mistakes">
          <h2>{t.mistakes}</h2>
          {mistakes.map((exercise) => (
            <p key={exercise.id + exercise.given}>
              <strong>
                {exercise.left} {SYMBOLS[exercise.operation]} {exercise.right} = {exercise.answer}
              </strong>
              <span className="muted">
                {t.youAnswered}: {exercise.given || t.noAnswer}
              </span>
            </p>
          ))}
        </div>
      ) : (
        <p className="perfect">{t.perfect}</p>
      )}

      <div className="result-actions">
        {mistakes.length > 0 && (
          <button className="primary" type="button" onClick={onPracticeMistakes}>
            {t.practiceMistakes}
          </button>
        )}
        <button className={mistakes.length ? 'secondary' : 'primary'} type="button" onClick={onTryAgain}>
          {t.tryAgain}
        </button>
        <button className="secondary" type="button" onClick={onChangeSettings}>
          {t.changeSettings}
        </button>
      </div>
    </section>
  )
}

function Score({ value, label }: { value: string; label: string }) {
  return (
    <div>
      <strong>{value}</strong>
      <span>{label}</span>
    </div>
  )
}
