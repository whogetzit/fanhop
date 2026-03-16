'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase'

function getOrCreateVisitorId(): string {
  const key = 'fh_vid'
  if (typeof document === 'undefined') return ''

  // Check existing cookie
  const match = document.cookie.match(new RegExp(`(?:^|; )${key}=([^;]*)`))
  if (match) return match[1]

  // Generate new UUID
  const id = crypto.randomUUID()
  const expires = new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toUTCString()
  document.cookie = `${key}=${id}; path=/; expires=${expires}; SameSite=Lax`
  return id
}

interface AnalyticsCounts {
  uniqueVisitors: number
  modelsCreated: number
}

export function useAnalytics(): AnalyticsCounts {
  const [counts, setCounts] = useState<AnalyticsCounts>({
    uniqueVisitors: 0,
    modelsCreated: 0,
  })

  useEffect(() => {
    const supabase = createClient()
    if (!supabase) return

    // Record visit
    const visitorId = getOrCreateVisitorId()
    if (visitorId) {
      supabase.rpc('record_visit', { p_visitor_id: visitorId }).then(() => {})
    }

    // Fetch initial counts
    supabase
      .from('analytics')
      .select('unique_visitors, models_created')
      .eq('id', 1)
      .single()
      .then(({ data }: { data: { unique_visitors: number; models_created: number } | null }) => {
        if (data) {
          setCounts({
            uniqueVisitors: data.unique_visitors,
            modelsCreated: data.models_created,
          })
        }
      })

    // Subscribe to realtime updates
    const channel = supabase
      .channel('analytics-changes')
      .on(
        'postgres_changes',
        { event: 'UPDATE', schema: 'public', table: 'analytics', filter: 'id=eq.1' },
        (payload: { new: { unique_visitors: number; models_created: number } }) => {
          const row = payload.new as { unique_visitors: number; models_created: number }
          setCounts({
            uniqueVisitors: row.unique_visitors,
            modelsCreated: row.models_created,
          })
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [])

  return counts
}
