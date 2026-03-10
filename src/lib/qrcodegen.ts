/**
 * QR Code generator library — extracted from qrcode.react (Project Nayuki)
 * @license MIT
 * Copyright (c) Project Nayuki. https://www.nayuki.io/page/qr-code-generator-library
 *
 * Pure-JS QR encoder with no DOM dependencies.
 * Used by exportPdf.ts to draw QR codes onto jsPDF documents.
 */

// ─── Ecc (Error Correction Level) ──────────────────────────────────────────

class Ecc {
  static readonly LOW      = new Ecc(0, 1)
  static readonly MEDIUM   = new Ecc(1, 0)
  static readonly QUARTILE = new Ecc(2, 3)
  static readonly HIGH     = new Ecc(3, 2)
  constructor(public readonly ordinal: number, public readonly formatBits: number) {}
}

// ─── Mode ──────────────────────────────────────────────────────────────────

class Mode {
  static readonly NUMERIC      = new Mode(1, [10, 12, 14])
  static readonly ALPHANUMERIC = new Mode(2, [9, 11, 13])
  static readonly BYTE         = new Mode(4, [8, 16, 16])
  static readonly KANJI        = new Mode(8, [8, 10, 12])
  static readonly ECI          = new Mode(7, [0, 0, 0])
  constructor(public readonly modeBits: number, private readonly numBitsCharCount: number[]) {}
  numCharCountBits(ver: number): number {
    return this.numBitsCharCount[Math.floor((ver + 7) / 17)]
  }
}

// ─── QrSegment ─────────────────────────────────────────────────────────────

class QrSegment {
  private readonly bitData: number[]
  static readonly NUMERIC_REGEX       = /^[0-9]*$/
  static readonly ALPHANUMERIC_REGEX  = /^[A-Z0-9 $%*+.\/:-]*$/
  static readonly ALPHANUMERIC_CHARSET = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ $%*+-./:';

  constructor(public readonly mode: Mode, public readonly numChars: number, bitData: number[]) {
    if (numChars < 0) throw new RangeError('Invalid argument')
    this.bitData = bitData.slice()
  }

  getData(): number[] { return this.bitData.slice() }

  static makeBytes(data: number[]): QrSegment {
    const bb: number[] = []
    for (const b of data) appendBits(b, 8, bb)
    return new QrSegment(Mode.BYTE, data.length, bb)
  }

  static makeNumeric(digits: string): QrSegment {
    if (!QrSegment.isNumeric(digits)) throw new RangeError('String contains non-numeric characters')
    const bb: number[] = []
    for (let i = 0; i < digits.length;) {
      const n = Math.min(digits.length - i, 3)
      appendBits(parseInt(digits.substring(i, i + n), 10), n * 3 + 1, bb)
      i += n
    }
    return new QrSegment(Mode.NUMERIC, digits.length, bb)
  }

  static makeAlphanumeric(text: string): QrSegment {
    if (!QrSegment.isAlphanumeric(text)) throw new RangeError('String contains unencodable characters in alphanumeric mode')
    const bb: number[] = []
    let i: number
    for (i = 0; i + 2 <= text.length; i += 2) {
      let temp = QrSegment.ALPHANUMERIC_CHARSET.indexOf(text.charAt(i)) * 45
      temp += QrSegment.ALPHANUMERIC_CHARSET.indexOf(text.charAt(i + 1))
      appendBits(temp, 11, bb)
    }
    if (i < text.length) appendBits(QrSegment.ALPHANUMERIC_CHARSET.indexOf(text.charAt(i)), 6, bb)
    return new QrSegment(Mode.ALPHANUMERIC, text.length, bb)
  }

  static makeSegments(text: string): QrSegment[] {
    if (text === '') return []
    if (QrSegment.isNumeric(text)) return [QrSegment.makeNumeric(text)]
    if (QrSegment.isAlphanumeric(text)) return [QrSegment.makeAlphanumeric(text)]
    return [QrSegment.makeBytes(QrSegment.toUtf8ByteArray(text))]
  }

  static isNumeric(text: string): boolean { return QrSegment.NUMERIC_REGEX.test(text) }
  static isAlphanumeric(text: string): boolean { return QrSegment.ALPHANUMERIC_REGEX.test(text) }

