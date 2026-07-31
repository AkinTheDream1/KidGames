import { Flame, IceCreamBowl, Music2, Trophy } from 'lucide-react'
import { motion } from 'motion/react'
import { useGameStore } from '../stores/gameStore'

interface RewardDisplayProps {
  onOpenPrizes: () => void
}

export function RewardDisplay({ onOpenPrizes }: RewardDisplayProps) {
  const streak = useGameStore((state) => state.correctStreak)
  const scoops = useGameStore((state) => state.iceCreamCount)
  const requestDance = useGameStore((state) => state.requestDance)

  return (
    <header className="mx-auto flex w-full max-w-6xl items-center justify-between gap-2 px-4 py-4 sm:px-8 sm:py-6">
      <a href="/" className="flex items-center gap-2 text-slate-900" aria-label="Scoop and Count home">
        <span className="grid h-10 w-10 place-items-center rounded-2xl bg-slate-900 text-xl shadow-[3px_3px_0_#f5b83b]">🍦</span>
        <span className="hidden font-display text-xl font-bold sm:block">Scoop & Count</span>
      </a>
      <div className="flex items-center gap-2 sm:gap-3">
        <motion.div
          key={streak}
          initial={{ scale: 0.8 }}
          animate={{ scale: 1 }}
          className="stat-chip bg-[#fff0e8] text-[#b83c27]"
          aria-label={`${streak} answer streak`}
        >
          <Flame size={20} fill="currentColor" />
          <strong>{streak}</strong><span className="hidden sm:inline"> streak</span>
        </motion.div>
        <motion.div
          key={scoops}
          initial={{ y: -5 }}
          animate={{ y: 0 }}
          className="stat-chip bg-[#f0ebff] text-[#5a43b5]"
          aria-label={`${scoops} ice cream scoops`}
        >
          <IceCreamBowl size={20} />
          <strong>{scoops}</strong><span className="hidden sm:inline"> scoops</span>
        </motion.div>
        <button className="icon-button bg-[#e9faf6] text-[#087e71]" onClick={requestDance} aria-label="Start a dance break">
          <Music2 size={21} />
        </button>
        <button className="icon-button bg-[#fff7d9] text-[#9b6a00]" onClick={onOpenPrizes} aria-label="Open prize room">
          <Trophy size={21} />
        </button>
      </div>
    </header>
  )
}
