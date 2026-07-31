export type Stage = 'counting' | 'recognition' | 'addition'

export interface MathProblem {
  id: string
  stage: Stage
  prompt: string
  answer: number
  options: number[]
  quantities: [number, number?]
}

export interface Prize {
  id: string
  name: string
  description: string
  threshold: number
  emoji: string
}