  static getTotalBits(segs: QrSegment[], version: number): number {
    let result = 0
    for (const seg of segs) {
      const ccbits = seg.mode.numCharCountBits(version)
      if (seg.numChars >= 1 << ccbits) return Infinity
      result += 4 + ccbits + seg.bitData.length
    }
    return result
  }

  static toUtf8ByteArray(str: string): number[] {
    str = encodeURI(str)
    const result: number[] = []
    for (let i = 0; i < str.length; i++) {
      if (str.charAt(i) !== '%') result.push(str.charCodeAt(i))
      else { result.push(parseInt(str.substring(i + 1, i + 3), 16)); i += 2 }
    }
    return result
  }
}

// ─── QrCode ────────────────────────────────────────────────────────────────

class QrCode {
  static readonly MIN_VERSION = 1
  static readonly MAX_VERSION = 40
  static readonly Ecc = Ecc

  private static readonly PENALTY_N1 = 3
  private static readonly PENALTY_N2 = 3
  private static readonly PENALTY_N3 = 40
  private static readonly PENALTY_N4 = 10

  public readonly size: number
  public readonly mask: number
  private readonly modules: boolean[][]
  private isFunction: boolean[][]

  /* prettier-ignore */
  private static readonly ECC_CODEWORDS_PER_BLOCK: number[][] = [
    [-1, 7, 10, 15, 20, 26, 18, 20, 24, 30, 18, 20, 24, 26, 30, 22, 24, 28, 30, 28, 28, 28, 28, 30, 30, 26, 28, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30],
    [-1, 10, 16, 26, 18, 24, 16, 18, 22, 22, 26, 30, 22, 22, 24, 24, 28, 28, 26, 26, 26, 26, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28],
    [-1, 13, 22, 18, 26, 18, 24, 18, 22, 20, 24, 28, 26, 24, 20, 30, 24, 28, 28, 26, 30, 28, 30, 30, 30, 30, 28, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30],
    [-1, 17, 28, 22, 16, 22, 28, 26, 26, 24, 28, 24, 28, 22, 24, 24, 30, 28, 28, 26, 28, 30, 24, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30],
  ]

  /* prettier-ignore */
  private static readonly NUM_ERROR_CORRECTION_BLOCKS: number[][] = [
    [-1, 1, 1, 1, 1, 1, 2, 2, 2, 2, 4, 4, 4, 4, 4, 6, 6, 6, 6, 7, 8, 8, 9, 9, 10, 12, 12, 12, 13, 14, 15, 16, 17, 18, 19, 19, 20, 21, 22, 24, 25],
    [-1, 1, 1, 1, 2, 2, 4, 4, 4, 5, 5, 5, 8, 9, 9, 10, 10, 11, 13, 14, 16, 17, 17, 18, 20, 21, 23, 25, 26, 28, 29, 31, 33, 35, 37, 38, 40, 43, 45, 47, 49],
    [-1, 1, 1, 2, 2, 4, 4, 6, 6, 8, 8, 8, 10, 12, 16, 12, 17, 16, 18, 21, 20, 23, 23, 25, 27, 29, 34, 34, 35, 38, 40, 43, 45, 48, 51, 53, 56, 59, 62, 65, 68],
    [-1, 1, 1, 2, 4, 4, 4, 5, 6, 8, 8, 11, 11, 16, 16, 18, 16, 19, 21, 25, 25, 25, 34, 30, 32, 35, 37, 40, 42, 45, 48, 51, 54, 57, 60, 63, 66, 70, 74, 77, 81],
  ]

  constructor(version: number, errorCorrectionLevel: Ecc, dataCodewords: number[], msk: number) {
    this.version = version
    this.errorCorrectionLevel = errorCorrectionLevel
    this.modules = []
    this.isFunction = []
    if (version < QrCode.MIN_VERSION || version > QrCode.MAX_VERSION) throw new RangeError('Version value out of range')
    if (msk < -1 || msk > 7) throw new RangeError('Mask value out of range')
    this.size = version * 4 + 17
    const row: boolean[] = []
    for (let i = 0; i < this.size; i++) row.push(false)
    for (let i = 0; i < this.size; i++) { this.modules.push(row.slice()); this.isFunction.push(row.slice()) }
    this.drawFunctionPatterns()
    const allCodewords = this.addEccAndInterleave(dataCodewords)
    this.drawCodewords(allCodewords)
    if (msk === -1) {
      let minPenalty = 1e9
      for (let i = 0; i < 8; i++) {
        this.applyMask(i); this.drawFormatBits(i)
        const penalty = this.getPenaltyScore()
        if (penalty < minPenalty) { msk = i; minPenalty = penalty }
        this.applyMask(i)
      }
    }
    assert(0 <= msk && msk <= 7)
    this.mask = msk
    this.applyMask(msk)
    this.drawFormatBits(msk)
    this.isFunction = []
  }

