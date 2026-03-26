import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { useAlarm } from '../hooks/useAlarm'
import { useSound } from '../hooks/useSound'
import { useNotifications } from '../hooks/useNotifications'
import { useApp } from '../context/AppContext'
import CircularProgress from './CircularProgress'
import { formatCountdown } from '../utils/timeUtils'

export default function AlarmCard({ card, isActive, onActivate, onDelete }) {
  const { state } = useApp()
  const { playSound } = useSound()
  const { sendNotification } = useNotifications()
  const [timeInput, setTimeInput] = useState(() => {
    const now = new Date()
    return `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes() + 5).padStart(2, '0')}`
  })
  const [alarmSet, setAlarmSet] = useState(false)

  const handleAlarm = () => {
    playSound(state.soundPreference)
    sendNotification(`${card.name}`, 'Your alarm is ringing!')
  }

  const { timeLeft, isActive: alarmActive, isFired, setAlarm, start, stop, reset } = useAlarm(handleAlarm)

  const handleSet = () => {
    setAlarm(timeInput)
    setAlarmSet(true)
  }

  const handleStart = () => {
    onActivate()
    if (!alarmSet) {
      handleSet()
    }
    start()
  }

  const handleReset = () => {
    reset()
    setAlarmSet(false)
  }

  const totalDayMs = 24 * 60 * 60 * 1000
  const progress = timeLeft !== null ? 1 - timeLeft / totalDayMs : 0

  const alarmColor = isFired ? '#ef4444' : alarmActive ? '#f59e0b' : '#8b5cf6'

  return (
    <motion.div
      className={`bg-white/10 backdrop-blur-md border rounded-2xl p-5 flex flex-col gap-4 cursor-pointer transition-all ${
        isActive ? 'border-amber-400/50 shadow-lg shadow-amber-500/20' : 'border-white/20'
      } ${isFired ? 'border-red-400/50 animate-flash' : ''}`}
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      onClick={onActivate}
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-lg">🔔</span>
          <span className="text-white font-semibold text-sm truncate max-w-[120px]">{card.name}</span>
          {alarmActive && <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />}
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
        <CircularProgress progress={progress} size={160} strokeWidth={10} color={alarmColor}>
          <div className="text-center">
            {isFired ? (
              <div className="text-red-400 text-2xl font-bold animate-pulse">ALARM!</div>
            ) : alarmActive && timeLeft !== null ? (
              <>
                <div className="text-2xl font-bold font-mono text-white">
                  {formatCountdown(timeLeft)}
                </div>
                <div className="text-white/50 text-xs mt-1">until {timeInput}</div>
              </>
            ) : (
              <>
                <div className="text-4xl mb-1">🔔</div>
                <div className="text-white/60 text-xs">Set alarm</div>
              </>
            )}
          </div>
        </CircularProgress>
      </div>

      {/* Time input */}
      {!alarmActive && !isFired && (
        <div className="flex items-center justify-center gap-3">
          <input
            type="time"
            value={timeInput}
            onChange={e => { setTimeInput(e.target.value); setAlarmSet(false) }}
            onClick={e => e.stopPropagation()}
            className="px-3 py-2 rounded-xl bg-white/10 border border-white/20 text-white font-mono text-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
          />
        </div>
      )}

      {/* Controls */}
      <div className="flex gap-2 justify-center">
        {isFired ? (
          <button
            onClick={e => { e.stopPropagation(); handleReset() }}
            className="flex-1 py-2 rounded-xl bg-red-500 hover:bg-red-400 text-white font-semibold text-sm transition-all"
          >
            Dismiss
          </button>
        ) : alarmActive ? (
          <>
            <button
              onClick={e => { e.stopPropagation(); stop() }}
              className="flex-1 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-white font-semibold text-sm transition-all"
            >
              Cancel Alarm
            </button>
          </>
        ) : (
          <>
            <button
              onClick={e => { e.stopPropagation(); handleStart() }}
              className="flex-1 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-white font-semibold text-sm transition-all"
            >
              Set Alarm
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
