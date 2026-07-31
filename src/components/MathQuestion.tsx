import { useEffect, useMemo, useState } from 'react'
import confetti from 'canvas-confetti'
import { AnimatePresence, motion } from 'motion/react'
import { ArrowRight, Sparkles } from 'lucide-react'
import { useGameStore } from '../stores/gameStore'
import { generateProblem } from '../utils/mathGenerator'
import { NumberCharacter } from './NumberCharacter'

const ENCOURAGEMENTS = ['Almost! Try another one.', 'Good thinking — have another go!', 'So close! You can do it.']

export function MathQuestion() {
  const level = useGameStore((state) => state.currentLevel)
  const levelStreak = useGameStore((state) => state.levelStreak)
  const recordCorrect = useGameStore((state) => state.recordCorrect)
  const recordWrong = useGameStore((state) => state.recordWrong)
  const [round, setRound] = useState(0)
  const [counted, setCounted] = useState<number[]>([])
  const [feedback, setFeedback] = useState<'correct' | 'wrong' | null>(null)
  const [message, setMessage] = useState('')
  const problem = useMemo(() => generateProblem(level), [level, round])

  useEffect(() => {
    setCounted([])
    setFeedback(null)
  }, [problem.id])

  const celebrate = () => {
    setFeedback('correct')
    setMessage(['Brilliant!', 'You got it!', 'Super counting!'][Math.floor(Math.random() * 3)])
    recordCorrect()
    confetti({
      particleCount: 45,
      spread: 65,
      origin: { y: 0.65 },
      colors: ['#ef4f62', '#f5b83b', '#45cfc0', '#6a7cf6'],
      disableForReducedMotion: true,
    })
  }

  const chooseAnswer = (answer: number) => {
    if (feedback === 'correct') return
    if (answer === problem.answer) {
      celebrate()
    } else {
      recordWrong()
      setFeedback('wrong')
      setMessage(ENCOURAGEMENTS[Math.floor(Math.random() * ENCOURAGEMENTS.length)])
      window.setTimeout(() => setFeedback(null), 900)
    }
  }

  const countItem = (index: number) => {
    if (counted.includes(index) || feedback) return
    const next = [...counted, index]
    setCounted(next)
    if (next.length === problem.answer) window.setTimeout(celebrate, 180)
  }

  const nextQuestion = () => {
    setFeedback(null)
    setCounted([])
    setRound((value) => value + 1)
  }

  const stageLabel = level <= 10 ? 'Counting Garden' : level <= 20 ? 'Number Meadow' : 'Adding Adventure'

  return (
    <main className="mx-auto flex w-full max-w-5xl flex-1 flex-col px-4 pb-6 sm:px-8 sm:pb-10">
      <div className="mb-4 flex items-center justify-between px-1">
        <div>
          <p className="text-sm font-extrabold uppercase tracking-[0.16em] text-[#6c7390]">{stageLabel}</p>
          <h1 className="font-display text-xl font-bold text-slate-900">Level {level}</h1>
        </div>
        <div className="flex gap-2" aria-label={`${levelStreak} of 3 stars earned this level`}>
          {[0, 1, 2].map((star) => (
            <motion.span
              key={star}
              animate={star < levelStreak ? { scale: [0.7, 1.25, 1], rotate: [0, 14, 0] } : {}}
              className={`text-2xl ${star < levelStreak ? '' : 'grayscale opacity-25'}`}
            >
              ⭐
            </motion.span>
          ))}
        </div>
      </div>

      <section className="game-card relative flex flex-1 flex-col items-center justify-between overflow-hidden p-5 sm:p-8">
        <div className="absolute -left-12 -top-14 h-36 w-36 rounded-full bg-[#fff0c8]" />
        <div className="absolute -bottom-20 -right-12 h-48 w-48 rounded-full bg-[#dff7f2]" />
        <div className="relative z-10 flex w-full flex-1 flex-col items-center justify-center">
          <AnimatePresence mode="wait">
            {feedback === 'correct' ? (
              <motion.div
                key="celebrate"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, y: -20 }}
                className="flex flex-col items-center text-center"
              >
                <div className="mb-3 rounded-full bg-[#fff2bc] p-3 text-[#9b6a00]"><Sparkles size={28} /></div>
                <h2 className="font-display text-4xl font-bold text-slate-900 sm:text-5xl">{message}</h2>
                <p className="mt-2 text-lg font-bold text-[#6c7390]">You earned a delicious scoop!</p>
                <NumberCharacter number={problem.answer} mood="happy" />
                <button className="primary-button mt-4" onClick={nextQuestion}>
                  Next question <ArrowRight size={22} />
                </button>
              </motion.div>
            ) : (
              <motion.div
                key={problem.id}
                initial={{ opacity: 0, x: 18 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -18 }}
                className="flex w-full flex-col items-center text-center"
              >
                <p className="mb-2 text-lg font-extrabold text-[#6c7390]">{problem.prompt}</p>
                {problem.stage === 'addition' && (
                  <div className="mb-4 font-display text-5xl font-bold text-slate-900 sm:text-6xl">{problem.prompt}</div>
                )}
                <VisualProblem problem={problem} counted={counted} onCount={countItem} />
                {problem.stage !== 'counting' && (
                  <div className="mt-6 grid w-full max-w-xl grid-cols-3 gap-3 sm:gap-4">
                    {problem.options.map((option, index) => (
                      <motion.button
                        key={option}
                        whileTap={{ scale: 0.94 }}
                        className={`answer-button answer-${index}`}
                        onClick={() => chooseAnswer(option)}
                        aria-label={`Answer ${option}`}
                      >
                        {option}
                      </motion.button>
                    ))}
                  </div>
                )}
                <div className="mt-4 h-7 text-base font-extrabold text-[#cf4b58]" role="status">
                  {feedback === 'wrong' ? message : problem.stage === 'counting' ? `${counted.length} counted` : ''}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </section>
    </main>
  )
}