  public readonly version: number
  public readonly errorCorrectionLevel: Ecc

  static encodeText(text: string, ecl: Ecc): QrCode {
    const segs = QrSegment.makeSegments(text)
    return QrCode.encodeSegments(segs, ecl)
  }

  static encodeSegments(segs: QrSegment[], ecl: Ecc, minVersion = 1, maxVersion = 40, mask = -1, boostEcl = true): QrCode {
    if (!(QrCode.MIN_VERSION <= minVersion && minVersion <= maxVersion && maxVersion <= QrCode.MAX_VERSION) || mask < -1 || mask > 7)
      throw new RangeError('Invalid value')
    let version: number
    let dataUsedBits: number
    for (version = minVersion; ; version++) {
      const cap = QrCode.getNumDataCodewords(version, ecl) * 8
      const used = QrSegment.getTotalBits(segs, version)
      if (used <= cap) { dataUsedBits = used; break }
      if (version >= maxVersion) throw new RangeError('Data too long')
    }
    for (const newEcl of [Ecc.MEDIUM, Ecc.QUARTILE, Ecc.HIGH]) {
      if (boostEcl && dataUsedBits! <= QrCode.getNumDataCodewords(version!, newEcl) * 8) ecl = newEcl
    }
    const bb: number[] = []
    for (const seg of segs) {
      appendBits(seg.mode.modeBits, 4, bb)
      appendBits(seg.numChars, seg.mode.numCharCountBits(version!), bb)
      for (const b of seg.getData()) bb.push(b)
    }
    assert(bb.length === dataUsedBits!)
    const dataCapacityBits = QrCode.getNumDataCodewords(version!, ecl) * 8
    assert(bb.length <= dataCapacityBits)
    appendBits(0, Math.min(4, dataCapacityBits - bb.length), bb)
    appendBits(0, (8 - bb.length % 8) % 8, bb)
    assert(bb.length % 8 === 0)
    for (let padByte = 236; bb.length < dataCapacityBits; padByte ^= 236 ^ 17) appendBits(padByte, 8, bb)
    const dataCodewords: number[] = []
    while (dataCodewords.length * 8 < bb.length) dataCodewords.push(0)
    bb.forEach((b, i) => dataCodewords[i >>> 3] |= b << (7 - (i & 7)))
    return new QrCode(version!, ecl, dataCodewords, mask)
  }

  getModule(x: number, y: number): boolean {
    return 0 <= x && x < this.size && 0 <= y && y < this.size && this.modules[y][x]
  }

  getModules(): boolean[][] { return this.modules }

  // ─── Private drawing helpers ───────────────────────────────────────────

  private drawFunctionPatterns(): void {
    for (let i = 0; i < this.size; i++) { this.setFunctionModule(6, i, i % 2 === 0); this.setFunctionModule(i, 6, i % 2 === 0) }
    this.drawFinderPattern(3, 3); this.drawFinderPattern(this.size - 4, 3); this.drawFinderPattern(3, this.size - 4)
    const alignPatPos = this.getAlignmentPatternPositions()
    const numAlign = alignPatPos.length
    for (let i = 0; i < numAlign; i++) {
      for (let j = 0; j < numAlign; j++) {
        if (!(i === 0 && j === 0 || i === 0 && j === numAlign - 1 || i === numAlign - 1 && j === 0))
          this.drawAlignmentPattern(alignPatPos[i], alignPatPos[j])
      }
    }
    this.drawFormatBits(0); this.drawVersion()
  }

