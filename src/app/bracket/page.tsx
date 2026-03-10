import type { Metadata } from 'next'
import { parseModelFromSearchParams } from '@/lib/encoding'
import { simTournament } from '@/lib/simulation'
import { DEFAULT_WEIGHTS, PRESETS } from '@/types/bracket'
import BracketApp from '@/components/BracketApp'

export const dynamic = 'force-dynamic'

interface Props {
  searchParams: Record<string, string>
}

export async function generateMetadata({ searchParams }: Props): Promise<Metadata> {
  const model = parseModelFromSearchParams(searchParams)
  const preset = searchParams['p']
  const weights = preset && PRESETS[preset] ? PRESETS[preset] : model?.weights ?? DEFAULT_WEIGHTS
  const result = simTournament(weights)
  const name = model?.name ?? 'My Bracket'
  const m = searchParams['m']

  return {
    title: model?.name ? `${model.name} — Bracket` : 'Build Your Bracket',
    description: `${name} picks ${result.champion} to win it all. Final Four: ${result.finalFour.join(', ')}`,
    openGraph: {
      title: `${name} | FanHop`,
      description: `Picks ${result.champion} to win the 2025 NCAA Tournament`,
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
  const preset = searchParams['p'] ?? undefined

  return (
    <BracketApp
      initialWeights={preset && PRESETS[preset] ? PRESETS[preset] : model?.weights ?? DEFAULT_WEIGHTS}
      initialName={model?.name}
      initialPreset={preset}
    />
  )
}
