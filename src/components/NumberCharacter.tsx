import { motion } from 'motion/react'

const COLORS = ['#ef4f62', '#f5b83b', '#45cfc0', '#6a7cf6', '#a563dc', '#ff7d4d']

interface NumberCharacterProps {
  number: number
  mood?: 'thinking' | 'happy' | 'dancing'
  size?: 'small' | 'large'
}

export function NumberCharacter({ number, mood = 'thinking', size = 'large' }: NumberCharacterProps) {
  const blocks = Math.min(number, 10)
  const color = COLORS[(number - 1) % COLORS.length]
  const dimensions = size === 'large' ? 'h-36 w-28 sm:h-40 sm:w-32' : 'h-20 w-16'

  return (
    <motion.div
      aria-label={`Number ${number} character`}
      className={`relative flex items-center justify-center ${dimensions}`}
      animate={
        mood === 'dancing'
          ? { rotate: [-8, 8, -8], y: [0, -12, 0], scaleX: [1, 0.92, 1] }
          : mood === 'happy'
            ? { y: [0, -14, 0], scale: [1, 1.06, 1] }
            : { y: [0, -4, 0] }
      }
      transition={{ duration: mood === 'dancing' ? 0.65 : 1.3, repeat: Infinity, ease: 'easeInOut' }}
    >
      <div
        className="relative h-full w-full overflow-hidden rounded-[22%] border-[3px] border-black/10 shadow-[inset_0_7px_0_rgba(255,255,255,.25),0_8px_0_rgba(30,38,61,.12)]"
        style={{ backgroundColor: color }}
      >
        {Array.from({ length: Math.min(blocks - 1, 5) }).map((_, index) => (
          <span
            key={index}
            className="absolute left-0 h-px w-full bg-black/10"
            style={{ top: `${((index + 1) / Math.min(blocks, 6)) * 100}%` }}
          />
        ))}
        <div className="absolute inset-x-0 top-[15%] h-[42%]">
          <div className="absolute left-[22%] top-[18%] h-[12%] w-[12%] rounded-full bg-slate-800" />
          <div className="absolute right-[22%] top-[18%] h-[12%] w-[12%] rounded-full bg-slate-800" />
          <div className="absolute left-1/2 top-[52%] h-[22%] w-[34%] -translate-x-1/2 rounded-b-full border-b-[3px] border-slate-800" />
        </div>
        <span className="absolute bottom-[8%] left-1/2 -translate-x-1/2 font-display text-2xl font-bold text-white drop-shadow-sm">
          {number}
        </span>
      </div>
    </motion.div>
  )
}