  private drawFormatBits(mask: number): void {
    const data = this.errorCorrectionLevel.formatBits << 3 | mask
    let rem = data
    for (let i = 0; i < 10; i++) rem = rem << 1 ^ (rem >>> 9) * 1335
    const bits = (data << 10 | rem) ^ 21522
    assert(bits >>> 15 === 0)
    for (let i = 0; i <= 5; i++) this.setFunctionModule(8, i, getBit(bits, i))
    this.setFunctionModule(8, 7, getBit(bits, 6)); this.setFunctionModule(8, 8, getBit(bits, 7)); this.setFunctionModule(7, 8, getBit(bits, 8))
    for (let i = 9; i < 15; i++) this.setFunctionModule(14 - i, 8, getBit(bits, i))
    for (let i = 0; i < 8; i++) this.setFunctionModule(this.size - 1 - i, 8, getBit(bits, i))
    for (let i = 8; i < 15; i++) this.setFunctionModule(8, this.size - 15 + i, getBit(bits, i))
    this.setFunctionModule(8, this.size - 8, true)
  }

  private drawVersion(): void {
    if (this.version < 7) return
    let rem = this.version
    for (let i = 0; i < 12; i++) rem = rem << 1 ^ (rem >>> 11) * 7973
    const bits = this.version << 12 | rem
    assert(bits >>> 18 === 0)
    for (let i = 0; i < 18; i++) {
      const color = getBit(bits, i)
      const a = this.size - 11 + i % 3; const b = Math.floor(i / 3)
      this.setFunctionModule(a, b, color); this.setFunctionModule(b, a, color)
    }
  }

  private drawFinderPattern(x: number, y: number): void {
    for (let dy = -4; dy <= 4; dy++) {
      for (let dx = -4; dx <= 4; dx++) {
        const dist = Math.max(Math.abs(dx), Math.abs(dy))
        const xx = x + dx; const yy = y + dy
        if (0 <= xx && xx < this.size && 0 <= yy && yy < this.size)
          this.setFunctionModule(xx, yy, dist !== 2 && dist !== 4)
      }
    }
  }

  private drawAlignmentPattern(x: number, y: number): void {
    for (let dy = -2; dy <= 2; dy++) {
      for (let dx = -2; dx <= 2; dx++) this.setFunctionModule(x + dx, y + dy, Math.max(Math.abs(dx), Math.abs(dy)) !== 1)
    }
  }

  private setFunctionModule(x: number, y: number, isDark: boolean): void {
    this.modules[y][x] = isDark; this.isFunction[y][x] = true
  }

  private addEccAndInterleave(data: number[]): number[] {
    const ver = this.version; const ecl = this.errorCorrectionLevel
    if (data.length !== QrCode.getNumDataCodewords(ver, ecl)) throw new RangeError('Invalid argument')
    const numBlocks = QrCode.NUM_ERROR_CORRECTION_BLOCKS[ecl.ordinal][ver]
    const blockEccLen = QrCode.ECC_CODEWORDS_PER_BLOCK[ecl.ordinal][ver]
    const rawCodewords = Math.floor(QrCode.getNumRawDataModules(ver) / 8)
    const numShortBlocks = numBlocks - rawCodewords % numBlocks
    const shortBlockLen = Math.floor(rawCodewords / numBlocks)
    const blocks: number[][] = []
    const rsDiv = QrCode.reedSolomonComputeDivisor(blockEccLen)
    for (let i = 0, k = 0; i < numBlocks; i++) {
      const dat = data.slice(k, k + shortBlockLen - blockEccLen + (i < numShortBlocks ? 0 : 1))
      k += dat.length
      const ecc = QrCode.reedSolomonComputeRemainder(dat, rsDiv)
      if (i < numShortBlocks) dat.push(0)
      blocks.push(dat.concat(ecc))
    }
    const result: number[] = []
    for (let i = 0; i < blocks[0].length; i++) {
      blocks.forEach((block, j) => { if (i !== shortBlockLen - blockEccLen || j >= numShortBlocks) result.push(block[i]) })
    }
    assert(result.length === rawCodewords)
    return result
  }

