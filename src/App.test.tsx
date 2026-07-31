import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from './App'

describe('App navigation', () => {
  it('shows the game menu on load', () => {
    render(<App />)
    expect(
      screen.getByRole('heading', { name: 'KidGames' }),
    ).toBeInTheDocument()
    expect(screen.getByText('Memory Match')).toBeInTheDocument()
    expect(screen.getByText('Math Quiz')).toBeInTheDocument()
  })

  it('opens the Math Quiz and lets you answer a question', async () => {
    const user = userEvent.setup()
    render(<App />)

    await user.click(screen.getByText('Math Quiz'))
    expect(screen.getByLabelText('question')).toBeInTheDocument()
    expect(screen.getByText('Score: 0')).toBeInTheDocument()

    // The question text looks like "3 + 4 = ?" — parse and answer it.
    const questionText = screen.getByLabelText('question').textContent ?? ''
    const match = questionText.match(/(\d+)\s*([+-])\s*(\d+)/)
    expect(match).not.toBeNull()
    const [, aStr, op, bStr] = match!
    const a = Number(aStr)
    const b = Number(bStr)
    const answer = op === '+' ? a + b : a - b

    await user.click(screen.getByRole('button', { name: String(answer) }))
    expect(screen.getByText('✅ Correct!')).toBeInTheDocument()
    expect(screen.getByText('Score: 1')).toBeInTheDocument()
  })

  it('can return to the menu from a game', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByText('Memory Match'))
    expect(screen.getByLabelText('Memory board')).toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: '← All games' }))
    expect(screen.getByText('Math Quiz')).toBeInTheDocument()
  })
})
