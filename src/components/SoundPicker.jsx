import React from 'react'
import { useApp } from '../context/AppContext'
import { useSound } from '../hooks/useSound'

const soundOptions = [
  { value: 'beep', label: 'Beep', icon: '📢' },
  { value: 'chime', label: 'Chime', icon: '🔔' },
  { value: 'bell', label: 'Bell', icon: '🎵' },
]

export default function SoundPicker() {
  const { state, dispatch } = useApp()
  const { playSound } = useSound()

  const handleSelect = (sound) => {
    dispatch({ type: 'SET_SOUND', payload: { sound } })
    playSound(sound)
  }

  return (
    <div className="flex items-center gap-2">
      <span className="text-white/60 text-sm mr-1">Sound:</span>
      {soundOptions.map(({ value, label, icon }) => (
        <button
          key={value}
          onClick={() => handleSelect(value)}
          className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
            state.soundPreference === value
              ? 'bg-indigo-500 text-white shadow-lg'
              : 'bg-white/10 text-white/70 hover:bg-white/20 hover:text-white'
          }`}
          title={`${label} sound`}
        >
          {icon} {label}
        </button>
      ))}
    </div>
  )
}
