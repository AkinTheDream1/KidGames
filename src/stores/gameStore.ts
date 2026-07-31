import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { PRIZES, REWARDS } from '../config/game'

interface GameState {
  currentLevel: number
  correctStreak: number
  levelStreak: number
  wrongAttempts: number
  totalCorrect: number
  iceCreamCount: number
  unlockedPrizes: string[]
  danceBreaksSeen: number
  danceDue: boolean
  lastActivityTime: number
  recordCorrect: () => { prize?: string }
  recordWrong: () => void
  completeDance: () => void
  requestDance: () => void
  resetProgress: () => void
}

const initialState = {
  currentLevel: 1,
  correctStreak: 0,
  levelStreak: 0,
  wrongAttempts: 0,
  totalCorrect: 0,
  iceCreamCount: 0,
  unlockedPrizes: [] as string[],
  danceBreaksSeen: 0,
  danceDue: false,
  lastActivityTime: Date.now(),
}

export const useGameStore = create<GameState>()(
  persist(
    (set, get) => ({
      ...initialState,
      recordCorrect: () => {
        const state = get()
        const totalCorrect = state.totalCorrect + 1
        const newlyUnlocked = PRIZES.find(
          (prize) => prize.threshold === totalCorrect && !state.unlockedPrizes.includes(prize.id),
        )
        set({
          totalCorrect,
          iceCreamCount: state.iceCreamCount + REWARDS.iceCreamPerCorrect,
          correctStreak: state.correctStreak + 1,
          levelStreak: state.levelStreak >= 2 ? 0 : state.levelStreak + 1,
          wrongAttempts: 0,
          currentLevel: state.levelStreak >= 2 ? state.currentLevel + 1 : state.currentLevel,
          unlockedPrizes: newlyUnlocked
            ? [...state.unlockedPrizes, newlyUnlocked.id]
            : state.unlockedPrizes,
          danceDue: totalCorrect % REWARDS.danceBreakFrequency === 0,
          lastActivityTime: Date.now(),
        })
        return { prize: newlyUnlocked?.id }
      },
      recordWrong: () => {
        const state = get()
        const wrongAttempts = state.wrongAttempts + 1
        set({
          wrongAttempts: wrongAttempts >= REWARDS.streakResetThreshold ? 0 : wrongAttempts,
          correctStreak: wrongAttempts >= REWARDS.streakResetThreshold ? 0 : state.correctStreak,
          levelStreak: wrongAttempts >= REWARDS.streakResetThreshold ? 0 : state.levelStreak,
          lastActivityTime: Date.now(),
        })
      },
      completeDance: () => set((state) => ({
        danceDue: false,
        danceBreaksSeen: state.danceBreaksSeen + 1,
        lastActivityTime: Date.now(),
      })),
      requestDance: () => set({ danceDue: true }),
      resetProgress: () => set({ ...initialState, lastActivityTime: Date.now() }),
    }),
    {
      name: 'scoop-and-count-progress',
      partialize: ({ currentLevel, correctStreak, levelStreak, wrongAttempts, totalCorrect, iceCreamCount, unlockedPrizes, danceBreaksSeen, lastActivityTime }) => ({
        currentLevel,
        correctStreak,
        levelStreak,
        wrongAttempts,
        totalCorrect,
        iceCreamCount,
        unlockedPrizes,
        danceBreaksSeen,
        lastActivityTime,
      }),
      onRehydrateStorage: () => (state) => {
        if (state && Date.now() - state.lastActivityTime > REWARDS.inactivityMinutes * 60_000) {
          useGameStore.setState({ correctStreak: 0, levelStreak: 0 })
        }
      },
    },
  ),
)
