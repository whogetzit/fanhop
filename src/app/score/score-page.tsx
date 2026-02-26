import type { Metadata } from 'next'
import ScoreClient from './ScoreClient'

export const metadata: Metadata = {
  title: 'Score Your 2025 Bracket — FanHop',
  description: 'See how your model would have scored against the real 2025 NCAA Tournament results.',
}

export default function ScorePage() {
  return <ScoreClient />
}
