import { useState } from 'react'
import { AnimatePresence } from 'motion/react'
import { DanceBreak } from './components/DanceBreak'
import { MathQuestion } from './components/MathQuestion'
import { PrizeRoom } from './components/PrizeRoom'
import { RewardDisplay } from './components/RewardDisplay'
import { useGameStore } from './stores/gameStore'

export default function App() {
  const [showPrizes, setShowPrizes] = useState(false)
  const danceDue = useGameStore((state) => state.danceDue)

  return (
    <div className="app-shell">
      <div className="floating-shape shape-one" />
      <div className="floating-shape shape-two" />
      <RewardDisplay onOpenPrizes={() => setShowPrizes(true)} />
      <MathQuestion />
      <footer className="pb-4 text-center text-xs font-bold text-[#7a819a]">
        Grown-ups: progress stays safely on this device.
      </footer>
      <AnimatePresence>
        {danceDue && <DanceBreak key="dance" />}
        {showPrizes && <PrizeRoom key="prizes" onClose={() => setShowPrizes(false)} />}
      </AnimatePresence>
    </div>
  )
}
