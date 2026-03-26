import React, { useState, useCallback } from 'react'
import { motion } from 'framer-motion'
import { useCountdown } from '../hooks/useCountdown'
import { useSound } from '../hooks/useSound'
import { useNotifications } from '../hooks/useNotifications'
import { useApp } from '../context/AppContext'
import CircularProgress from './CircularProgress'
import { formatCountdown, parseHMS } from '../utils/timeUtils'

export default function CountdownCard({ card, isActive, onActivate, onDelete }) {
  const { state, dispatch } = useApp()
  const { playSound } = useSound()
  const { sendNotification } = useNotifications()
  const [hours, setHours] = useState('0')
  const [minutes, setMinutes] = useState('25')
  const [seconds, setSeconds] = useState('0')
  const [isFlashing, setIsFlashing] = useState(false)
  const [isEditing, setIsEditing] = useState(false)

  const handleFinish = useCallback(() => {
    playSound(state.soundPreference)
    sendNotification(`${card.name} finished!`, 'Your countdown timer has ended.')
    setIsFlashing(true)
    setTimeout(() => setIsFlashing(false), 5000)
    const totalMs = parseHMS(hours, minutes, seconds)
    dispatch({
      type: 'COMPLETE_SESSION',
      payload: { sessionType: 'countdown', minutes: Math.round(totalMs / 60000) }
    })
  }, [card.name, dispatch, hours, minutes, seconds, playSound, sendNotification, state.soundPreference])

  const { timeLeft, isRunning, isFinished, start, pause, reset, setDuration, progress } = useCountdown(0, handleFinish)

  const handleSet = () => {
    const ms = parseHMS(hours, minutes, seconds)
    if (ms > 0) {
      setDuration(ms)
      setIsEditing(false)
    }
  }

  const handleStartPause = () => {
    onActivate()
    if (isRunning) {
      pause()
    } else {
      if (timeLeft === 0 || isFinished) {
        const ms = parseHMS(hours, minutes, seconds)
        setDuration(ms)
        setTimeout(() => start(), 50)
      } else {
        start()
      }
    }
    setIsFlashing(false)
  }

  const handleReset = () => {
    reset()
    setIsFlashing(false)
  }

  const progressColor = isFinished || isFlashing ? '#ef4444' : isRunning ? '#6366f1' : '#8b5cf6'

  return (
    <motion.div
      className={`bg-white/10 backdrop-blur-md border rounded-2xl p-5 flex flex-col gap-4 cursor-pointer transition-all ${
        isActive ? 'border-indigo-400/50 shadow-lg shadow-indigo-500/20' : 'border-white/20'
      } ${isFlashing ? 'animate-flash' : ''}`}
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      onClick={onActivate}
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-lg">⏳</span>
          <span className="text-white font-semibold text-sm truncate max-w-[120px]">{card.name}</span>
          {isActive && <span className="w-2 h-2 rounded-full bg-indigo-400 animate-pulse" />}
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
        <CircularProgress progress={progress} size={160} strokeWidth={10} color={progressColor}>
          <div className="text-center">
            <div className={`text-3xl font-bold font-mono ${isFlashing ? 'text-red-400' : 'text-white'}`}>
              {formatCountdown(timeLeft)}
            </div>
            {isFinished && (
              <div className="text-red-400 text-xs font-semibold mt-1 animate-pulse">DONE!</div>
            )}
          </div>
        </CircularProgress>
      </div>

      {/* Time inputs */}
      {(timeLeft === 0 || isEditing) && !isRunning ? (
        <div className="flex items-center justify-center gap-2">
          <div className="flex flex-col items-center">
            <input
              type="number"
              min="0"
              max="99"
              value={hours}
              onChange={e => setHours(e.target.value)}
              onClick={e => e.stopPropagation()}
              className="w-14 text-center py-1 px-2 rounded-lg bg-white/10 border border-white/20 text-white font-mono text-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <span className="text-white/40 text-xs mt-1">hr</span>
          </div>
          <span className="text-white/60 text-xl font-bold pb-4">:</span>
          <div className="flex flex-col items-center">
            <input
              type="number"
              min="0"
              max="59"
              value={minutes}
              onChange={e => setMinutes(e.target.value)}
              onClick={e => e.stopPropagation()}
              className="w-14 text-center py-1 px-2 rounded-lg bg-white/10 border border-white/20 text-white font-mono text-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <span className="text-white/40 text-xs mt-1">min</span>
          </div>
          <span className="text-white/60 text-xl font-bold pb-4">:</span>
          <div className="flex flex-col items-center">
            <input
              type="number"
              min="0"
              max="59"
              value={seconds}
              onChange={e => setSeconds(e.target.value)}
              onClick={e => e.stopPropagation()}
              className="w-14 text-center py-1 px-2 rounded-lg bg-white/10 border border-white/20 text-white font-mono text-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <span className="text-white/40 text-xs mt-1">sec</span>
          </div>
        </div>
      ) : !isEditing && !isRunning && timeLeft > 0 ? (
        <button
          onClick={e => { e.stopPropagation(); setIsEditing(true) }}
          className="text-indigo-300 text-xs hover:text-indigo-200 transition-colors text-center"
        >
          Edit time
        </button>
      ) : null}

      {/* Controls */}
      <div className="flex gap-2 justify-center">
        {(timeLeft === 0 || isEditing) && !isRunning ? (
          <button
            onClick={e => { e.stopPropagation(); handleSet() }}
            className="flex-1 py-2 rounded-xl bg-indigo-500 hover:bg-indigo-400 text-white font-semibold text-sm transition-all"
          >
            Set & Start
          </button>
        ) : (
          <>
            <button
              onClick={e => { e.stopPropagation(); handleStartPause() }}
              className={`flex-1 py-2 rounded-xl font-semibold text-sm transition-all ${
                isRunning
                  ? 'bg-amber-500 hover:bg-amber-400 text-white'
                  : 'bg-indigo-500 hover:bg-indigo-400 text-white'
              }`}
            >
              {isRunning ? 'Pause' : 'Start'}
            </button>
            <button
              onClick={e => { e.stopPropagation(); handleReset() }}
              className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white font-semibold text-sm transition-all"
            >
              Reset
            </button>
          </>
        )}
      </div>
    </motion.div>
  )
}
