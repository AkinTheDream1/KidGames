import { describe, it, expect } from 'vitest'
import { createQuestion, checkAnswer } from './math'

describe('math game logic', () => {
  it('produces a correct answer for the generated operands', () => {
    for (let i = 0; i < 200; i++) {
      const q = createQuestion()
      const expected = q.op === '+' ? q.a + q.b : q.a - q.b
      expect(q.answer).toBe(expected)
    }
  })

  it('never generates a negative answer', () => {
    for (let i = 0; i < 200; i++) {
      const q = createQuestion()
      expect(q.answer).toBeGreaterThanOrEqual(0)
    }
  })

  it('always includes the correct answer among four unique options', () => {
    for (let i = 0; i < 200; i++) {
      const q = createQuestion()
      expect(q.options).toHaveLength(4)
      expect(new Set(q.options).size).toBe(4)
      expect(q.options).toContain(q.answer)
    }
  })

  it('checkAnswer validates the chosen option', () => {
    const q = createQuestion()
    expect(checkAnswer(q, q.answer)).toBe(true)
    expect(checkAnswer(q, q.answer + 1)).toBe(false)
  })
})
