import { useEffect, useMemo, useState } from 'react'
import { createDeck, isGameWon, isMatch, type MemoryCard } from '../games/memory'

export default function MemoryGame() {
  const [deck, setDeck] = useState<MemoryCard[]>(() => createDeck())
  const [flipped, setFlipped] = useState<number[]>([])
  const [moves, setMoves] = useState(0)
  const [locked, setLocked] = useState(false)

  const won = useMemo(() => isGameWon(deck), [deck])

  function reset() {
    setDeck(createDeck())
    setFlipped([])
    setMoves(0)
    setLocked(false)
  }

  function handleFlip(index: number) {
    if (locked) return
    if (flipped.includes(index)) return
    if (deck[index].matched) return

    const next = [...flipped, index]
    setFlipped(next)

    if (next.length === 2) {
      setMoves((m) => m + 1)
      const [i, j] = next
      if (isMatch(deck[i], deck[j])) {
        setDeck((prev) =>
          prev.map((card, idx) =>
            idx === i || idx === j ? { ...card, matched: true } : card,
          ),
        )
        setFlipped([])
      } else {
        setLocked(true)
      }
    }
  }

  useEffect(() => {
    if (!locked) return
    const timer = setTimeout(() => {
      setFlipped([])
      setLocked(false)
    }, 800)
    return () => clearTimeout(timer)
  }, [locked])

  return (
    <div className="panel">
      <div className="toolbar">
        <span className="badge">Moves: {moves}</span>
        <button className="btn secondary" onClick={reset}>
          New game
        </button>
      </div>

      <div className="memory-board" role="grid" aria-label="Memory board">
        {deck.map((card, index) => {
          const isRevealed = card.matched || flipped.includes(index)
          const className = card.matched
            ? 'memory-tile matched'
            : isRevealed
              ? 'memory-tile revealed'
              : 'memory-tile'
          return (
            <button
              key={card.id}
              className={className}
              onClick={() => handleFlip(index)}
              aria-label={isRevealed ? `Card ${card.emoji}` : 'Hidden card'}
            >
              {isRevealed ? card.emoji : '?'}
            </button>
          )
        })}
      </div>

      {won && (
        <p className="feedback" style={{ color: '#00b894' }}>
          🎉 You matched them all in {moves} moves!
        </p>
      )}
    </div>
  )
}
