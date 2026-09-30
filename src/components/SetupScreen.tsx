import { useState } from 'react'
import { formatTime, OPERATIONS, SYMBOLS, type Operation, type Settings } from '../game'
import type { Strings } from '../i18n'
import { LOOKS, type Theme } from '../theme'

type Props = {
  t: Strings
  theme: Theme
  initial: Settings
  bestTimeFor: (settings: Settings) => number | null
  onStart: (settings: Settings) => void
}

const ADD_SUBTRACT_OPTIONS = [10, 20, 50, 100]
const TABLE_OPTIONS = [5, 10, 12]
const COUNT_OPTIONS = [10, 20, 30, 50]

export function SetupScreen({ t, theme, initial, bestTimeFor, onStart }: Props) {
  const [settings, setSettings] = useState(initial)
  const hasAddSubtract = settings.operations.some((operation) => operation === 'add' || operation === 'subtract')
  const hasMultiplyDivide = settings.operations.some((operation) => operation === 'multiply' || operation === 'divide')
  const best = settings.operations.length ? bestTimeFor(settings) : null

  function toggle(operation: Operation) {
    setSettings((current) => ({
      ...current,
      operations: current.operations.includes(operation)
        ? current.operations.filter((existing) => existing !== operation)
        : OPERATIONS.filter((existing) => existing === operation || current.operations.includes(existing)),
    }))
  }

  return (
    <form
      className="card setup"
      onSubmit={(event) => {
        event.preventDefault()
        if (settings.operations.length) onStart(settings)
      }}
    >
      <div className="setup-hero">
        <span className="setup-mascot" aria-hidden="true">
          {LOOKS[theme].mascot}
        </span>
        <h1>{t.themed[theme].tagline}</h1>
      </div>
      <p className="muted">{t.intro}</p>

      <fieldset>
        <legend>{t.operationsLabel}</legend>
        <div className="operation-grid">
          {OPERATIONS.map((operation) => (
            <button
              key={operation}
              type="button"
              className={`operation-toggle op-${operation}`}
              aria-pressed={settings.operations.includes(operation)}
              onClick={() => toggle(operation)}
            >
              <span className="operation-symbol">{SYMBOLS[operation]}</span>
              <span>{t.operations[operation]}</span>
            </button>
          ))}
        </div>
      </fieldset>

      {hasAddSubtract && (
        <ChoiceRow
          label={t.addSubtractMaxLabel}
          options={ADD_SUBTRACT_OPTIONS}
          value={settings.addSubtractMax}
          onChange={(addSubtractMax) => setSettings({ ...settings, addSubtractMax })}
        />
      )}
      {hasMultiplyDivide && (
        <ChoiceRow
          label={t.tableMaxLabel}
          options={TABLE_OPTIONS}
          format={(value) => `${value}${t.tableSuffix}`}
          value={settings.tableMax}
          onChange={(tableMax) => setSettings({ ...settings, tableMax })}
        />
      )}
      <ChoiceRow
        label={t.countLabel}
        options={COUNT_OPTIONS}
        value={settings.count}
        onChange={(count) => setSettings({ ...settings, count })}
      />

      {best !== null && (
        <p className="record">
          🏆 {t.bestTime}: <strong>{formatTime(best)}</strong>
        </p>
      )}
      {!settings.operations.length && <p className="warning">{t.pickOne}</p>}
      <button className="primary" type="submit" disabled={!settings.operations.length}>
        {t.start}
      </button>
    </form>
  )
}

type ChoiceRowProps = {
  label: string
  options: number[]
  value: number
  format?: (value: number) => string
  onChange: (value: number) => void
}

function ChoiceRow({ label, options, value, format = String, onChange }: ChoiceRowProps) {
  return (
    <fieldset>
      <legend>{label}</legend>
      <div className="chips">
        {options.map((option) => (
          <button key={option} type="button" className="chip" aria-pressed={option === value} onClick={() => onChange(option)}>
            {format(option)}
          </button>
        ))}
      </div>
    </fieldset>
  )
}
