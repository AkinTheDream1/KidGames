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
  const dimensions = size === 'large' ? 'h-36 w-28 sm:h-44 sm:w-36' : 'h-16 w-14'

  return (
    <motion.div
      aria-label={`Number ${number} character`}
      className={`relative flex flex-col-reverse items-center justify-center ${dimensions}`}
      animate={
        mood === 'dancing'
          ? { rotate: [-8, 8, -8], y: [0, -12, 0], scaleX: [1, 0.92, 1] }
          : mood === 'happy'
            ? { y: [0, -14, 0], scale: [1, 1.06, 1] }
            : { y: [0, -4, 0] }
      }
      transition={{ duration: mood === 'dancing' ? 0.65 : 1.3, repeat: Infinity, ease: 'easeInOut' }}
    >
      {Array.from({ length: blocks }).map((_, index) => (
        <div
          key={index}
          className="relative -mt-px aspect-square w-full rounded-[18%] border-[3px] border-black/10 shadow-[inset_0_5px_0_rgba(255,255,255,.25)]"
          style={{ backgroundColor: color, maxHeight: `${100 / Math.min(blocks, 5)}%` }}
        >
          {index === blocks - 1 && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="absolute left-[22%] top-[28%] h-[10%] w-[10%] rounded-full bg-slate-800" />
              <div className="absolute right-[22%] top-[28%] h-[10%] w-[10%] rounded-full bg-slate-800" />
              <div className="absolute top-[55%] h-[18%] w-[32%] rounded-b-full border-b-[3px] border-slate-800" />
            </div>
          )}
        </div>
      ))}
      {number > 10 && (
        <span className="absolute rounded-full bg-white px-3 py-1 font-display text-xl font-bold text-slate-800 shadow">
          {number}
        </span>
      )}
    </motion.div>
  )
}
