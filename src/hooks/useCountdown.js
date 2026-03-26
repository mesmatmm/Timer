import { useState, useRef, useCallback, useEffect } from 'react'

export function useCountdown(initialMs = 0, onFinish) {
  const [totalMs, setTotalMs] = useState(initialMs)
  const [timeLeft, setTimeLeft] = useState(initialMs)
  const [isRunning, setIsRunning] = useState(false)
  const [isFinished, setIsFinished] = useState(false)
  const endTimeRef = useRef(null)
  const remainingAtPauseRef = useRef(initialMs)
  const rafRef = useRef(null)
  const onFinishRef = useRef(onFinish)

  useEffect(() => {
    onFinishRef.current = onFinish
  }, [onFinish])

  const tick = useCallback(() => {
    if (endTimeRef.current !== null) {
      const left = endTimeRef.current - Date.now()
      if (left <= 0) {
        setTimeLeft(0)
        setIsRunning(false)
        setIsFinished(true)
        endTimeRef.current = null
        remainingAtPauseRef.current = 0
        if (onFinishRef.current) onFinishRef.current()
        return
      }
      setTimeLeft(left)
      rafRef.current = requestAnimationFrame(tick)
    }
  }, [])

  const setDuration = useCallback((ms) => {
    setTotalMs(ms)
    setTimeLeft(ms)
    remainingAtPauseRef.current = ms
    setIsRunning(false)
    setIsFinished(false)
    endTimeRef.current = null
    if (rafRef.current) cancelAnimationFrame(rafRef.current)
  }, [])

  const start = useCallback(() => {
    if (!isRunning && remainingAtPauseRef.current > 0) {
      endTimeRef.current = Date.now() + remainingAtPauseRef.current
      setIsRunning(true)
      setIsFinished(false)
      rafRef.current = requestAnimationFrame(tick)
    }
  }, [isRunning, tick])

  const pause = useCallback(() => {
    if (isRunning) {
      remainingAtPauseRef.current = endTimeRef.current - Date.now()
      endTimeRef.current = null
      setIsRunning(false)
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
    }
  }, [isRunning])

  const reset = useCallback(() => {
    endTimeRef.current = null
    remainingAtPauseRef.current = totalMs
    setTimeLeft(totalMs)
    setIsRunning(false)
    setIsFinished(false)
    if (rafRef.current) cancelAnimationFrame(rafRef.current)
  }, [totalMs])

  const progress = totalMs > 0 ? 1 - timeLeft / totalMs : 0

  useEffect(() => {
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
    }
  }, [])

  return { timeLeft, isRunning, isFinished, start, pause, reset, setDuration, progress, totalMs }
}
