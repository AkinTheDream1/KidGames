import { beforeEach, describe, expect, it } from 'vitest'
import { useGameStore } from './gameStore'

describe('gameStore', () => {
  beforeEach(() => {
    localStorage.clear()
    useGameStore.getState().resetProgress()
  })

  it('earns a scoop and advances after three correct answers', () => {
    const { recordCorrect } = useGameStore.getState()
    recordCorrect()
    recordCorrect()
    expect(useGameStore.getState().currentLevel).toBe(1)
    recordCorrect()
    expect(useGameStore.getState()).toMatchObject({
      currentLevel: 2,
      iceCreamCount: 3,
      totalCorrect: 3,
      levelStreak: 0,
    })
  })

  it('resets the streak only after two wrong answers', () => {
    useGameStore.getState().recordCorrect()
    useGameStore.getState().recordWrong()
    expect(useGameStore.getState().correctStreak).toBe(1)
    useGameStore.getState().recordWrong()
    expect(useGameStore.getState().correctStreak).toBe(0)
  })

  it('requests a dance break every five correct answers', () => {
    for (let index = 0; index < 5; index += 1) useGameStore.getState().recordCorrect()
    expect(useGameStore.getState().danceDue).toBe(true)
    useGameStore.getState().completeDance()
    expect(useGameStore.getState().danceDue).toBe(false)
    expect(useGameStore.getState().danceBreaksSeen).toBe(1)
  })

  it('unlocks the first prize at five correct answers', () => {
    for (let index = 0; index < 5; index += 1) useGameStore.getState().recordCorrect()
    expect(useGameStore.getState().unlockedPrizes).toContain('sunny-sticker')
  })
})
