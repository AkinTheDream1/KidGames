export type Operation = '+' | '-'

export interface MathQuestion {
  a: number
  b: number
  op: Operation
  answer: number
  options: number[]
}

function randInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

/**
 * Generate an addition/subtraction question with 4 answer options.
 * Subtraction never yields a negative answer.
 */
export function createQuestion(maxValue = 10): MathQuestion {
  const op: Operation = Math.random() < 0.5 ? '+' : '-'
  let a = randInt(1, maxValue)
  let b = randInt(1, maxValue)
  if (op === '-' && b > a) {
    ;[a, b] = [b, a]
  }
  const answer = op === '+' ? a + b : a - b

  const options = new Set<number>([answer])
  while (options.size < 4) {
    const delta = randInt(-3, 3)
    const candidate = answer + delta
    if (candidate >= 0) {
      options.add(candidate)
    }
  }

  return {
    a,
    b,
    op,
    answer,
    options: shuffleNumbers([...options]),
  }
}

function shuffleNumbers(nums: number[]): number[] {
  const arr = [...nums]
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[arr[i], arr[j]] = [arr[j], arr[i]]
  }
  return arr
}

export function checkAnswer(question: MathQuestion, choice: number): boolean {
  return question.answer === choice
}
