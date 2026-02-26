import type { ModelState, StatWeights } from '@/types/bracket'
import { DEFAULT_WEIGHTS, STAT_KEYS } from '@/types/bracket'

// ─── v1 encoding: compact binary packing ─────────────────────────────────────
// 17 stats × 4 bits each (values 0–10) = 68 bits packed into 9 bytes → ~12 base64 chars
// Name is appended as UTF-8 after the packed weights.

const WEIGHT_COUNT = STAT_KEYS.length  // 17

function packWeights(w: StatWeights): Uint8Array {
  // Each value is 0–10, fits in 4 bits. Pack pairs into bytes.
  const bytes = new Uint8Array(Math.ceil(WEIGHT_COUNT / 2))
  for (let i = 0; i < WEIGHT_COUNT; i++) {
    const val = Math.max(0, Math.min(10, w[STAT_KEYS[i]]))
    if (i % 2 === 0) {
      bytes[Math.floor(i / 2)] = val << 4
    } else {
      bytes[Math.floor(i / 2)] |= val
    }
  }
  return bytes
}

function unpackWeights(bytes: Uint8Array): StatWeights {
  const w: Partial<StatWeights> = {}
  for (let i = 0; i < WEIGHT_COUNT; i++) {
    const byte = bytes[Math.floor(i / 2)]
    const val = i % 2 === 0 ? (byte >> 4) & 0x0f : byte & 0x0f
    w[STAT_KEYS[i]] = val
  }
  return w as StatWeights
}

// Safe base64url (no +/= chars that need URL encoding)
function toBase64url(bytes: Uint8Array): string {
  let binary = ''
  for (let i = 0; i < bytes.length; i++) binary += String.fromCharCode(bytes[i])
  return btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '')
}

function fromBase64url(str: string): Uint8Array {
  const padded = str.replace(/-/g, '+').replace(/_/g, '/') + '=='.slice(0, (4 - str.length % 4) % 4)
  const binary = atob(padded)
  const bytes = new Uint8Array(binary.length)
  for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i)
  return bytes
}

// ─── Public API ───────────────────────────────────────────────────────────────

export function encodeModel(state: ModelState): string {
  const weightBytes = packWeights(state.weights)

  if (!state.name) {
    return toBase64url(weightBytes)
  }

  // Append name as UTF-8 bytes with a 0x00 separator
  const nameBytes = new TextEncoder().encode(state.name)
  const combined = new Uint8Array(weightBytes.length + 1 + nameBytes.length)
  combined.set(weightBytes)
  combined[weightBytes.length] = 0x00  // separator
  combined.set(nameBytes, weightBytes.length + 1)
  return toBase64url(combined)
}

export function decodeModel(param: string): ModelState | null {
  try {
    const bytes = fromBase64url(param)
    const weightByteCount = Math.ceil(WEIGHT_COUNT / 2)  // 9 bytes

    if (bytes.length < weightByteCount) return null

    const weights = unpackWeights(bytes.slice(0, weightByteCount))

    // Check for name separator
    let name: string | undefined
    if (bytes.length > weightByteCount && bytes[weightByteCount] === 0x00) {
      name = new TextDecoder().decode(bytes.slice(weightByteCount + 1))
    }

    return { weights, name }
  } catch {
    return null
  }
}

// Validate decoded weights are in range
export function validateWeights(w: StatWeights): boolean {
  return STAT_KEYS.every(k => {
    const v = w[k]
    return typeof v === 'number' && v >= 0 && v <= 10 && Number.isInteger(v)
  })
}

export function buildShareUrl(state: ModelState, baseUrl?: string): string {
  const base = baseUrl ?? (typeof window !== 'undefined' ? window.location.origin : '')
  const encoded = encodeModel(state)
  return `${base}/bracket?m=${encoded}`
}

export function parseModelFromSearchParams(
  searchParams: URLSearchParams | Record<string, string>
): ModelState | null {
  const m = searchParams instanceof URLSearchParams
    ? searchParams.get('m')
    : searchParams['m']
  if (!m) return null
  const decoded = decodeModel(m)
  if (!decoded || !validateWeights(decoded.weights)) return null
  return decoded
}

export function parseModelFromUrl(url: string): ModelState | null {
  try {
    const u = new URL(url)
    const m = u.searchParams.get('m')
    if (!m) return null
    const decoded = decodeModel(m)
    if (!decoded || !validateWeights(decoded.weights)) return null
    return decoded
  } catch {
    // Try treating input directly as the m= value
    try {
      const decoded = decodeModel(url)
      if (!decoded || !validateWeights(decoded.weights)) return null
      return decoded
    } catch {
      return null
    }
  }
}
