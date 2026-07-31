import { describe, expect, it, vi } from 'vitest'
import {
  generateAddition,
  generateCountingProblem,
  generateNumberRecognition,
  getDifficultyRange,
} from './mathGenerator'

describe('mathGenerator', () => {
  it('keeps counting quantities inside the current level', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0.99)
    expect(generateCountingProblem(6).answer).toBe(6)
    expect(generateCountingProblem(10).answer).toBe(10)
    vi.restoreAllMocks()
  })

  it('creates three recognition options including the answer', () => {
    const problem = generateNumberRecognition(20)
    expect(problem.options).toHaveLength(3)
    expect(problem.options).toContain(problem.answer)
    expect(new Set(problem.options).size).toBe(3)
  })

  it('scales addition operands up to five', () => {
    expect(getDifficultyRange(21)).toEqual([1, 2])
    expect(getDifficultyRange(30)).toEqual([1, 5])
    const problem = generateAddition(30)
    expect(problem.answer).toBe(problem.quantities[0] + (problem.quantities[1] ?? 0))
    expect(problem.answer).toBeLessThanOrEqual(10)
  })
})
