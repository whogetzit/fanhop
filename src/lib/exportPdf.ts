import { jsPDF } from 'jspdf'
import type { TournamentResult, RegionResult, Matchup, RegionName } from '@/types/bracket'
import { generateQrMatrix } from './qrcodegen'

/* ═══════════════════════════════════════════════════════════════════════════
   Black-and-white bracket PDF — drawn entirely with jsPDF primitives.
   Landscape letter (11 × 8.5 in), one page, no images.
   ═══════════════════════════════════════════════════════════════════════════ */

// ── Layout constants (points, 72pt = 1in) ──────────────────────────────────
const PAGE_W = 792          // 11"
const PAGE_H = 612          // 8.5"
const MARGIN = 20
const HEADER_H = 22         // space for title + branding line

const SLOT_H = 10           // team slot height
const SLOT_GAP = 1.5        // gap between two teams in a matchup
const MATCHUP_GAP = 3       // gap between matchups
const SLOT_W = 82           // team name box width
const ROUND_GAP = 6         // horizontal gap between round columns
const LINE_EXTEND = 4       // how far connector lines extend past the slot

const FONT_TEAM = 6.5
const FONT_SEED = 5.5
const FONT_HEADER = 7
const FONT_REGION = 7.5
const FONT_CHAMPION = 9

// Derived
const MATCHUP_H = SLOT_H * 2 + SLOT_GAP                   // height of one matchup
const REGION_H = MATCHUP_H * 8 + MATCHUP_GAP * 7           // height of one R64 column (8 matchups)
const HALF_H = (PAGE_H - MARGIN * 2 - HEADER_H) / 2        // vertical space per half
const CONTENT_W = PAGE_W - MARGIN * 2                       // usable width
const COL_W = SLOT_W + ROUND_GAP                            // one round column width

// ── Helpers ─────────────────────────────────────────────────────────────────

function winnerSeed(m: Matchup): number {
  return m.winner === m.team1 ? m.seed1 : m.seed2
}

/** Truncate long team names */
function truncName(name: string, maxLen = 14): string {
  return name.length > maxLen ? name.slice(0, maxLen - 1) + '.' : name
}

/** Y-center of slot i in R64 column */
function r64SlotY(baseY: number, matchIdx: number, slotInMatch: 0 | 1): number {
  const matchTop = baseY + matchIdx * (MATCHUP_H + MATCHUP_GAP)
  return matchTop + slotInMatch * (SLOT_H + SLOT_GAP)
}

/** Y-center of a later-round slot (midpoint of two feeder slots) */
function midY(y1: number, y2: number): number {
  return (y1 + y2) / 2
}

// ── Drawing primitives ──────────────────────────────────────────────────────

function drawSlot(
  pdf: jsPDF,
  x: number, y: number,
  seed: number, name: string,
  isWinner: boolean,
  align: 'left' | 'right' = 'left',
) {
  // Box outline
  pdf.setDrawColor(180)
  pdf.setLineWidth(0.3)
  pdf.rect(x, y, SLOT_W, SLOT_H)

  // Seed badge background
  const seedW = 14
  const seedX = align === 'left' ? x : x + SLOT_W - seedW
  pdf.setFillColor(230, 230, 230)
  pdf.rect(seedX, y, seedW, SLOT_H, 'F')
  pdf.setDrawColor(180)
  pdf.rect(seedX, y, seedW, SLOT_H)

  // Seed text
  pdf.setFont('helvetica', 'bold')
  pdf.setFontSize(FONT_SEED)
  pdf.setTextColor(80)
  pdf.text(String(seed), seedX + seedW / 2, y + SLOT_H / 2 + 0.5, { align: 'center', baseline: 'middle' })

  // Team name
  pdf.setFont('helvetica', isWinner ? 'bold' : 'normal')
  pdf.setFontSize(FONT_TEAM)
  pdf.setTextColor(isWinner ? 0 : 100)
  const nameX = align === 'left' ? x + seedW + 2 : x + SLOT_W - seedW - 2
  const nameAlign = align === 'left' ? 'left' : 'right'
  pdf.text(truncName(name), nameX, y + SLOT_H / 2 + 0.5, { align: nameAlign, baseline: 'middle' })
}

