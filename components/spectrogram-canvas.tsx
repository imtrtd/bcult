'use client'

import { useEffect, useRef, type RefObject } from 'react'

const ROWS = 220
const COLUMNS = 400
const MIN_FREQ = 60
const MAX_FREQ = 20000
const UPDATE_INTERVAL_MS = 45
const GAMMA = 1.1
const IDLE_HARMONICS = 6

export interface SpectrogramAudioBundle {
  analyser: AnalyserNode
  context: AudioContext
}

interface SpectrogramCanvasProps {
  audioRef: RefObject<SpectrogramAudioBundle | null>
  className?: string
}

function buildColorLut(): Uint8ClampedArray {
  const lut = document.createElement('canvas')
  lut.width = 1
  lut.height = 256
  const ctx = lut.getContext('2d')!
  const gradient = ctx.createLinearGradient(0, 0, 0, 256)
  gradient.addColorStop(0, 'oklch(0.145 0 0)')
  gradient.addColorStop(0.4, 'oklch(0.24 0.045 118)')
  gradient.addColorStop(0.68, 'oklch(0.48 0.14 118)')
  gradient.addColorStop(0.87, 'oklch(0.72 0.19 118)')
  gradient.addColorStop(1, 'oklch(0.895 0.19 118)')
  ctx.fillStyle = gradient
  ctx.fillRect(0, 0, 1, 256)
  return ctx.getImageData(0, 0, 1, 256).data
}

export function SpectrogramCanvas({ audioRef, className }: SpectrogramCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d', { alpha: false })
    if (!ctx) return

    const lut = buildColorLut()
    let freqData: Uint8Array | null = null
    let lastUpdate = 0
    let rafId = 0

    function colorFor(intensity: number) {
      const shaped = Math.pow(Math.max(0, Math.min(1, intensity)), GAMMA)
      const i = Math.round(shaped * 255) * 4
      return `rgba(${lut[i]},${lut[i + 1]},${lut[i + 2]},${lut[i + 3] / 255})`
    }

    function sampleAudio(bundle: SpectrogramAudioBundle, out: Float32Array) {
      const { analyser, context } = bundle
      if (!freqData || freqData.length !== analyser.frequencyBinCount) {
        freqData = new Uint8Array(analyser.frequencyBinCount)
      }
      analyser.getByteFrequencyData(freqData)
      const binHz = context.sampleRate / analyser.fftSize
      const logMin = Math.log(MIN_FREQ)
      const logMax = Math.log(MAX_FREQ)
      for (let row = 0; row < ROWS; row++) {
        const t = 1 - row / (ROWS - 1)
        const freq = Math.exp(logMin + t * (logMax - logMin))
        const bin = Math.min(freqData.length - 1, Math.round(freq / binHz))
        out[row] = freqData[bin] / 255
      }
    }

    // idle motif: a drifting fundamental plus its harmonic series, like a held tone —
    // thin bright lines against a mostly dark field, echoing a real tonal spectrogram
    function sampleIdle(time: number, out: Float32Array) {
      const t = time * 0.00028
      out.fill(0)
      const fundamental = 0.86 + Math.sin(t * 0.5) * 0.05
      for (let h = 1; h <= IDLE_HARMONICS; h++) {
        const center = fundamental - Math.log2(h) * 0.11
        if (center < 0.02) continue
        const width = 0.016 + h * 0.0035
        const amp = (0.68 / h) * (0.55 + 0.45 * Math.abs(Math.sin(t * 3 + h * 1.7)))
        for (let row = 0; row < ROWS; row++) {
          const norm = row / (ROWS - 1)
          const d = (norm - center) / width
          out[row] += amp * Math.exp(-(d * d))
        }
      }
      for (let row = 0; row < ROWS; row++) {
        const grain = Math.abs(Math.sin(row * 12.9898 + time * 0.02)) * 0.025
        out[row] = Math.min(1, out[row] + grain)
      }
    }

    const column = new Float32Array(ROWS)

    function drawColumnAt(x: number, values: Float32Array) {
      for (let row = 0; row < ROWS; row++) {
        ctx!.fillStyle = colorFor(values[row])
        ctx!.fillRect(x, row, 1, 1)
      }
    }

    // pre-fill the full width with idle history so the panel reads as
    // already-running on first paint instead of scrolling in from empty
    for (let x = 0; x < COLUMNS; x++) {
      const virtualTime = (x - COLUMNS) * UPDATE_INTERVAL_MS
      sampleIdle(virtualTime, column)
      drawColumnAt(x, column)
    }

    function tick(time: number) {
      rafId = requestAnimationFrame(tick)
      if (time - lastUpdate < UPDATE_INTERVAL_MS) return
      lastUpdate = time

      const width = canvas!.width
      const height = canvas!.height
      ctx!.drawImage(canvas!, -1, 0, width - 1, height, 0, 0, width - 1, height)

      const bundle = audioRef.current
      if (bundle) {
        sampleAudio(bundle, column)
      } else {
        sampleIdle(time, column)
      }

      drawColumnAt(width - 1, column)
    }

    rafId = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(rafId)
  }, [audioRef])

  return (
    <canvas
      ref={canvasRef}
      width={COLUMNS}
      height={ROWS}
      aria-hidden="true"
      className={className}
    />
  )
}
