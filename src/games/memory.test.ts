import { describe, it, expect } from 'vitest'
import { createDeck, isMatch, isGameWon, MEMORY_EMOJIS } from './memory'

describe('memory game logic', () => {
  it('creates a deck with a pair for every emoji', () => {
    const deck = createDeck()
    expect(deck).toHaveLength(MEMORY_EMOJIS.length * 2)

    for (const emoji of MEMORY_EMOJIS) {
      const count = deck.filter((card) => card.emoji === emoji).length
      expect(count).toBe(2)
    }
  })

  it('assigns unique ids and starts unmatched', () => {
    const deck = createDeck()
    const ids = new Set(deck.map((c) => c.id))
    expect(ids.size).toBe(deck.length)
    expect(deck.every((c) => !c.matched)).toBe(true)
  })

  it('matches two different cards with the same emoji', () => {
    const a = { id: 0, emoji: '🐶', matched: false }
    const b = { id: 1, emoji: '🐶', matched: false }
    const c = { id: 2, emoji: '🐱', matched: false }
    expect(isMatch(a, b)).toBe(true)
    expect(isMatch(a, c)).toBe(false)
    expect(isMatch(a, a)).toBe(false)
  })

  it('detects a won game only when all cards are matched', () => {
    const deck = createDeck()
    expect(isGameWon(deck)).toBe(false)
    const won = deck.map((c) => ({ ...c, matched: true }))
    expect(isGameWon(won)).toBe(true)
    expect(isGameWon([])).toBe(false)
  })
})
