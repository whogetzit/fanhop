// @ts-nocheck
'use client'

import { useEffect, useRef, useState, useCallback } from 'react'
import type { StatWeights } from '@/types/bracket'
import { STAT_GROUPS, STAT_LABELS, PRESETS } from '@/types/bracket'
import { simTournament } from '@/lib/simulation'
import { saveModelToCloud, loadModelsFromCloud, deleteModelFromCloud } from '@/lib/supabase'
import type { User } from '@supabase/supabase-js'

interface CloudModel {
  id: string
  name: string
  champion: string | null
  weights: Record<string, number>
  is_public: boolean
  updated_at: string
}

interface Props {
  weights: StatWeights
  modelName: string
  user: User | null
  onWeightsChange: (w: StatWeights) => void
  onNameChange: (name: string) => void
  onNeedAuth: () => void
  onToast: (msg: string) => void
}

export default function Sidebar({ weights, modelName, user, onWeightsChange, onNameChange, onNeedAuth, onToast }: Props) {
  const [saved, setSaved] = useState<CloudModel[]>([])
  const [activeId, setActiveId] = useState<string | null>(null)
  const [activePreset, setActivePreset] = useState<string | null>('balanced')
  const [saving, setSaving] = useState(false)

  // Load models from cloud when user signs in
  useEffect(() => {
    if (user) {
      loadModelsFromCloud().then(models => setSaved(models as CloudModel[]))
    } else {
      setSaved([])
      setActiveId(null)
    }
  }, [user])

 function handleSlider(stat: keyof StatWeights, val: number) {
  onWeightsChange({ ...weights, [stat]: val })
  setActivePreset(null)
  onPresetChange={setActivePreset}
}

  function applyPreset(key: string) {
  onWeightsChange(PRESETS[key])
  setActivePreset(key)
  setActiveId(null)
  onPresetChange(key)
}

  async function handleSave() {
    if (!user) { onNeedAuth(); return }
    const name = modelName.trim()
    if (!name) { onToast('Name your model first'); return }

    setSaving(true)
    try {
      const result = simTournament(weights)
      await saveModelToCloud(name, weights as Record<string, number>, result.champion)
      const models = await loadModelsFromCloud()
      setSaved(models as CloudModel[])
      const saved = models.find((m: any) => m.name === name)
      if (saved) setActiveId(saved.id)
      onToast(`"${name}" saved`)
    } catch (e: any) {
      onToast('Save failed: ' + e.message)
    } finally {
      setSaving(false)
    }
  }

  function handleLoad(model: CloudModel) {
    onWeightsChange(model.weights as StatWeights)
    onNameChange(model.name)
    setActiveId(model.id)
    setActivePreset(null)
    onToast(`Loaded "${model.name}"`)
  }

  async function handleDelete(id: string, e: React.MouseEvent) {
    e.stopPropagation()
    const model = saved.find(m => m.id === id)
    try {
      await deleteModelFromCloud(id)
      setSaved(prev => prev.filter(m => m.id !== id))
      if (activeId === id) setActiveId(null)
      if (model) onToast(`"${model.name}" deleted`)
    } catch {
      onToast('Delete failed')
    }
  }

  const totalWeight = Object.values(weights).reduce((a, b) => a + b, 0)

  return (
    <aside
      className="flex flex-col flex-shrink-0 border-r"
      style={{ width: 260, background: 'var(--navy2)', borderColor: 'var(--rule)' }}
    >
      {/* Title */}
      <div className="flex-shrink-0 px-3 pt-2 pb-1 border-b" style={{ borderColor: 'var(--rule)' }}>
        <div className="font-barlowc font-bold text-base tracking-[2px] leading-none" style={{ color: 'var(--orange)' }}>
          Your Model
        </div>
      </div>

      {/* Presets */}
      <div className="flex-shrink-0 flex gap-1 flex-wrap px-3 py-1 border-b" style={{ borderColor: 'var(--rule)' }}>
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

      {/* Sliders — no scroll, compressed to fit */}
      <div className="flex-1 px-3 py-1 overflow-hidden">
        {STAT_GROUPS.map(group => (
          <div key={group.label} className="mb-1">
            <div
              className="font-barlowc font-semibold text-[8px] uppercase tracking-[2px] mb-[2px] pb-[1px] border-b"
              style={{ color: 'var(--orange)', borderColor: 'var(--rule)' }}
            >
              {group.label}
            </div>
            {group.stats.map(stat => (
              <div key={stat} className="flex items-center gap-1 mb-[2px]">
                <span className="text-[10px] flex-shrink-0 overflow-hidden text-ellipsis whitespace-nowrap"
                  style={{ width: 85, color: 'var(--ftext)' }}>
                  {STAT_LABELS[stat]}
                </span>
                <input
                  type="range" min={0} max={10} step={1}
                  value={weights[stat]}
                  onChange={e => handleSlider(stat, Number(e.target.value))}
                  className="flex-1"
                  style={{ height: 14 }}
                />
                <span className="font-barlowc font-bold text-[11px] text-right flex-shrink-0"
                  style={{ width: 20, color: weights[stat] === 0 ? 'var(--dim)' : 'var(--orange)' }}>
                  {weights[stat]}
                </span>
              </div>
            ))}
          </div>
        ))}
      </div>

      {/* Total weight */}
      <div className="flex-shrink-0 flex justify-between items-center px-3 py-1 border-t" style={{ borderColor: 'var(--rule)' }}>
        <span className="font-barlowc text-[9px] uppercase tracking-[1px]" style={{ color: 'var(--muted)' }}>Total Weight</span>
        <span className="font-barlowc font-bold text-xl leading-none" style={{ color: 'var(--orange)' }}>{totalWeight}</span>
      </div>

      {/* Save panel */}
      <div className="flex-shrink-0 border-t" style={{ background: 'var(--navy)', borderColor: 'var(--rule)' }}>
        <div className="flex gap-2 px-3 py-1">
          <input
            type="text"
            value={modelName}
            onChange={e => onNameChange(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleSave()}
            placeholder="Name your model…"
            maxLength={32}
            className="flex-1 min-w-0 rounded px-2 py-[6px] text-[12px] border outline-none transition-colors"
            style={{ background: 'var(--navy3)', borderColor: 'var(--dim)', color: 'var(--ftext)' }}
            onFocus={e => (e.target.style.borderColor = 'var(--orange)')}
            onBlur={e => (e.target.style.borderColor = 'var(--dim)')}
          />
          <button
            onClick={handleSave}
            disabled={saving}
            className="flex-shrink-0 px-3 py-[6px] rounded font-barlowc font-bold text-[12px] uppercase tracking-[1px] text-white transition-colors"
            style={{ background: 'var(--orange)', opacity: saving ? 0.6 : 1 }}
            onMouseEnter={e => (e.currentTarget.style.background = 'var(--orange2)')}
            onMouseLeave={e => (e.currentTarget.style.background = 'var(--orange)')}
          >
            {saving ? '…' : user ? 'Save' : 'Save ↑'}
          </button>
        </div>

        {!user && (
          <div className="px-4 pb-2 text-[11px]" style={{ color: 'var(--dim)' }}>
            <button onClick={onNeedAuth} className="underline" style={{ color: 'var(--muted)' }}>Sign in</button>
            {' '}to save to the cloud
          </div>
        )}

        {/* Saved list */}
        {saved.length === 0 ? (
          user ? (
            <p className="px-4 pb-3 text-[11px] italic" style={{ color: 'var(--dim)' }}>No saved models yet</p>
          ) : null
        ) : (
          <div className="max-h-[152px] overflow-y-auto" style={{ scrollbarWidth: 'thin' }}>
            <div className="px-4 pb-1 font-barlowc font-semibold text-[9px] uppercase tracking-[2px]" style={{ color: 'var(--muted)' }}>
              Saved Models
            </div>
            {saved.map(m => (
              <button
                key={m.id}
                onClick={() => handleLoad(m)}
                className="w-full flex items-center px-4 h-[34px] border-t text-left transition-colors relative"
                style={{
                  borderColor: 'var(--rule)',
                  background: m.id === activeId ? 'var(--orange-glow)' : 'transparent',
                }}
                onMouseEnter={e => { if (m.id !== activeId) e.currentTarget.style.background = 'var(--navy2)' }}
                onMouseLeave={e => { if (m.id !== activeId) e.currentTarget.style.background = 'transparent' }}
              >
                {m.id === activeId && (
                  <span className="absolute left-0 top-0 bottom-0 w-[3px] rounded-r" style={{ background: 'var(--orange)' }} />
                )}
                <span className="flex-1 text-[12px] font-medium truncate"
                  style={{ color: m.id === activeId ? 'var(--orange2)' : 'var(--ftext)' }}>
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
                >×</span>
              </button>
            ))}
          </div>
        )}
      </div>
    </aside>
  )
}