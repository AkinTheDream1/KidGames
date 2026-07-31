import { useState } from 'react'
import MemoryGame from './components/MemoryGame'
import MathGame from './components/MathGame'

type GameId = 'memory' | 'math'

interface GameMeta {
  id: GameId
  title: string
  emoji: string
  description: string
}

const GAMES: GameMeta[] = [
  {
    id: 'memory',
    title: 'Memory Match',
    emoji: '🧠',
    description: 'Flip the cards and find the matching animal pairs!',
  },
  {
    id: 'math',
    title: 'Math Quiz',
    emoji: '➕',
    description: 'Practice adding and subtracting numbers.',
  },
]

export default function App() {
  const [active, setActive] = useState<GameId | null>(null)
  const activeMeta = GAMES.find((g) => g.id === active) ?? null

  return (
    <div className="app">
      <header className="app-header">
        <div style={{ fontSize: '3rem' }}>🎮</div>
        <h1>KidGames</h1>
        <p>Fun little games to play and learn</p>
      </header>

      {active === null ? (
        <main className="game-grid">
          {GAMES.map((game) => (
            <button
              key={game.id}
              className="game-card"
              onClick={() => setActive(game.id)}
            >
              <div className="emoji">{game.emoji}</div>
              <h2>{game.title}</h2>
              <p>{game.description}</p>
            </button>
          ))}
        </main>
      ) : (
        <main>
          <div className="toolbar">
            <button className="btn secondary" onClick={() => setActive(null)}>
              ← All games
            </button>
            <h2 style={{ color: '#fff', margin: 0 }}>
              {activeMeta?.emoji} {activeMeta?.title}
            </h2>
          </div>
          {active === 'memory' && <MemoryGame />}
          {active === 'math' && <MathGame />}
        </main>
      )}
    </div>
  )
}
