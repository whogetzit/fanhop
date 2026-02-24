'use client'

import { useEffect, useRef, useState } from 'react'
import type { StatWeights, SavedModel } from '@/types/bracket'
import { STAT_GROUPS, STAT_LABELS, DEFAULT_WEIGHTS, PRESETS } from '@/types/bracket'
import { simTournament } from '@/lib/simulation'

const LS_KEY = 'fanhop_models'

function loadModels(): SavedModel[] {
  try { return JSON.parse(localStorage.getItem(LS_KEY) ?? '[]') } catch { return [] }
}
function saveModels(m: SavedModel[]) {
  localStorage.setItem(LS_KEY, JSON.stringify(m))
}

interface Props {
  weights: StatWeights
  modelName: string
  onWeightsChange: (w: StatWeights) => void
  onNameChange: (name: string) => void
}

export default function Sidebar({ weights, modelName, onWeightsChange, onNameChange }: Props) {
  const [saved, setSaved] = useState<SavedModel[]>([])
  const [activeId, setActiveId] = useState<string | null>(null)
  const [toast, setToast] = useState<string | null>(null)
  const [activePreset, setActivePreset] = useState<string | null>('balanced')
  const toastTimer = useRef<ReturnType<typeof setTimeout>>()

  useEffect(() => { setSaved(loadModels()) }, [])

  function showToast(msg: string) {
    clearTimeout(toastTimer.current)
    setToast(msg)
    toastTimer.current = setTimeout(() => setToast(null), 2000)
  }

  function handleSlider(stat: keyof StatWeights, val: number) {
    onWeightsChange({ ...weights, [stat]: val })
    setActivePreset(null)
  }

  function applyPreset(key: string) {
    onWeightsChange(PRESETS[key])
    setActivePreset(key)
    setActiveId(null)
  }

  function handleSave() {
    const name = modelName.trim()
    if (!name) return
    const result = simTournament(weights)
    const models = loadModels()
    const existIdx = models.findIndex(m => m.name.toLowerCase() === name.toLowerCase())
    const model: SavedModel = {
      id: existIdx >= 0 ? models[existIdx].id : Date.now().toString(),
      name,
      weights: { ...weights },
      champion: result.champion,
      savedAt: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    }
    if (existIdx >= 0) { models[existIdx] = model; showToast(`"${name}" updated`) }
    else { models.unshift(model); showToast(`"${name}" saved`) }
    saveModels(models)
    setSaved(loadModels())
    setActiveId(model.id)
  }

  function handleLoad(id: string) {
    const model = saved.find(m => m.id === id)
    if (!model) return
    onWeightsChange(model.weights)
    onNameChange(model.name)
    setActiveId(id)
    setActivePreset(null)
    showToast(`Loaded "${model.name}"`)
  }

  function handleDelete(id: string, e: React.MouseEvent) {
    e.stopPropagation()
    const model = saved.find(m => m.id === id)
    const next = saved.filter(m => m.id !== id)
    saveModels(next)
    setSaved(next)
    if (activeId === id) setActiveId(null)
    if (model) showToast(`"${model.name}" deleted`)
  }

  const totalWeight = Object.values(weights).reduce((a, b) => a + b, 0)

  return (
    <aside
      className="flex flex-col flex-shrink-0 overflow-hidden border-r"
      style={{ width: 260, background: 'var(--navy2)', borderColor: 'var(--rule)' }}
    >
      {/* Title */}
      <div className="flex-shrink-0 px-4 pt-3 pb-2 border-b" style={{ borderColor: 'var(--rule)' }}>
        <div className="font-barlowc font-bold text-lg tracking-[2px] leading-none mb-1" style={{ color: 'var(--orange)' }}>
          Your Model
        </div>
        <div className="text-[11px]" style={{ color: 'var(--muted)' }}>Weight each stat. Bracket auto-fills.</div>
      </div>

      {/* Presets */}
      <div className="flex-shrink-0 flex gap-1 flex-wrap px-4 py-2 border-b" style={{ borderColor: 'var(--rule)' }}>
        {Object.keys(PRESETS).map(key => (
          <button
            key={key}
            onClick={() => applyPreset(key)}
            className="px-2 py-[3px] rounded text-[10px] font-barlowc font-semibold uppercase tracking-[1px] border transition-all"
            style={{
              borderColor: activePreset === key ? 'var(--orange)' : 'var(--dim)',
              color: activePreset === key ? 'var(--orange)' : 'var(--muted)',
              background: activePreset === key ? 'var(--orange-glow)' : 'transparent',
            }}
          >
            {key}
          </button>
        ))}
      </div>

      {/* Sliders */}
      <div
        className="flex-1 overflow-y-auto px-4 py-2"
        style={{ scrollbarWidth: 'thin', scrollbarColor: 'var(--dim) transparent' }}
      >
        {STAT_GROUPS.map(group => (
          <div key={group.label} className="mb-3">
            <div
              className="font-barlowc font-semibold text-[9px] uppercase tracking-[2.5px] mb-2 pb-1 border-b"
              style={{ color: 'var(--orange)', borderColor: 'var(--rule)' }}
            >
              {group.label}
            </div>
            {group.stats.map(stat => (
              <div key={stat} className="flex items-center gap-2 mb-[7px]">
                <span
                  className="text-[11px] flex-shrink-0 overflow-hidden text-ellipsis whitespace-nowrap"
                  style={{ width: 108, color: 'var(--ftext)' }}
                >
                  {STAT_LABELS[stat]}
                </span>
                <input
                  type="range"
                  min={0} max={10} step={1}
                  value={weights[stat]}
                  onChange={e => handleSlider(stat, Number(e.target.value))}
                  className="flex-1"
                />
                <span
                  className="font-barlowc font-bold text-[13px] text-right flex-shrink-0"
                  style={{ width: 18, color: weights[stat] === 0 ? 'var(--dim)' : 'var(--orange)' }}
                >
                  {weights[stat]}
                </span>
              </div>
            ))}
          </div>
        ))}
      </div>

      {/* Total weight */}
      <div
        className="flex-shrink-0 flex justify-between items-center px-4 py-2 border-t"
        style={{ borderColor: 'var(--rule)' }}
      >
        <span className="font-barlowc text-[10px] uppercase tracking-[1px]" style={{ color: 'var(--muted)' }}>
          Total Weight
        </span>
        <span className="font-barlowc font-bold text-2xl leading-none" style={{ color: 'var(--orange)' }}>
          {totalWeight}
        </span>
      </div>

      {/* Save panel */}
      <div className="flex-shrink-0 border-t" style={{ background: 'var(--navy)', borderColor: 'var(--rule)' }}>
        <div className="flex gap-2 px-4 py-2">
          <input
            type="text"
            value={modelName}
            onChange={e => onNameChange(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleSave()}
            placeholder="Name your model…"
            maxLength={32}
            className="flex-1 min-w-0 rounded px-2 py-[6px] text-[12px] border outline-none transition-colors"
            style={{
              background: 'var(--navy3)',
              borderColor: 'var(--dim)',
              color: 'var(--ftext)',
            }}
            onFocus={e => (e.target.style.borderColor = 'var(--orange)')}
            onBlur={e => (e.target.style.borderColor = 'var(--dim)')}
          />
          <button
            onClick={handleSave}
            className="flex-shrink-0 px-3 py-[6px] rounded font-barlowc font-bold text-[12px] uppercase tracking-[1px] text-white transition-colors"
            style={{ background: 'var(--orange)' }}
            onMouseEnter={e => (e.currentTarget.style.background = 'var(--orange2)')}
            onMouseLeave={e => (e.currentTarget.style.background = 'var(--orange)')}
          >
            Save
          </button>
        </div>

        {/* Saved list */}
        {saved.length === 0 ? (
          <p className="px-4 pb-3 text-[11px] italic" style={{ color: 'var(--dim)' }}>
            No saved models yet
          </p>
        ) : (
          <div className="max-h-[152px] overflow-y-auto" style={{ scrollbarWidth: 'thin' }}>
            <div className="px-4 pb-1 font-barlowc font-semibold text-[9px] uppercase tracking-[2px]" style={{ color: 'var(--muted)' }}>
              Saved Models
            </div>
            {saved.map(m => (
              <button
                key={m.id}
                onClick={() => handleLoad(m.id)}
                className="w-full flex items-center px-4 h-[34px] border-t text-left transition-colors relative"
                style={{
                  borderColor: 'var(--rule)',
                  background: m.id === activeId ? 'var(--orange-glow)' : 'transparent',
                }}
                onMouseEnter={e => { if (m.id !== activeId) e.currentTarget.style.background = 'var(--navy2)' }}
                onMouseLeave={e => { if (m.id !== activeId) e.currentTarget.style.background = 'transparent' }}
              >
                {m.id === activeId && (
                  <span
                    className="absolute left-0 top-0 bottom-0 w-[3px] rounded-r"
                    style={{ background: 'var(--orange)' }}
                  />
                )}
                <span
                  className="flex-1 text-[12px] font-medium truncate"
                  style={{ color: m.id === activeId ? 'var(--orange2)' : 'var(--ftext)' }}
                >
                  {m.name}
                </span>
                <span className="text-[10px] truncate max-w-[78px] mr-2" style={{ color: 'var(--muted)' }}>
                  🏆 {m.champion}
                </span>
                <span
                  onClick={e => handleDelete(m.id, e)}
                  className="text-[14px] px-1 rounded cursor-pointer transition-colors"
                  style={{ color: 'var(--dim)' }}
                  onMouseEnter={e => { e.currentTarget.style.color = '#ff5566' }}
                  onMouseLeave={e => { e.currentTarget.style.color = 'var(--dim)' }}
                  title="Delete"
                >
                  ×
                </span>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Toast */}
      {toast && (
        <div
          className="fixed bottom-5 left-[130px] -translate-x-1/2 px-4 py-2 rounded-full font-barlowc font-semibold text-[12px] border z-50 pointer-events-none"
          style={{ background: 'var(--navy2)', borderColor: 'var(--orange)', color: 'var(--orange2)' }}
        >
          {toast}
        </div>
      )}
    </aside>
  )
}
