import type { Metadata } from 'next'
import { parseModelFromSearchParams } from '@/lib/encoding'
import { simTournament } from '@/lib/simulation'
import { DEFAULT_WEIGHTS } from '@/types/bracket'
import BracketApp from '@/components/BracketApp'

interface Props {
  searchParams: Record<string, string>
}

export async function generateMetadata({ searchParams }: Props): Promise<Metadata> {
  const model = parseModelFromSearchParams(searchParams)
  const weights = model?.weights ?? DEFAULT_WEIGHTS
  const result = simTournament(weights)
  const name = model?.name ?? 'My Bracket'
  const m = searchParams['m']

  return {
    title: model?.name ? `${model.name} — Bracket` : 'Build Your Bracket',
    description: `${name} picks ${result.champion} to win it all. Final Four: ${result.finalFour.join(', ')}`,
    openGraph: {
      title: `${name} | FanHop`,
      description: `Picks ${result.champion} to win the 2013 NCAA Tournament`,
      images: m ? [`/api/og?m=${m}`] : ['/api/og'],
    },
    twitter: {
      card: 'summary_large_image',
      title: `${name} | FanHop`,
      description: `Picks ${result.champion} to win it all`,
      images: m ? [`/api/og?m=${m}`] : ['/api/og'],
    },
  }
}

export default function BracketPage({ searchParams }: Props) {
  const model = parseModelFromSearchParams(searchParams)

  return (
    <BracketApp
      initialWeights={model?.weights ?? DEFAULT_WEIGHTS}
      initialName={model?.name}
    />
  )
}
