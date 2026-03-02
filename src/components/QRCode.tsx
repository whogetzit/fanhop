'use client'
// Minimal QR Code generator — supports byte mode, versions 1-10
// Based on the ISO 18004 standard, enough for URLs up to ~150 chars

import { useEffect, useRef } from 'react'

// ─── Reed-Solomon GF(256) ────────────────────────────────────────────────────
const GF_EXP = new Uint8Array(512)
const GF_LOG = new Uint8Array(256)
;(() => {
  let x = 1
  for (let i = 0; i < 255; i++) {
    GF_EXP[i] = x; GF_LOG[x] = i
    x = x << 1; if (x & 0x100) x ^= 0x11d
  }
  for (let i = 255; i < 512; i++) GF_EXP[i] = GF_EXP[i - 255]
})()
const gfMul = (x: number, y: number) => x && y ? GF_EXP[GF_LOG[x] + GF_LOG[y]] : 0
const gfPoly = (degree: number): number[] => {
  let p = [1]
  for (let i = 0; i < degree; i++) {
    const next = new Array(p.length + 1).fill(0)
    for (let j = 0; j < p.length; j++) { next[j] ^= p[j]; next[j+1] ^= gfMul(p[j], GF_EXP[i]) }
    p = next
  }
  return p
}
const rsEncode = (data: number[], nec: number): number[] => {
  const gen = gfPoly(nec)
  const res = [...data, ...new Array(nec).fill(0)]
  for (let i = 0; i < data.length; i++) {
    const c = res[i]
    if (c) for (let j = 0; j < gen.length; j++) res[i+j] ^= gfMul(gen[j], c)
  }
  return res.slice(data.length)
}

// ─── QR version config ───────────────────────────────────────────────────────
// [version, size, ec_codewords, data_codewords, blocks]
const VERSIONS: [number, number, number, number, number][] = [
  [1,  21,  7,  19, 1],
  [2,  25, 10,  34, 1],
  [3,  29, 15,  55, 1],
  [4,  33, 20,  80, 2],
  [5,  37, 26, 108, 2],
  [6,  41, 36, 136, 2],
  [7,  45, 40, 156, 4],
  [8,  49, 48, 194, 4],
  [9,  53, 60, 232, 4],
  [10, 57, 70, 274, 4],
]

function pickVersion(dataLen: number) {
  // byte mode: 4 + 8 + 8*n + 4 bits for mode/len/data/term
  for (const v of VERSIONS) {
    if (v[3] * 8 >= 4 + 8 + 8 * dataLen + 4) return v
  }
  return VERSIONS[VERSIONS.length - 1]
}

// ─── Matrix helpers ──────────────────────────────────────────────────────────
function makeMatrix(size: number) {
  return Array.from({ length: size }, () => new Int8Array(size).fill(-1))
}

function setFinderPattern(m: Int8Array[], r: number, c: number) {
  for (let dr = -1; dr <= 7; dr++) for (let dc = -1; dc <= 7; dc++) {
    const row = r + dr, col = c + dc
    if (row < 0 || row >= m.length || col < 0 || col >= m.length) continue
    const inBorder = dr === -1 || dr === 7 || dc === -1 || dc === 7
    const inInner = dr >= 1 && dr <= 5 && dc >= 1 && dc <= 5
    const inCenter = dr >= 2 && dr <= 4 && dc >= 2 && dc <= 4
    m[row][col] = (inBorder || inCenter) ? 1 : 0
    if (!inBorder && !inInner) m[row][col] = 0
    if (inCenter) m[row][col] = 1
  }
}

function setAlignment(m: Int8Array[], r: number, c: number) {
  for (let dr = -2; dr <= 2; dr++) for (let dc = -2; dc <= 2; dc++) {
    const inBorder = Math.abs(dr) === 2 || Math.abs(dc) === 2
    m[r+dr][c+dc] = (inBorder || (dr === 0 && dc === 0)) ? 1 : 0
  }
}

const ALIGN_POS: number[][] = [
  [], [], [6,18], [6,22], [6,26], [6,30], [6,34],
  [6,22,38], [6,24,42], [6,26,46], [6,28,50],
]

