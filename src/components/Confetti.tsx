import { useState } from 'react'

type Piece = { id: number; emoji: string; left: number; delay: number; duration: number; size: number }

// Emoji rain on the results screen. Positions are picked once per mount.
export function Confetti({ emojis }: { emojis: string[] }) {
  const [pieces] = useState<Piece[]>(() =>
    Array.from({ length: 28 }, (_, id) => ({
      id,
      emoji: emojis[id % emojis.length],
      left: Math.random() * 100,
      delay: Math.random() * 1.2,
      duration: 2.4 + Math.random() * 1.8,
      size: 1.2 + Math.random() * 1.2,
    })),
  )

  return (
    <div className="confetti" aria-hidden="true">
      {pieces.map((piece) => (
        <span
          key={piece.id}
          style={{
            left: `${piece.left}%`,
            animationDelay: `${piece.delay}s`,
            animationDuration: `${piece.duration}s`,
            fontSize: `${piece.size}rem`,
          }}
        >
          {piece.emoji}
        </span>
      ))}
    </div>
  )
}