function drawConnector(
  pdf: jsPDF,
  fromX: number, fromY: number,
  toX: number, toY: number,
  direction: 'right' | 'left',
) {
  pdf.setDrawColor(160)
  pdf.setLineWidth(0.4)

  if (direction === 'right') {
    // From right edge of slot → extend right → vertical → to left edge of next slot
    const midX = fromX + (toX - fromX) / 2
    pdf.line(fromX, fromY, midX, fromY)       // horizontal from source
    pdf.line(midX, fromY, midX, toY)           // vertical connector
    pdf.line(midX, toY, toX, toY)              // horizontal to destination
  } else {
    // From left edge of slot → extend left → vertical → to right edge of next slot
    const midX = fromX + (toX - fromX) / 2
    pdf.line(fromX, fromY, midX, fromY)
    pdf.line(midX, fromY, midX, toY)
    pdf.line(midX, toY, toX, toY)
  }
}

// ── Region drawing ──────────────────────────────────────────────────────────

function drawRegion(
  pdf: jsPDF,
  region: RegionResult,
  regionName: string,
  baseX: number,
  baseY: number,
  side: 'left' | 'right',
) {
  const dir = side === 'left' ? 'right' : 'left'

  // Region label
  pdf.setFont('helvetica', 'bold')
  pdf.setFontSize(FONT_REGION)
  pdf.setTextColor(0)
  if (side === 'left') {
    pdf.text(regionName.toUpperCase(), baseX, baseY - 4)
  } else {
    pdf.text(regionName.toUpperCase(), baseX + SLOT_W, baseY - 4, { align: 'right' })
  }

  // ── R64 (8 matchups, 16 teams) ──
  const r64Ys: number[] = []  // center Y of each winning slot for connectors
  for (let i = 0; i < 8; i++) {
    const m = region.r64[i]
    const y1 = r64SlotY(baseY, i, 0)
    const y2 = r64SlotY(baseY, i, 1)

    drawSlot(pdf, baseX, y1, m.seed1, m.team1, m.winner === m.team1, side)
    drawSlot(pdf, baseX, y2, m.seed2, m.team2, m.winner === m.team2, side)

    // Center Y for connector from winner
    const winY = m.winner === m.team1 ? y1 + SLOT_H / 2 : y2 + SLOT_H / 2
    r64Ys.push(winY)
  }

  // ── R32 (4 matchups) ──
  const r32X = side === 'left' ? baseX + COL_W : baseX - COL_W
  const r32Ys: number[] = []
  for (let i = 0; i < 4; i++) {
    const m = region.r32[i]
    const seed = winnerSeed(m)
    // Position at midpoint of the two R64 matchups that fed into it
    const feedY1 = r64Ys[i * 2]
    const feedY2 = r64Ys[i * 2 + 1]
    const slotY = midY(feedY1, feedY2) - SLOT_H / 2

    drawSlot(pdf, r32X, slotY, seed, m.winner, true, side)

    // Draw connectors from both R64 winners
    if (side === 'left') {
      drawConnector(pdf, baseX + SLOT_W, feedY1, r32X, slotY + SLOT_H / 2, 'right')
      drawConnector(pdf, baseX + SLOT_W, feedY2, r32X, slotY + SLOT_H / 2, 'right')
    } else {
      drawConnector(pdf, baseX, feedY1, r32X + SLOT_W, slotY + SLOT_H / 2, 'left')
      drawConnector(pdf, baseX, feedY2, r32X + SLOT_W, slotY + SLOT_H / 2, 'left')
    }

    r32Ys.push(slotY + SLOT_H / 2)
  }

  // ── S16 (2 matchups) ──
  const s16X = side === 'left' ? r32X + COL_W : r32X - COL_W
  const s16Ys: number[] = []
  for (let i = 0; i < 2; i++) {
    const m = region.s16[i]
    const seed = winnerSeed(m)
    const feedY1 = r32Ys[i * 2]
    const feedY2 = r32Ys[i * 2 + 1]
    const slotY = midY(feedY1, feedY2) - SLOT_H / 2

    drawSlot(pdf, s16X, slotY, seed, m.winner, true, side)

    if (side === 'left') {
      drawConnector(pdf, r32X + SLOT_W, feedY1, s16X, slotY + SLOT_H / 2, 'right')
      drawConnector(pdf, r32X + SLOT_W, feedY2, s16X, slotY + SLOT_H / 2, 'right')
    } else {
      drawConnector(pdf, r32X, feedY1, s16X + SLOT_W, slotY + SLOT_H / 2, 'left')
      drawConnector(pdf, r32X, feedY2, s16X + SLOT_W, slotY + SLOT_H / 2, 'left')
    }

    s16Ys.push(slotY + SLOT_H / 2)
  }

  // ── E8 (1 matchup — region champion) ──
  const e8X = side === 'left' ? s16X + COL_W : s16X - COL_W
  const m = region.e8
  const seed = winnerSeed(m)
  const feedY1 = s16Ys[0]
  const feedY2 = s16Ys[1]
  const e8SlotY = midY(feedY1, feedY2) - SLOT_H / 2

  drawSlot(pdf, e8X, e8SlotY, seed, m.winner, true, side)

  if (side === 'left') {
    drawConnector(pdf, s16X + SLOT_W, feedY1, e8X, e8SlotY + SLOT_H / 2, 'right')
    drawConnector(pdf, s16X + SLOT_W, feedY2, e8X, e8SlotY + SLOT_H / 2, 'right')
  } else {
    drawConnector(pdf, s16X, feedY1, e8X + SLOT_W, e8SlotY + SLOT_H / 2, 'left')
    drawConnector(pdf, s16X, feedY2, e8X + SLOT_W, e8SlotY + SLOT_H / 2, 'left')
  }

  // Return E8 center Y and X for Final Four connectors
  return {
    e8CenterY: e8SlotY + SLOT_H / 2,
    e8EdgeX: side === 'left' ? e8X + SLOT_W : e8X,
  }
}

