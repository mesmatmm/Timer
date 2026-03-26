import React, { useCallback } from 'react'
import { motion } from 'framer-motion'
import { usePomodoro } from '../hooks/usePomodoro'
import { useSound } from '../hooks/useSound'
import { useNotifications } from '../hooks/useNotifications'
import { useApp } from '../context/AppContext'
import CircularProgress from './CircularProgress'
import { formatCountdown } from '../utils/timeUtils'

const phaseColors = {
  work: '#6366f1',
  shortBreak: '#10b981',
  longBreak: '#f59e0b',
}

const phaseIcons = {
  work: '💼',
  shortBreak: '☕',
  longBreak: '🌟',
}

export default function PomodoroCard({ onCycleComplete }) {
  const { state, dispatch } = useApp()
  const { playSound } = useSound()
  const { sendNotification } = useNotifications()

  const handlePhaseComplete = useCallback(() => {
    playSound(state.soundPreference)
    sendNotification('Pomodoro phase complete!', 'Starting next phase...')
    dispatch({ type: 'COMPLETE_POMODORO_CYCLE' })
    if (onCycleComplete) onCycleComplete()
  }, [dispatch, onCycleComplete, playSound, sendNotification, state.soundPreference])

  const {
    phase,
    phaseLabel,
    timeLeft,
    cycleCount,
    isRunning,
    start,
    pause,
    reset,
    skipPhase,
    progress,
    phaseIndex,
    phases,
  } = usePomodoro(handlePhaseComplete)

  const color = phaseColors[phase] || '#6366f1'
  const icon = phaseIcons[phase] || '🍅'

  return (
    <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-6 flex flex-col gap-6">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-white text-xl font-bold flex items-center justify-center gap-2">
          <span>🍅</span> Pomodoro Timer
        </h2>
        <p className="text-white/50 text-sm mt-1">Cycle {Math.floor(phaseIndex / 8) + 1} · Phase {phaseIndex + 1} of 8</p>
      </div>

      {/* Phase indicator */}
      <div className="flex justify-center gap-2">
        {phases.map((p, i) => (
          <div
            key={i}
            className="h-1.5 rounded-full transition-all"
            style={{
              width: i === phaseIndex ? '24px' : '8px',
              backgroundColor: i < phaseIndex ? '#6366f1' : i === phaseIndex ? color : 'rgba(255,255,255,0.15)',
            }}
          />
        ))}
      </div>

      {/* Phase label */}
      <div
        className="text-center py-2 px-4 rounded-xl font-semibold text-sm mx-auto"
        style={{ backgroundColor: `${color}30`, color }}
      >
        {icon} {phaseLabel}
      </div>

      {/* Circular Progress */}
      <div className="flex justify-center">
        <CircularProgress progress={progress} size={200} strokeWidth={12} color={color}>
          <div className="text-center">
            <div className="text-4xl font-bold font-mono text-white">
              {formatCountdown(timeLeft)}
            </div>
            <div className="text-white/50 text-xs mt-2">
              {cycleCount} cycles done
            </div>
          </div>
        </CircularProgress>
      </div>

      {/* Controls */}
      <div className="flex gap-3 justify-center">
        <button
          onClick={() => isRunning ? pause() : start()}
          className="flex-1 py-3 rounded-xl font-semibold transition-all text-white"
          style={{
            backgroundColor: isRunning ? '#f59e0b' : color,
          }}
        >
          {isRunning ? 'Pause' : 'Start'}
        </button>
        <button
          onClick={skipPhase}
          className="px-4 py-3 rounded-xl bg-white/10 hover:bg-white/20 text-white font-semibold transition-all"
          title="Skip to next phase"
        >
          Skip ⏭
        </button>
        <button
          onClick={reset}
          className="px-4 py-3 rounded-xl bg-white/10 hover:bg-white/20 text-white font-semibold transition-all"
        >
          Reset
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-white/5 rounded-xl p-3 text-center">
          <div className="text-2xl font-bold text-white">{state.stats.sessionsToday}</div>
          <div className="text-white/50 text-xs">Sessions Today</div>
        </div>
        <div className="bg-white/5 rounded-xl p-3 text-center">
          <div className="text-2xl font-bold text-white">{state.stats.pomadoroCycles}</div>
          <div className="text-white/50 text-xs">Total Cycles</div>
        </div>
      </div>
    </div>
  )
}
