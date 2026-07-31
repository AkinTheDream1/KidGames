import { motion } from 'motion/react'
import { LockKeyhole, RotateCcw, X } from 'lucide-react'
import { FLAVORS, PRIZES } from '../config/game'
import { useGameStore } from '../stores/gameStore'

export function PrizeRoom({ onClose }: { onClose: () => void }) {
  const unlocked = useGameStore((state) => state.unlockedPrizes)
  const totalCorrect = useGameStore((state) => state.totalCorrect)
  const resetProgress = useGameStore((state) => state.resetProgress)
  const flavor = [...FLAVORS].reverse().find((item) => totalCorrect >= item.threshold) ?? FLAVORS[0]

  const reset = () => {
    if (window.confirm('Start over from level 1? This will clear all prizes and scoops.')) {
      resetProgress()
      onClose()
    }
  }

  return (
    <motion.div
      className="fixed inset-0 z-40 flex items-center justify-center bg-slate-900/45 p-4 backdrop-blur-sm"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      role="dialog"
      aria-modal="true"
      aria-label="Prize room"
    >
      <motion.div initial={{ y: 25 }} animate={{ y: 0 }} className="w-full max-w-3xl rounded-[2.5rem] bg-[#fffaf2] p-6 shadow-2xl sm:p-9">
        <div className="mb-6 flex items-start justify-between">
          <div>
            <p className="font-extrabold uppercase tracking-[0.18em] text-[#b07807]">Your collection</p>
            <h2 className="font-display text-3xl font-bold text-slate-900 sm:text-4xl">The Prize Parlor</h2>
          </div>
          <button className="icon-button bg-white text-slate-700" onClick={onClose} aria-label="Close prize room"><X /></button>
        </div>

        <div className="mb-6 flex items-center gap-4 rounded-3xl bg-[#f0ebff] p-4">
          <div className="text-5xl">🍨</div>
          <div>
            <p className="text-sm font-extrabold uppercase tracking-wider text-[#6e5ac7]">Current flavor</p>
            <p className="font-display text-2xl font-bold text-slate-900">{flavor.name}</p>
          </div>
          <div className="ml-auto h-12 w-12 rounded-full border-4 border-white shadow" style={{ background: flavor.color }} />
        </div>

        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {PRIZES.map((prize) => {
            const earned = unlocked.includes(prize.id)
            return (
              <div key={prize.id} className={`relative rounded-3xl border-2 p-4 text-center ${earned ? 'border-[#f5c54f] bg-[#fff7d9]' : 'border-slate-200 bg-slate-100'}`}>
                <div className={`text-5xl ${earned ? '' : 'grayscale opacity-25'}`}>{prize.emoji}</div>
                <p className="mt-2 font-display text-lg font-bold text-slate-900">{prize.name}</p>
                <p className="mt-1 text-xs font-bold text-[#6c7390]">{earned ? prize.description : `${prize.threshold} correct answers`}</p>
                {!earned && <LockKeyhole className="absolute right-3 top-3 text-slate-400" size={16} />}
              </div>
            )
          })}
        </div>

        <div className="mt-7 flex items-center justify-between">
          <p className="font-bold text-[#6c7390]">{unlocked.length} of {PRIZES.length} prizes found</p>
          <button onClick={reset} className="inline-flex min-h-11 items-center gap-2 px-2 text-sm font-extrabold text-slate-500">
            <RotateCcw size={16} /> Start over
          </button>
        </div>
      </motion.div>
    </motion.div>
  )
}
