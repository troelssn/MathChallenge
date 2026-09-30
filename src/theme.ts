export type Theme = 'unicorn' | 'football'

export const THEMES: Theme[] = ['unicorn', 'football']

type ThemeLook = {
  mascot: string
  // Moves along the progress bar towards the goal.
  runner: string
  goal: string
  // Pops up after a correct answer.
  correct: string
  confetti: string[]
}

export const LOOKS: Record<Theme, ThemeLook> = {
  unicorn: {
    mascot: '🦄',
    runner: '🦄',
    goal: '🌈',
    correct: '✨',
    confetti: ['🦄', '✨', '🌈', '💖', '⭐', '🌸'],
  },
  football: {
    mascot: '⚽',
    runner: '⚽',
    goal: '🥅',
    correct: '⚽',
    confetti: ['⚽', '🏆', '⭐', '🥇', '👟', '🎉'],
  },
}