function buildMatrix(version: number, data: number[]): Int8Array[] {
  const size = 17 + version * 4
  const m = makeMatrix(size)

  // Finder patterns
  setFinderPattern(m, 0, 0)
  setFinderPattern(m, 0, size - 7)
  setFinderPattern(m, size - 7, 0)

  // Timing patterns
  for (let i = 8; i < size - 8; i++) {
    m[6][i] = m[i][6] = i % 2 === 0 ? 1 : 0
  }

  // Dark module
  m[size - 8][8] = 1

  // Alignment patterns
  const ap = ALIGN_POS[version] ?? []
  for (const r of ap) for (const c of ap) {
    if (m[r][c] !== -1) continue
    setAlignment(m, r, c)
  }

  // Format area (reserve)
  for (let i = 0; i <= 8; i++) {
    if (m[i][8] === -1) m[i][8] = 2
    if (m[8][i] === -1) m[8][i] = 2
    if (i < 8) { m[size-1-i][8] = 2; m[8][size-1-i] = 2 }
  }

  // Place data bits (zigzag)
  let bitIdx = 0
  const bits = data.flatMap(b => [7,6,5,4,3,2,1,0].map(i => (b >> i) & 1))
  let dir = -1, row = size - 1
  for (let col = size - 1; col >= 1; col -= 2) {
    if (col === 6) col--
    for (let cnt = 0; cnt < size; cnt++) {
      const r = row
      const c = col - (cnt % 2 === 0 ? 0 : 1)
      if (m[r][c] === -1) {
        m[r][c] = bitIdx < bits.length ? bits[bitIdx++] : 0
      }
      if (cnt % 2 === 1) row += dir
    }
    dir = -dir; row += dir
  }

  // Apply mask 0: (row+col) % 2 === 0
  for (let r = 0; r < size; r++) for (let c = 0; c < size; c++) {
    if (m[r][c] <= 1 && (r + c) % 2 === 0) m[r][c] ^= 1
  }

  // Write format info (mask 0 = 000, EC level M = 00 → format 0b00_000 with BCH)
  // Precomputed for mask 0, EC level M: 0x7B73 mapped to positions
  const fmt = 0x7B73 ^ 0x5412 // mask pattern for format string
  const fmtBits = [14,13,12,11,10,9,8,7,5,4,3,2,1,0].map(i => (fmt >> i) & 1)
  const fmtPos1 = [[0,8],[1,8],[2,8],[3,8],[4,8],[5,8],[7,8],[8,8],[8,7],[8,5],[8,4],[8,3],[8,2],[8,1],[8,0]]
  const fmtPos2 = [[size-1,8],[size-2,8],[size-3,8],[size-4,8],[size-5,8],[size-6,8],[size-7,8],[8,size-8],[8,size-7],[8,size-6],[8,size-5],[8,size-4],[8,size-3],[8,size-2],[8,size-1]]
  for (let i = 0; i < 15; i++) {
    if (fmtPos1[i]) m[fmtPos1[i][0]][fmtPos1[i][1]] = fmtBits[i]
    if (fmtPos2[i]) m[fmtPos2[i][0]][fmtPos2[i][1]] = fmtBits[i]
  }

  return m
}

function encodeQR(text: string): Int8Array[] {
  const bytes = new TextEncoder().encode(text)
  const [version, size, ecCount, dataCount, blocks] = pickVersion(bytes.length)

  // Build data codewords
  const raw: number[] = [0x40 | (bytes.length >> 4)]
  let cur = (bytes.length & 0xf) << 4
  for (let i = 0; i < bytes.length; i++) {
    raw.push(cur | (bytes[i] >> 4))
    cur = (bytes[i] & 0xf) << 4
  }
  raw.push(cur) // terminator + padding
  while (raw.length < dataCount) raw.push(raw.length % 2 === 0 ? 0xEC : 0x11)

  // Split into blocks and add EC
  const blockSize = Math.floor(dataCount / blocks)
  const allData: number[] = []
  const allEc: number[] = []
  const ecPerBlock = Math.floor(ecCount / blocks)
  for (let b = 0; b < blocks; b++) {
    const block = raw.slice(b * blockSize, (b + 1) * blockSize)
    allData.push(...block)
    allEc.push(...rsEncode(block, ecPerBlock))
  }

  return buildMatrix(version, [...allData, ...allEc])
}

// ─── React component ──────────────────────────────────────────────────────────
interface Props { url: string; size?: number }

export default function QRCode({ url, size = 240 }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    try {
      const matrix = encodeQR(url)
      const canvas = canvasRef.current
      if (!canvas) return
      const ctx = canvas.getContext('2d')!
      const modules = matrix.length
      const scale = Math.floor(size / (modules + 8))
      const offset = Math.floor((size - modules * scale) / 2)
      canvas.width = canvas.height = size

      ctx.fillStyle = '#0A121E'
      ctx.fillRect(0, 0, size, size)
      ctx.fillStyle = '#F96A1B'

      for (let r = 0; r < modules; r++) {
        for (let c = 0; c < modules; c++) {
          if (matrix[r][c] === 1) {
            ctx.fillRect(offset + c * scale, offset + r * scale, scale, scale)
          }
        }
      }
    } catch (e) {
      // Fallback: show error state
      const canvas = canvasRef.current
      if (!canvas) return
      const ctx = canvas.getContext('2d')!
      ctx.fillStyle = '#0A121E'
      ctx.fillRect(0, 0, size, size)
      ctx.fillStyle = '#F96A1B'
      ctx.font = '14px monospace'
      ctx.fillText('QR error', 10, size/2)
    }
  }, [url, size])

  return <canvas ref={canvasRef} width={size} height={size} style={{ borderRadius: 8 }} />
}
