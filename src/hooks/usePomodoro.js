import { useState, useRef, useCallback, useEffect } from 'react'

const PHASES = [
  { name: 'work', duration: 25 * 60 * 1000, label: 'Work' },
  { name: 'shortBreak', duration: 5 * 60 * 1000, label: 'Short Break' },
  { name: 'work', duration: 25 * 60 * 1000, label: 'Work' },
  { name: 'shortBreak', duration: 5 * 60 * 1000, label: 'Short Break' },
  { name: 'work', duration: 25 * 60 * 1000, label: 'Work' },
  { name: 'shortBreak', duration: 5 * 60 * 1000, label: 'Short Break' },
  { name: 'work', duration: 25 * 60 * 1000, label: 'Work' },
  { name: 'longBreak', duration: 15 * 60 * 1000, label: 'Long Break' },
]

export function usePomodoro(onPhaseComplete) {
  const [phaseIndex, setPhaseIndex] = useState(0)
  const [cycleCount, setCycleCount] = useState(0)
  const [timeLeft, setTimeLeft] = useState(PHASES[0].duration)
  const [isRunning, setIsRunning] = useState(false)
  const endTimeRef = useRef(null)
  const remainingRef = useRef(PHASES[0].duration)
  const rafRef = useRef(null)
  const onPhaseCompleteRef = useRef(onPhaseComplete)

  useEffect(() => {
    onPhaseCompleteRef.current = onPhaseComplete
  }, [onPhaseComplete])

  const tick = useCallback(() => {
    if (endTimeRef.current !== null) {
      const left = endTimeRef.current - Date.now()
      if (left <= 0) {
        setTimeLeft(0)
        setIsRunning(false)
        endTimeRef.current = null
        if (onPhaseCompleteRef.current) onPhaseCompleteRef.current()
        // Auto-advance to next phase
        setPhaseIndex(prev => {
          const next = (prev + 1) % PHASES.length
          const nextDuration = PHASES[next].duration
          remainingRef.current = nextDuration
          setTimeLeft(nextDuration)
          if (next === 0) {
            setCycleCount(c => c + 1)
          }
          return next
        })
        return
      }
      setTimeLeft(left)
      rafRef.current = requestAnimationFrame(tick)
    }
  }, [])

  const start = useCallback(() => {
    if (!isRunning && remainingRef.current > 0) {
      endTimeRef.current = Date.now() + remainingRef.current
      setIsRunning(true)
      rafRef.current = requestAnimationFrame(tick)
    }
  }, [isRunning, tick])

  const pause = useCallback(() => {
    if (isRunning) {
      remainingRef.current = endTimeRef.current - Date.now()
      endTimeRef.current = null
      setIsRunning(false)
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
    }
  }, [isRunning])

  const reset = useCallback(() => {
    endTimeRef.current = null
    setPhaseIndex(0)
    setCycleCount(0)
    remainingRef.current = PHASES[0].duration
    setTimeLeft(PHASES[0].duration)
    setIsRunning(false)
    if (rafRef.current) cancelAnimationFrame(rafRef.current)
  }, [])

  const skipPhase = useCallback(() => {
    if (rafRef.current) cancelAnimationFrame(rafRef.current)
    endTimeRef.current = null
    setIsRunning(false)
    setPhaseIndex(prev => {
      const next = (prev + 1) % PHASES.length
      const nextDuration = PHASES[next].duration
      remainingRef.current = nextDuration
      setTimeLeft(nextDuration)
      if (next === 0) setCycleCount(c => c + 1)
      return next
    })
  }, [])

  const currentPhase = PHASES[phaseIndex]
  const progress = currentPhase.duration > 0 ? 1 - timeLeft / currentPhase.duration : 0

  useEffect(() => {
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
    }
  }, [])

  return {
    phase: currentPhase.name,
    phaseLabel: currentPhase.label,
    timeLeft,
    cycleCount,
    isRunning,
    start,
    pause,
    reset,
    skipPhase,
    progress,
    phaseIndex,
    phases: PHASES,
  }
}
