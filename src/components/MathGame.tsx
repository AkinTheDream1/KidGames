import { useState } from 'react'
import { checkAnswer, createQuestion, type MathQuestion } from '../games/math'

type Status = 'idle' | 'correct' | 'wrong'

export default function MathGame() {
  const [question, setQuestion] = useState<MathQuestion>(() => createQuestion())
  const [score, setScore] = useState(0)
  const [status, setStatus] = useState<Status>('idle')
  const [picked, setPicked] = useState<number | null>(null)

  function handlePick(choice: number) {
    if (status !== 'idle') return
    setPicked(choice)
    if (checkAnswer(question, choice)) {
      setStatus('correct')
      setScore((s) => s + 1)
    } else {
      setStatus('wrong')
    }
  }

  function next() {
    setQuestion(createQuestion())
    setStatus('idle')
    setPicked(null)
  }

  return (
    <div className="panel">
      <div className="toolbar">
        <span className="badge">Score: {score}</span>
        <button className="btn secondary" onClick={next}>
          Skip
        </button>
      </div>

      <div className="math-question" aria-label="question">
        {question.a} {question.op} {question.b} = ?
      </div>

      <div className="math-options">
        {question.options.map((option) => {
          let className = 'math-option'
          if (status !== 'idle' && option === question.answer) {
            className += ' correct'
          } else if (status === 'wrong' && option === picked) {
            className += ' wrong'
          }
          return (
            <button
              key={option}
              className={className}
              onClick={() => handlePick(option)}
            >
              {option}
            </button>
          )
        })}
      </div>

      <p className="feedback">
        {status === 'correct' && '✅ Correct!'}
        {status === 'wrong' && `❌ The answer was ${question.answer}`}
      </p>

      {status !== 'idle' && (
        <div style={{ textAlign: 'center' }}>
          <button className="btn success" onClick={next}>
            Next question →
          </button>
        </div>
      )}
    </div>
  )
}
