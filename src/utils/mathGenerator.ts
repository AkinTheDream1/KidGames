import type { MathProblem } from '../types/game'

const shuffle = <T,>(items: T[]) => [...items].sort(() => Math.random() - 0.5)

const optionsFor = (answer: number, min = 1, max = 10) => {
  const choices = new Set([answer])
  let offset = 1
  while (choices.size < 3) {
    choices.add(Math.min(max, Math.max(min, answer + (offset % 2 ? offset : -offset))))
    offset += 1
    if (offset > max + 2) choices.add(min + choices.size - 1)
  }
  return shuffle([...choices])
}

export const getDifficultyRange = (level: number): [number, number] => {
  if (level <= 10) return [1, level]
  if (level <= 20) return [1, Math.min(10, level - 10)]
  return [1, Math.min(5, Math.ceil((level - 20) / 2) + 1)]
}

export const generateCountingProblem = (level: number): MathProblem => {
  const [, max] = getDifficultyRange(level)
  const answer = Math.max(1, Math.ceil(Math.random() * max))
  return {
    id: crypto.randomUUID(),
    stage: 'counting',
    prompt: 'Tap each scoop to count!',
    answer,
    options: [],
    quantities: [answer],
  }
}

export const generateNumberRecognition = (level: number): MathProblem => {
  const [, max] = getDifficultyRange(level)
  const answer = Math.max(1, Math.ceil(Math.random() * max))
  return {
    id: crypto.randomUUID(),
    stage: 'recognition',
    prompt: 'How many stars can you see?',
    answer,
    options: optionsFor(answer),
    quantities: [answer],
  }
}

export const generateAddition = (level: number): MathProblem => {
  const [, max] = getDifficultyRange(level)
  const first = Math.max(1, Math.ceil(Math.random() * max))
  const second = Math.max(1, Math.ceil(Math.random() * max))
  const answer = first + second
  return {
    id: crypto.randomUUID(),
    stage: 'addition',
    prompt: `${first} + ${second} = ?`,
    answer,
    options: optionsFor(answer, 1, 10),
    quantities: [first, second],
  }
}

export const generateProblem = (level: number): MathProblem => {
  if (level <= 10) return generateCountingProblem(level)
  if (level <= 20) return generateNumberRecognition(level)
  return generateAddition(level)
}
