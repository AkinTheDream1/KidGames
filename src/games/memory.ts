export const MEMORY_EMOJIS = ['🐶', '🐱', '🦊', '🐸', '🐼', '🦁', '🐵', '🐷'] as const

export interface MemoryCard {
  id: number
  emoji: string
  matched: boolean
}

function shuffle<T>(items: readonly T[]): T[] {
  const arr = [...items]
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[arr[i], arr[j]] = [arr[j], arr[i]]
  }
  return arr
}

/** Build a shuffled deck of paired emoji cards. */
export function createDeck(): MemoryCard[] {
  const paired = [...MEMORY_EMOJIS, ...MEMORY_EMOJIS]
  return shuffle(paired).map((emoji, id) => ({ id, emoji, matched: false }))
}

/** Two cards match when they share an emoji but are different cards. */
export function isMatch(a: MemoryCard, b: MemoryCard): boolean {
  return a.id !== b.id && a.emoji === b.emoji
}

export function isGameWon(deck: MemoryCard[]): boolean {
  return deck.length > 0 && deck.every((card) => card.matched)
}
