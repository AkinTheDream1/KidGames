import { describe, it, expect, vi, afterEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { createDeck } from '../games/memory'
import MemoryGame from './MemoryGame'

afterEach(() => {
  vi.restoreAllMocks()
})

function findFirstPair(deck: ReturnType<typeof createDeck>): [number, number] {
  for (let a = 0; a < deck.length; a++) {
    for (let b = a + 1; b < deck.length; b++) {
      if (deck[a].emoji === deck[b].emoji) return [a, b]
    }
  }
  throw new Error('no pair found')
}

describe('MemoryGame', () => {
  it('keeps a matched pair revealed and counts the move', async () => {
    // Seed Math.random so the component and this test build the same deck.
    vi.spyOn(Math, 'random').mockReturnValue(0)
    const [i, j] = findFirstPair(createDeck())

    const user = userEvent.setup()
    render(<MemoryGame />)
    const buttons = screen
      .getByLabelText('Memory board')
      .querySelectorAll('button')

    await user.click(buttons[i])
    await user.click(buttons[j])

    expect(buttons[i].className).toContain('matched')
    expect(buttons[j].className).toContain('matched')
    expect(screen.getByText('Moves: 1')).toBeInTheDocument()
  })

  it('hides two non-matching cards again after a short delay', async () => {
    vi.spyOn(Math, 'random').mockReturnValue(0)
    const deck = createDeck()
    // Pick the first two indices whose emojis differ.
    const i = 0
    let j = 1
    while (deck[i].emoji === deck[j].emoji) j++

    const user = userEvent.setup()
    render(<MemoryGame />)
    const buttons = screen
      .getByLabelText('Memory board')
      .querySelectorAll('button')

    await user.click(buttons[i])
    await user.click(buttons[j])
    expect(buttons[i].className).toContain('revealed')

    await waitFor(
      () => expect(buttons[i].className).not.toContain('revealed'),
      { timeout: 1500 },
    )
    expect(buttons[j].className).not.toContain('revealed')
  })
})