  private drawCodewords(data: number[]): void {
    if (data.length !== Math.floor(QrCode.getNumRawDataModules(this.version) / 8)) throw new RangeError('Invalid argument')
    let i = 0
    for (let right = this.size - 1; right >= 1; right -= 2) {
      if (right === 6) right = 5
      for (let vert = 0; vert < this.size; vert++) {
        for (let j = 0; j < 2; j++) {
          const x = right - j; const upward = (right + 1 & 2) === 0; const y = upward ? this.size - 1 - vert : vert
          if (!this.isFunction[y][x] && i < data.length * 8) { this.modules[y][x] = getBit(data[i >>> 3], 7 - (i & 7)); i++ }
        }
      }
    }
    assert(i === data.length * 8)
  }

  private applyMask(mask: number): void {
    if (mask < 0 || mask > 7) throw new RangeError('Mask value out of range')
    for (let y = 0; y < this.size; y++) {
      for (let x = 0; x < this.size; x++) {
        let invert: boolean
        switch (mask) {
          case 0: invert = (x + y) % 2 === 0; break
          case 1: invert = y % 2 === 0; break
          case 2: invert = x % 3 === 0; break
          case 3: invert = (x + y) % 3 === 0; break
          case 4: invert = (Math.floor(x / 3) + Math.floor(y / 2)) % 2 === 0; break
          case 5: invert = x * y % 2 + x * y % 3 === 0; break
          case 6: invert = (x * y % 2 + x * y % 3) % 2 === 0; break
          case 7: invert = ((x + y) % 2 + x * y % 3) % 2 === 0; break
          default: throw new Error('Unreachable')
        }
        if (!this.isFunction[y][x] && invert) this.modules[y][x] = !this.modules[y][x]
      }
    }
  }

  private getPenaltyScore(): number {
    let result = 0
    for (let y = 0; y < this.size; y++) {
      let runColor = false; let runX = 0; const runHistory = [0, 0, 0, 0, 0, 0, 0]
      for (let x = 0; x < this.size; x++) {
        if (this.modules[y][x] === runColor) { runX++; if (runX === 5) result += QrCode.PENALTY_N1; else if (runX > 5) result++ }
        else { this.finderPenaltyAddHistory(runX, runHistory); if (!runColor) result += this.finderPenaltyCountPatterns(runHistory) * QrCode.PENALTY_N3; runColor = this.modules[y][x]; runX = 1 }
      }
      result += this.finderPenaltyTerminateAndCount(runColor, runX, runHistory) * QrCode.PENALTY_N3
    }
    for (let x = 0; x < this.size; x++) {
      let runColor = false; let runY = 0; const runHistory = [0, 0, 0, 0, 0, 0, 0]
      for (let y = 0; y < this.size; y++) {
        if (this.modules[y][x] === runColor) { runY++; if (runY === 5) result += QrCode.PENALTY_N1; else if (runY > 5) result++ }
        else { this.finderPenaltyAddHistory(runY, runHistory); if (!runColor) result += this.finderPenaltyCountPatterns(runHistory) * QrCode.PENALTY_N3; runColor = this.modules[y][x]; runY = 1 }
      }
      result += this.finderPenaltyTerminateAndCount(runColor, runY, runHistory) * QrCode.PENALTY_N3
    }
    for (let y = 0; y < this.size - 1; y++) {
      for (let x = 0; x < this.size - 1; x++) {
        const color = this.modules[y][x]
        if (color === this.modules[y][x + 1] && color === this.modules[y + 1][x] && color === this.modules[y + 1][x + 1]) result += QrCode.PENALTY_N2
      }
    }
    let dark = 0
    for (const row of this.modules) dark = row.reduce((sum, c) => sum + (c ? 1 : 0), dark)
    const total = this.size * this.size
    const k = Math.ceil(Math.abs(dark * 20 - total * 10) / total) - 1
    assert(0 <= k && k <= 9)
    result += k * QrCode.PENALTY_N4
    assert(0 <= result && result <= 2568888)
    return result
  }

  private getAlignmentPatternPositions(): number[] {
    if (this.version === 1) return []
    const numAlign = Math.floor(this.version / 7) + 2
    const step = this.version === 32 ? 26 : Math.ceil((this.version * 4 + 4) / (numAlign * 2 - 2)) * 2
    const result = [6]
    for (let pos = this.size - 7; result.length < numAlign; pos -= step) result.splice(1, 0, pos)
    return result
  }

