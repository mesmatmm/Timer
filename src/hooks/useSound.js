import { useCallback, useRef } from 'react'

export function useSound() {
  const audioCtxRef = useRef(null)

  const getCtx = useCallback(() => {
    if (!audioCtxRef.current) {
      audioCtxRef.current = new (window.AudioContext || window.webkitAudioContext)()
    }
    return audioCtxRef.current
  }, [])

  const playBeep = useCallback(() => {
    const ctx = getCtx()
    const oscillator = ctx.createOscillator()
    const gainNode = ctx.createGain()
    oscillator.connect(gainNode)
    gainNode.connect(ctx.destination)
    oscillator.type = 'sine'
    oscillator.frequency.setValueAtTime(440, ctx.currentTime)
    gainNode.gain.setValueAtTime(0.3, ctx.currentTime)
    gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.5)
    oscillator.start(ctx.currentTime)
    oscillator.stop(ctx.currentTime + 0.5)
  }, [getCtx])

  const playChime = useCallback(() => {
    const ctx = getCtx()
    const oscillator = ctx.createOscillator()
    const gainNode = ctx.createGain()
    oscillator.connect(gainNode)
    gainNode.connect(ctx.destination)
    oscillator.type = 'sine'
    oscillator.frequency.setValueAtTime(880, ctx.currentTime)
    oscillator.frequency.exponentialRampToValueAtTime(440, ctx.currentTime + 0.8)
    gainNode.gain.setValueAtTime(0.4, ctx.currentTime)
    gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 1.0)
    oscillator.start(ctx.currentTime)
    oscillator.stop(ctx.currentTime + 1.0)
  }, [getCtx])

  const playBell = useCallback(() => {
    const ctx = getCtx()
    const frequencies = [523.25, 659.25, 783.99]
    frequencies.forEach((freq, i) => {
      const oscillator = ctx.createOscillator()
      const gainNode = ctx.createGain()
      oscillator.connect(gainNode)
      gainNode.connect(ctx.destination)
      oscillator.type = 'sine'
      oscillator.frequency.setValueAtTime(freq, ctx.currentTime + i * 0.15)
      gainNode.gain.setValueAtTime(0, ctx.currentTime + i * 0.15)
      gainNode.gain.linearRampToValueAtTime(0.3, ctx.currentTime + i * 0.15 + 0.05)
      gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + i * 0.15 + 1.2)
      oscillator.start(ctx.currentTime + i * 0.15)
      oscillator.stop(ctx.currentTime + i * 0.15 + 1.2)
    })
  }, [getCtx])

  const playSound = useCallback((soundType) => {
    try {
      if (soundType === 'beep') playBeep()
      else if (soundType === 'chime') playChime()
      else if (soundType === 'bell') playBell()
    } catch (e) {
      console.warn('Could not play sound:', e)
    }
  }, [playBeep, playChime, playBell])

  return { playSound }
}
