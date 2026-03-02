import type { Metadata } from 'next'
import { parseModelFromSearchParams, decodeBracket } from '@/lib/encoding'
import { simTournament } from '@/lib/simulation'
import { DEFAULT_WEIGHTS, PRESETS } from '@/types/bracket'
import BracketApp from '@/components/BracketApp'

interface Props {
  searchParams: Record<string, string>
}

export async function generateMetadata({ searchParams }: Props): Promise<Metadata> {
  const model = parseModelFromSearchParams(searchParams)
  const bracketParam = searchParams['b']
  const preset = searchParams['p']
  const bracketResult = bracketParam ? decodeBracket(bracketParam) : null

  const weights = model?.weights ?? (preset && PRESETS[preset]) ?? DEFAULT_WEIGHTS
  const result = bracketResult ?? simTournament(weights)
  const name = model?.name ?? (preset ? preset.charAt(0).toUpperCase() + preset.slice(1) : 'My Bracket')
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
  const bracketParam = searchParams['b']
  const preset = searchParams['p']
  const bracketResult = bracketParam ? decodeBracket(bracketParam) : null
  const presetWeights = preset && PRESETS[preset] ? PRESETS[preset] : undefined

  return (
    <BracketApp
      initialWeights={model?.weights ?? presetWeights ?? DEFAULT_WEIGHTS}
      initialName={model?.name}
      initialPreset={preset}
      initialResult={bracketResult ?? undefined}
    />
  )
}
