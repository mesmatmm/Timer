import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useApp } from '../context/AppContext'

const timerTypes = [
  { type: 'countdown', label: 'Countdown', icon: '⏳', desc: 'Count down from a set time' },
  { type: 'stopwatch', label: 'Stopwatch', icon: '⏱', desc: 'Count up from zero with laps' },
  { type: 'alarm', label: 'Alarm', icon: '🔔', desc: 'Alert at a specific time' },
]

export default function AddTimerModal({ isOpen, onClose }) {
  const { dispatch } = useApp()
  const [name, setName] = useState('')

  const handleAdd = (type) => {
    dispatch({
      type: 'ADD_CARD',
      payload: { type, name: name.trim() || undefined }
    })
    setName('')
    onClose()
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
          <motion.div
            className="relative z-10 bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-6 w-full max-w-md shadow-2xl"
            initial={{ scale: 0.9, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.9, y: 20 }}
            onClick={e => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-xl font-bold text-white">Add Timer</h2>
              <button
                onClick={onClose}
                className="text-white/60 hover:text-white transition-colors text-xl font-bold w-8 h-8 flex items-center justify-center rounded-full hover:bg-white/10"
              >
                ×
              </button>
            </div>

            <div className="mb-4">
              <label className="block text-sm text-white/60 mb-2">Timer name (optional)</label>
              <input
                type="text"
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder="My timer..."
                className="w-full px-4 py-2 rounded-xl bg-white/10 border border-white/20 text-white placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                maxLength={30}
              />
            </div>

            <div className="grid gap-3">
              {timerTypes.map(({ type, label, icon, desc }) => (
                <button
                  key={type}
                  onClick={() => handleAdd(type)}
                  className="flex items-center gap-4 p-4 rounded-xl bg-white/5 hover:bg-white/15 border border-white/10 hover:border-white/30 transition-all text-left group"
                >
                  <span className="text-3xl">{icon}</span>
                  <div>
                    <div className="text-white font-semibold group-hover:text-indigo-300 transition-colors">{label}</div>
                    <div className="text-white/50 text-sm">{desc}</div>
                  </div>
                </button>
              ))}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
