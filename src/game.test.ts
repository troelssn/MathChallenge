import { describe, expect, it } from 'vitest'
import { checkAnswer, createExercise, createRace, DEFAULT_SETTINGS, OPERATIONS, operationStats, type Settings } from './game'

const settings: Settings = { ...DEFAULT_SETTINGS, addSubtractMax: 20, tableMax: 10 }

describe('createExercise', () => {
  it('keeps every operation within its range and with whole, non-negative answers', () => {
    for (let run = 0; run < 2000; run += 1) {
      for (const operation of OPERATIONS) {
        const { left, right, answer } = createExercise(operation, settings)
        expect(Number.isInteger(answer)).toBe(true)
        expect(answer).toBeGreaterThanOrEqual(0)
        if (operation === 'add') {
          expect(left + right).toBe(answer)
          expect(answer).toBeLessThanOrEqual(20)
        }
        if (operation === 'subtract') {
          expect(left - right).toBe(answer)
          expect(left).toBeLessThanOrEqual(20)
        }
        if (operation === 'multiply') {
          expect(left * right).toBe(answer)
          expect(Math.max(left, right)).toBeLessThanOrEqual(10)
        }
        if (operation === 'divide') {
          expect(right * answer).toBe(left)
          expect(Math.max(right, answer)).toBeLessThanOrEqual(10)
        }
      }
    }
  })
})

describe('createRace', () => {
  it('creates the requested number of problems using only the chosen operations', () => {
    const race = createRace({ ...settings, operations: ['multiply', 'divide'], count: 30 })
    expect(race).toHaveLength(30)
    expect(race.every(({ operation }) => operation === 'multiply' || operation === 'divide')).toBe(true)
  })

  it('still fills the race when the range has fewer unique problems than requested', () => {
    const race = createRace({ ...settings, operations: ['multiply'], tableMax: 2, count: 10 })
    expect(race).toHaveLength(10)
  })
})

describe('checkAnswer and stats', () => {
  it('accepts zero as an answer and counts results per operation', () => {
    const zero = checkAnswer({ id: '5−5', operation: 'subtract', left: 5, right: 5, answer: 0, given: '', isCorrect: null }, '0')
    const wrong = checkAnswer({ id: '2×3', operation: 'multiply', left: 2, right: 3, answer: 6, given: '', isCorrect: null }, '5')
    expect(zero.isCorrect).toBe(true)
    expect(wrong.isCorrect).toBe(false)
    expect(operationStats([zero, wrong])).toEqual([
      { operation: 'subtract', correct: 1, wrong: 0 },
      { operation: 'multiply', correct: 0, wrong: 1 },
    ])
  })
})
