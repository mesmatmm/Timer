import { useState, useRef, useCallback, useEffect } from 'react'

export function useAlarm(onAlarm) {
  const [targetTime, setTargetTime] = useState(null)
  const [timeLeft, setTimeLeft] = useState(null)
  const [isActive, setIsActive] = useState(false)
  const [isFired, setIsFired] = useState(false)
  const intervalRef = useRef(null)
  const onAlarmRef = useRef(onAlarm)

  useEffect(() => {
    onAlarmRef.current = onAlarm
  }, [onAlarm])

  const tick = useCallback(() => {
    if (targetTime) {
      const now = Date.now()
      const left = targetTime - now
      if (left <= 0) {
        setTimeLeft(0)
        setIsActive(false)
        setIsFired(true)
        clearInterval(intervalRef.current)
        intervalRef.current = null
        if (onAlarmRef.current) onAlarmRef.current()
      } else {
        setTimeLeft(left)
      }
    }
  }, [targetTime])

  const setAlarm = useCallback((timeString) => {
    // timeString is HH:MM
    const [hours, minutes] = timeString.split(':').map(Number)
    const now = new Date()
    const target = new Date()
    target.setHours(hours, minutes, 0, 0)
    if (target <= now) {
      target.setDate(target.getDate() + 1)
    }
    setTargetTime(target.getTime())
    setTimeLeft(target.getTime() - Date.now())
    setIsFired(false)
    setIsActive(false)
    return target.getTime()
  }, [])

  const start = useCallback(() => {
    if (targetTime && !isActive) {
      setIsActive(true)
      setIsFired(false)
      intervalRef.current = setInterval(tick, 500)
    }
  }, [targetTime, isActive, tick])

  const stop = useCallback(() => {
    setIsActive(false)
    setIsFired(false)
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
      intervalRef.current = null
    }
  }, [])

  const reset = useCallback(() => {
    setTargetTime(null)
    setTimeLeft(null)
    setIsActive(false)
    setIsFired(false)
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
      intervalRef.current = null
    }
  }, [])

  useEffect(() => {
    if (isActive && targetTime) {
      if (intervalRef.current) clearInterval(intervalRef.current)
      intervalRef.current = setInterval(tick, 500)
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current)
    }
  }, [isActive, targetTime, tick])

  useEffect(() => {
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current)
    }
  }, [])

  return { targetTime, timeLeft, isActive, isFired, setAlarm, start, stop, reset }
}
