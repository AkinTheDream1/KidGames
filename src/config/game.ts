import type { Prize } from '../types/game'

export const REWARDS = {
  iceCreamPerCorrect: 1,
  streakResetThreshold: 2,
  danceBreakFrequency: 5,
  danceBreakDuration: 45,
  inactivityMinutes: 30,
} as const

export const PRIZES: Prize[] = [
  { id: 'sunny-sticker', name: 'Sunny Sticker', description: 'A bright new friend!', threshold: 5, emoji: '🌞' },
  { id: 'dance-song', name: 'Dance Party', description: 'A brand new dance song!', threshold: 15, emoji: '🎵' },
  { id: 'rainbow-avatar', name: 'Rainbow Hero', description: 'A colorful new look!', threshold: 25, emoji: '🌈' },
  { id: 'champion-badge', name: 'Math Champion', description: 'You are a counting star!', threshold: 50, emoji: '🏆' },
]

export const FLAVORS = [
  { threshold: 0, name: 'Berry Bright', color: '#f55b8a' },
  { threshold: 10, name: 'Rainbow Swirl', color: '#7c6cf2' },
  { threshold: 25, name: 'Cotton Candy', color: '#45cfc0' },
  { threshold: 50, name: 'Champion Gold', color: '#f5b83b' },
]