function VisualProblem({
  problem,
  counted,
  onCount,
}: {
  problem: ReturnType<typeof generateProblem>
  counted: number[]
  onCount: (index: number) => void
}) {
  if (problem.stage === 'addition') {
    return (
      <div className="flex items-center gap-4 sm:gap-8" aria-hidden="true">
        {[problem.quantities[0], problem.quantities[1] ?? 0].map((quantity, group) => (
          <div key={group} className="flex max-w-40 flex-wrap justify-center gap-2 rounded-3xl bg-white/70 p-3">
            {Array.from({ length: quantity }).map((_, index) => <span key={index} className="text-4xl">🍨</span>)}
          </div>
        ))}
      </div>
    )
  }

  const icon = problem.stage === 'recognition' ? '⭐' : '🍦'
  return (
    <div className="my-4 flex max-w-2xl flex-wrap justify-center gap-3 sm:gap-4" aria-label={`${problem.answer} items`}>
      {Array.from({ length: problem.answer }).map((_, index) => {
        const isCounted = counted.includes(index)
        return (
          <motion.button
            key={index}
            type="button"
            disabled={problem.stage !== 'counting' || isCounted}
            onClick={() => onCount(index)}
            whileTap={{ scale: 0.85 }}
            animate={isCounted ? { y: -10, scale: 1.14, rotate: index % 2 ? 6 : -6 } : {}}
            className={`relative grid h-16 w-16 place-items-center rounded-2xl text-4xl sm:h-20 sm:w-20 sm:text-5xl ${
              problem.stage === 'counting' ? 'cursor-pointer bg-white shadow-[0_5px_0_#dde4f1]' : 'bg-transparent'
            }`}
            aria-label={problem.stage === 'counting' ? `Count scoop ${index + 1}` : undefined}
          >
            {icon}
            {isCounted && <span className="absolute -right-1 -top-2 grid h-7 w-7 place-items-center rounded-full bg-slate-900 text-sm font-bold text-white">{counted.indexOf(index) + 1}</span>}
          </motion.button>
        )
      })}
    </div>
  )
}
