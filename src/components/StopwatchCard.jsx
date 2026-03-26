import React from 'react'
import { motion } from 'framer-motion'
import { useStopwatch } from '../hooks/useStopwatch'
import CircularProgress from './CircularProgress'
import { formatStopwatch } from '../utils/timeUtils'

const LAP_CYCLE_MS = 60000 // 1 minute for a full circle

export default function StopwatchCard({ card, isActive, onActivate, onDelete }) {
  const { elapsed, isRunning, start, pause, reset, laps, addLap } = useStopwatch()

  const handleStartPause = () => {
    onActivate()
    if (isRunning) pause()
    else start()
  }

  const progress = (elapsed % LAP_CYCLE_MS) / LAP_CYCLE_MS

  return (
    <motion.div
      className={`bg-white/10 backdrop-blur-md border rounded-2xl p-5 flex flex-col gap-4 cursor-pointer transition-all ${
        isActive ? 'border-emerald-400/50 shadow-lg shadow-emerald-500/20' : 'border-white/20'
      }`}
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      onClick={onActivate}
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-lg">⏱</span>
          <span className="text-white font-semibold text-sm truncate max-w-[120px]">{card.name}</span>
          {isActive && <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />}
        </div>
        <button
          onClick={e => { e.stopPropagation(); onDelete() }}
          className="text-white/30 hover:text-red-400 transition-colors text-lg font-bold w-7 h-7 flex items-center justify-center rounded-full hover:bg-red-400/10"
        >
          ×
        </button>
      </div>

      {/* Circular Progress */}
      <div className="flex justify-center">
        <CircularProgress
          progress={progress}
          size={160}
          strokeWidth={10}
          color={isRunning ? '#10b981' : '#6b7280'}
        >
          <div className="text-center">
            <div className="text-2xl font-bold font-mono text-white">
              {formatStopwatch(elapsed)}
            </div>
            {laps.length > 0 && (
              <div className="text-emerald-400 text-xs font-semibold mt-1">
                Lap {laps.length}
              </div>
            )}
          </div>
        </CircularProgress>
      </div>

      {/* Controls */}
      <div className="flex gap-2 justify-center">
        <button
          onClick={e => { e.stopPropagation(); handleStartPause() }}
          className={`flex-1 py-2 rounded-xl font-semibold text-sm transition-all ${
            isRunning
              ? 'bg-amber-500 hover:bg-amber-400 text-white'
              : 'bg-emerald-500 hover:bg-emerald-400 text-white'
          }`}
        >
          {isRunning ? 'Pause' : elapsed > 0 ? 'Resume' : 'Start'}
        </button>
        <button
          onClick={e => { e.stopPropagation(); addLap() }}
          disabled={!isRunning && elapsed === 0}
          className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white font-semibold text-sm transition-all disabled:opacity-40 disabled:cursor-not-allowed"
        >
          Lap
        </button>
        <button
          onClick={e => { e.stopPropagation(); reset() }}
          className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white font-semibold text-sm transition-all"
        >
          Reset
        </button>
      </div>

      {/* Laps list */}
      {laps.length > 0 && (
        <div className="max-h-32 overflow-y-auto space-y-1">
          {laps.map((lap, i) => {
            const prevLap = laps[i + 1] || 0
            const lapTime = lap - prevLap
            return (
              <div
                key={i}
                className="flex justify-between text-xs px-3 py-1.5 rounded-lg bg-white/5"
              >
                <span className="text-white/50">Lap {laps.length - i}</span>
                <span className="text-white font-mono">{formatStopwatch(lapTime)}</span>
                <span className="text-white/40 font-mono">{formatStopwatch(lap)}</span>
              </div>
            )
          })}
        </div>
      )}
    </motion.div>
  )
}