// ── Main export function ────────────────────────────────────────────────────

export async function exportBracketPdf(
  result: TournamentResult,
  modelName: string,
  shareUrl?: string,
): Promise<void> {
  const pdf = new jsPDF({
    orientation: 'landscape',
    unit: 'pt',
    format: 'letter',
  })

  // ── Header ──
  pdf.setFont('helvetica', 'bold')
  pdf.setFontSize(10)
  pdf.setTextColor(0)
  pdf.text('NCAA MEN\'S MARCH MADNESS 2025', PAGE_W / 2, MARGIN + 8, { align: 'center' })
  pdf.setFont('helvetica', 'normal')
  pdf.setFontSize(FONT_HEADER)
  pdf.setTextColor(120)
  pdf.text(`fanhop.com  ·  ${modelName}`, PAGE_W / 2, MARGIN + 16, { align: 'center' })

  // ── Compute region positions ──
  const topY = MARGIN + HEADER_H + 6       // top of upper regions
  const bottomY = topY + HALF_H + 4        // top of lower regions

  // Left R64 starts at left margin
  const leftX = MARGIN
  // Right R64 starts so that right edge aligns with right margin
  const rightX = PAGE_W - MARGIN - SLOT_W

  // ── Draw four regions ──
  const mw = drawRegion(pdf, result.regions.Midwest, 'Midwest', leftX, topY, 'left')
  const east = drawRegion(pdf, result.regions.East, 'East', rightX, topY, 'right')
  const west = drawRegion(pdf, result.regions.West, 'West', leftX, bottomY, 'left')
  const south = drawRegion(pdf, result.regions.South, 'South', rightX, bottomY, 'right')

  // ── Final Four + Champion ──
  const ffX = PAGE_W / 2 - SLOT_W / 2    // center the FF slots
  const champY = PAGE_H / 2               // champion in dead center of page
  const ffSpacing = 24                     // distance from champion to each FF slot

  // FF1: Midwest vs West → winner (above champion)
  const ff1Y = champY - ffSpacing
  drawSlot(pdf, ffX, ff1Y - SLOT_H / 2, 0, result.ff1.winner, true, 'left')
  // Override seed badge to say "FF"
  pdf.setFillColor(230, 230, 230)
  pdf.rect(ffX, ff1Y - SLOT_H / 2, 14, SLOT_H, 'F')
  pdf.setDrawColor(180)
  pdf.rect(ffX, ff1Y - SLOT_H / 2, 14, SLOT_H)
  pdf.setFont('helvetica', 'bold')
  pdf.setFontSize(4.5)
  pdf.setTextColor(80)
  pdf.text('FF', ffX + 7, ff1Y + 0.5, { align: 'center', baseline: 'middle' })

  // FF2: East vs South → winner (below champion)
  const ff2Y = champY + ffSpacing
  drawSlot(pdf, ffX, ff2Y - SLOT_H / 2, 0, result.ff2.winner, true, 'left')
  pdf.setFillColor(230, 230, 230)
  pdf.rect(ffX, ff2Y - SLOT_H / 2, 14, SLOT_H, 'F')
  pdf.setDrawColor(180)
  pdf.rect(ffX, ff2Y - SLOT_H / 2, 14, SLOT_H)
  pdf.setFont('helvetica', 'bold')
  pdf.setFontSize(4.5)
  pdf.setTextColor(80)
  pdf.text('FF', ffX + 7, ff2Y + 0.5, { align: 'center', baseline: 'middle' })

  // Connectors from E8 winners to FF slots
  drawConnector(pdf, mw.e8EdgeX, mw.e8CenterY, ffX, ff1Y, 'right')
  drawConnector(pdf, west.e8EdgeX, west.e8CenterY, ffX, ff1Y, 'right')
  drawConnector(pdf, east.e8EdgeX, east.e8CenterY, ffX + SLOT_W, ff2Y, 'left')
  drawConnector(pdf, south.e8EdgeX, south.e8CenterY, ffX + SLOT_W, ff2Y, 'left')

  // ── Champion box ──
  const champBoxW = SLOT_W + 10
  const champBoxH = 22
  const champBoxX = PAGE_W / 2 - champBoxW / 2
  const champBoxY = champY - champBoxH / 2

  // Box outline
  pdf.setDrawColor(0)
  pdf.setLineWidth(0.8)
  pdf.rect(champBoxX, champBoxY, champBoxW, champBoxH)

  // "CHAMPION" label
  pdf.setFont('helvetica', 'normal')
  pdf.setFontSize(5.5)
  pdf.setTextColor(100)
  pdf.text('CHAMPION', PAGE_W / 2, champBoxY + 7, { align: 'center' })

  // Champion name
  pdf.setFont('helvetica', 'bold')
  pdf.setFontSize(FONT_CHAMPION)
  pdf.setTextColor(0)
  pdf.text(result.champion, PAGE_W / 2, champBoxY + 16, { align: 'center' })

  // Connector lines from FF winners to champion box
  pdf.setDrawColor(160)
  pdf.setLineWidth(0.4)
  pdf.line(ffX + SLOT_W, ff1Y, PAGE_W / 2, champBoxY)     // FF1 → top of box
  pdf.line(ffX + SLOT_W, ff2Y, PAGE_W / 2, champBoxY + champBoxH) // FF2 → bottom of box

  // ── Round column headers ──
  pdf.setFont('helvetica', 'normal')
  pdf.setFontSize(5)
  pdf.setTextColor(150)
  const headerY = topY - 1
  // Left side headers
  pdf.text('R64', leftX + SLOT_W / 2, headerY, { align: 'center' })
  pdf.text('R32', leftX + COL_W + SLOT_W / 2, headerY, { align: 'center' })
  pdf.text('S16', leftX + COL_W * 2 + SLOT_W / 2, headerY, { align: 'center' })
  pdf.text('E8', leftX + COL_W * 3 + SLOT_W / 2, headerY, { align: 'center' })
  // Right side headers
  pdf.text('R64', rightX + SLOT_W / 2, headerY, { align: 'center' })
  pdf.text('R32', rightX - COL_W + SLOT_W / 2, headerY, { align: 'center' })
  pdf.text('S16', rightX - COL_W * 2 + SLOT_W / 2, headerY, { align: 'center' })
  pdf.text('E8', rightX - COL_W * 3 + SLOT_W / 2, headerY, { align: 'center' })

  // ── QR Code (bottom-right corner) ──
  if (shareUrl) {
    const qrSize = 55
    const qrX = PAGE_W - MARGIN - qrSize
    const qrY = PAGE_H - MARGIN - qrSize - 10  // 10pt reserved for label below
    const modules = generateQrMatrix(shareUrl, 'L')
    const moduleCount = modules.length
    const padding = 1  // 1-module quiet zone
    const totalCells = moduleCount + padding * 2
    const cellSize = qrSize / totalCells

    // White background for quiet zone
    pdf.setFillColor(255, 255, 255)
    pdf.rect(qrX, qrY, qrSize, qrSize, 'F')

    // Draw dark modules
    pdf.setFillColor(0, 0, 0)
    for (let row = 0; row < moduleCount; row++) {
      for (let col = 0; col < moduleCount; col++) {
        if (modules[row][col]) {
          pdf.rect(
            qrX + (col + padding) * cellSize,
            qrY + (row + padding) * cellSize,
            cellSize,
            cellSize,
            'F',
          )
        }
      }
    }

    // Label below QR
    pdf.setFont('helvetica', 'normal')
    pdf.setFontSize(4.5)
    pdf.setTextColor(120)
    pdf.text('SCAN TO VIEW BRACKET', qrX + qrSize / 2, qrY + qrSize + 7, { align: 'center' })
  }

  // ── Save ──
  const safeName = modelName.replace(/[^a-zA-Z0-9]+/g, '-').replace(/^-|-$/g, '').toLowerCase() || 'bracket'
  pdf.save(`fanhop-${safeName}.pdf`)
}
