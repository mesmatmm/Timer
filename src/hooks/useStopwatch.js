import { useState, useRef, useCallback, useEffect } from 'react'

export function useStopwatch() {
  const [elapsed, setElapsed] = useState(0)
  const [isRunning, setIsRunning] = useState(false)
  const [laps, setLaps] = useState([])
  const startTimeRef = useRef(null)
  const accumulatedRef = useRef(0)
  const rafRef = useRef(null)

  const tick = useCallback(() => {
    if (startTimeRef.current !== null) {
      setElapsed(accumulatedRef.current + (Date.now() - startTimeRef.current))
      rafRef.current = requestAnimationFrame(tick)
    }
  }, [])

  const start = useCallback(() => {
    if (!isRunning) {
      startTimeRef.current = Date.now()
      setIsRunning(true)
      rafRef.current = requestAnimationFrame(tick)
    }
  }, [isRunning, tick])

  const pause = useCallback(() => {
    if (isRunning) {
      accumulatedRef.current += Date.now() - startTimeRef.current
      startTimeRef.current = null
      setIsRunning(false)
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
    }
  }, [isRunning])

  const reset = useCallback(() => {
    accumulatedRef.current = 0
    startTimeRef.current = null
    setIsRunning(false)
    setElapsed(0)
    setLaps([])
    if (rafRef.current) cancelAnimationFrame(rafRef.current)
  }, [])

  const addLap = useCallback(() => {
    if (isRunning || elapsed > 0) {
      setLaps(prev => [elapsed, ...prev])
    }
  }, [elapsed, isRunning])

  useEffect(() => {
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
    }
  }, [])

  return { elapsed, isRunning, start, pause, reset, laps, addLap }
}
