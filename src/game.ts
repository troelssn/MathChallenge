export type Operation = 'add' | 'subtract' | 'multiply' | 'divide'

export const OPERATIONS: Operation[] = ['add', 'subtract', 'multiply', 'divide']

export const SYMBOLS: Record<Operation, string> = {
  add: '+',
  subtract: '−',
  multiply: '×',
  divide: '÷',
}

export type Settings = {
  operations: Operation[]
  // Highest number used in plus and minus problems.
  addSubtractMax: number
  // Highest table used in times and division problems.
  tableMax: number
  count: number
}

export type Exercise = {
  id: string
  operation: Operation
  left: number
  right: number
  answer: number
  given: string
  isCorrect: boolean | null
}

export const DEFAULT_SETTINGS: Settings = {
  operations: ['add', 'subtract', 'multiply', 'divide'],
  addSubtractMax: 20,
  tableMax: 10,
  count: 20,
}

function randomInt(min: number, max: number) {
  return min + Math.floor(Math.random() * (max - min + 1))
}

export function shuffle<T>(items: T[]): T[] {
  const shuffled = [...items]
  for (let index = shuffled.length - 1; index > 0; index -= 1) {
    const randomIndex = Math.floor(Math.random() * (index + 1))
    ;[shuffled[index], shuffled[randomIndex]] = [shuffled[randomIndex], shuffled[index]]
  }
  return shuffled
}

function makeExercise(operation: Operation, left: number, right: number, answer: number): Exercise {
  return { id: `${left}${SYMBOLS[operation]}${right}`, operation, left, right, answer, given: '', isCorrect: null }
}

export function createExercise(operation: Operation, settings: Settings): Exercise {
  const { addSubtractMax, tableMax } = settings
  switch (operation) {
    case 'add': {
      // Both terms and the sum stay within the chosen range.
      const sum = randomInt(2, addSubtractMax)
      const left = randomInt(1, sum - 1)
      return makeExercise(operation, left, sum - left, sum)
    }
    case 'subtract': {
      // Never negative results.
      const left = randomInt(2, addSubtractMax)
      const right = randomInt(1, left)
      return makeExercise(operation, left, right, left - right)
    }
    case 'multiply': {
      const left = randomInt(1, tableMax)
      const right = randomInt(1, tableMax)
      return makeExercise(operation, left, right, left * right)
    }
    case 'divide': {
      // Built backwards from a times problem, so it always divides evenly.
      const divisor = randomInt(1, tableMax)
      const quotient = randomInt(1, tableMax)
      return makeExercise(operation, divisor * quotient, divisor, quotient)
    }
  }
}

export function createRace(settings: Settings): Exercise[] {
  const operations = settings.operations.length ? settings.operations : DEFAULT_SETTINGS.operations
  const exercises: Exercise[] = []
  const seen = new Set<string>()
  let attempts = 0
  while (exercises.length < settings.count) {
    // Spread operations evenly, then avoid repeats while there is room for variety.
    const operation = operations[exercises.length % operations.length]
    const exercise = createExercise(operation, settings)
    attempts += 1
    if (seen.has(exercise.id) && attempts < settings.count * 20) continue
    seen.add(exercise.id)
    exercises.push(exercise)
  }
  return shuffle(exercises)
}

export function resetExercises(exercises: Exercise[]): Exercise[] {
  return shuffle(exercises.map((exercise) => ({ ...exercise, given: '', isCorrect: null })))
}

export function checkAnswer(exercise: Exercise, given: string): Exercise {
  const trimmed = given.trim()
  return { ...exercise, given: trimmed, isCorrect: trimmed !== '' && Number(trimmed) === exercise.answer }
}

export type OperationStat = { operation: Operation; correct: number; wrong: number }

export function operationStats(exercises: Exercise[]): OperationStat[] {
  return OPERATIONS.map((operation) => {
    const matching = exercises.filter((exercise) => exercise.operation === operation)
    return {
      operation,
      correct: matching.filter((exercise) => exercise.isCorrect === true).length,
      wrong: matching.filter((exercise) => exercise.isCorrect === false).length,
    }
  }).filter(({ correct, wrong }) => correct + wrong > 0)
}

export function formatTime(totalSeconds: number) {
  const minutes = Math.floor(totalSeconds / 60)
  const seconds = totalSeconds % 60
  return `${minutes}:${String(seconds).padStart(2, '0')}`
}

export function settingsKey(settings: Settings) {
  return [...settings.operations].sort().join(',') + `|${settings.addSubtractMax}|${settings.tableMax}|${settings.count}`
}