  static getNumRawDataModules(ver: number): number {
    if (ver < QrCode.MIN_VERSION || ver > QrCode.MAX_VERSION) throw new RangeError('Version number out of range')
    let result = (16 * ver + 128) * ver + 64
    if (ver >= 2) { const n = Math.floor(ver / 7) + 2; result -= (25 * n - 10) * n - 55; if (ver >= 7) result -= 36 }
    assert(208 <= result && result <= 29648)
    return result
  }

  static getNumDataCodewords(ver: number, ecl: Ecc): number {
    return Math.floor(QrCode.getNumRawDataModules(ver) / 8) - QrCode.ECC_CODEWORDS_PER_BLOCK[ecl.ordinal][ver] * QrCode.NUM_ERROR_CORRECTION_BLOCKS[ecl.ordinal][ver]
  }

  private static reedSolomonComputeDivisor(degree: number): number[] {
    if (degree < 1 || degree > 255) throw new RangeError('Degree out of range')
    const result: number[] = []
    for (let i = 0; i < degree - 1; i++) result.push(0)
    result.push(1)
    let root = 1
    for (let i = 0; i < degree; i++) {
      for (let j = 0; j < result.length; j++) { result[j] = QrCode.reedSolomonMultiply(result[j], root); if (j + 1 < result.length) result[j] ^= result[j + 1] }
      root = QrCode.reedSolomonMultiply(root, 2)
    }
    return result
  }

  private static reedSolomonComputeRemainder(data: number[], divisor: number[]): number[] {
    const result = divisor.map(() => 0)
    for (const b of data) { const factor = b ^ result.shift()!; result.push(0); divisor.forEach((coef, i) => result[i] ^= QrCode.reedSolomonMultiply(coef, factor)) }
    return result
  }

  private static reedSolomonMultiply(x: number, y: number): number {
    if (x >>> 8 !== 0 || y >>> 8 !== 0) throw new RangeError('Byte out of range')
    let z = 0
    for (let i = 7; i >= 0; i--) { z = z << 1 ^ (z >>> 7) * 285; z ^= (y >>> i & 1) * x }
    assert(z >>> 8 === 0)
    return z
  }

  private finderPenaltyCountPatterns(runHistory: number[]): number {
    const n = runHistory[1]; assert(n <= this.size * 3)
    const core = n > 0 && runHistory[2] === n && runHistory[3] === n * 3 && runHistory[4] === n && runHistory[5] === n
    return (core && runHistory[0] >= n * 4 && runHistory[6] >= n ? 1 : 0) + (core && runHistory[6] >= n * 4 && runHistory[0] >= n ? 1 : 0)
  }

  private finderPenaltyTerminateAndCount(currentRunColor: boolean, currentRunLength: number, runHistory: number[]): number {
    if (currentRunColor) { this.finderPenaltyAddHistory(currentRunLength, runHistory); currentRunLength = 0 }
    currentRunLength += this.size; this.finderPenaltyAddHistory(currentRunLength, runHistory)
    return this.finderPenaltyCountPatterns(runHistory)
  }

  private finderPenaltyAddHistory(currentRunLength: number, runHistory: number[]): void {
    if (runHistory[0] === 0) currentRunLength += this.size
    runHistory.pop(); runHistory.unshift(currentRunLength)
  }
}

// ─── Helpers ───────────────────────────────────────────────────────────────

function appendBits(val: number, len: number, bb: number[]): void {
  if (len < 0 || len > 31 || val >>> len !== 0) throw new RangeError('Value out of range')
  for (let i = len - 1; i >= 0; i--) bb.push(val >>> i & 1)
}

function getBit(x: number, i: number): boolean {
  return (x >>> i & 1) !== 0
}

function assert(cond: boolean): void {
  if (!cond) throw new Error('Assertion error')
}

// ─── Public API ────────────────────────────────────────────────────────────

/**
 * Generate a QR code matrix from text.
 * Returns a 2D boolean array where true = dark module.
 */
export function generateQrMatrix(text: string, ecl: 'L' | 'M' | 'Q' | 'H' = 'L'): boolean[][] {
  const eccMap = { L: Ecc.LOW, M: Ecc.MEDIUM, Q: Ecc.QUARTILE, H: Ecc.HIGH }
  const qr = QrCode.encodeText(text, eccMap[ecl])
  return qr.getModules()
}
