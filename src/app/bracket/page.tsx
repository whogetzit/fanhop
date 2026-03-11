import type { Metadata } from 'next'
import { parseModelFromSearchParams, decodeBracket } from '@/lib/encoding'
import { simTournament, DEFAULT_YEAR } from '@/lib/simulation'
import type { TournamentYear } from '@/lib/simulation'
import { DEFAULT_WEIGHTS, PRESETS } from '@/types/bracket'
import BracketApp from '@/components/BracketApp'

interface Props {
  searchParams: Record<string, string>
}

function getYear(searchParams: Record<string, string>): TournamentYear {
  const y = searchParams['y']
  if (y === '2013' || y === '2025') return y
  return DEFAULT_YEAR
}

export async function generateMetadata({ searchParams }: Props): Promise<Metadata> {
  const model = parseModelFromSearchParams(searchParams)
  const year = getYear(searchParams)
  const b = searchParams['b']
  const bracketResult = b ? decodeBracket(b, year) : null
  const preset = searchParams['p']

  const weights = preset && PRESETS[preset] ? PRESETS[preset] : model?.weights ?? DEFAULT_WEIGHTS
  const result = bracketResult ?? simTournament(weights)
  const name = model?.name ?? 'My Bracket'
  const m = searchParams['m']
  const yParam = year !== DEFAULT_YEAR ? `&y=${year}` : ''

  return {
    title: model?.name ? `${model.name} — Bracket` : 'Build Your Bracket',
    description: `${name} picks ${result.champion} to win it all. Final Four: ${result.finalFour.join(', ')}`,
    openGraph: {
      title: `${name} | FanHop`,
      description: `Picks ${result.champion} to win the ${year} NCAA Tournament`,
      images: m ? [`/api/og?m=${m}${yParam}`] : ['/api/og'],
    },
    twitter: {
      card: 'summary_large_image',
      title: `${name} | FanHop`,
      description: `Picks ${result.champion} to win it all`,
      images: m ? [`/api/og?m=${m}${yParam}`] : ['/api/og'],
    },
  }
}

export default function BracketPage({ searchParams }: Props) {
  const model = parseModelFromSearchParams(searchParams)
  const year = getYear(searchParams)
  const b = searchParams['b']
  const preset = searchParams['p'] ?? undefined
  const bracketResult = b ? decodeBracket(b, year) : null

  return (
    <BracketApp
      initialWeights={preset && PRESETS[preset] ? PRESETS[preset] : model?.weights ?? DEFAULT_WEIGHTS}
      initialName={model?.name}
      initialPreset={preset}
      initialResult={bracketResult ?? undefined}
    />
  )
}
