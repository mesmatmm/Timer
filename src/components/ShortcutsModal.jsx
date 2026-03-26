import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const shortcuts = [
  { key: 'Space', desc: 'Toggle active timer (Start/Pause)' },
  { key: 'R', desc: 'Reset active timer' },
  { key: 'N', desc: 'Add new timer card' },
  { key: '1', desc: 'Switch to Timers tab' },
  { key: '2', desc: 'Switch to Pomodoro tab' },
  { key: '3', desc: 'Switch to Dashboard tab' },
  { key: '?', desc: 'Show this shortcuts overlay' },
  { key: 'Esc', desc: 'Close modal / overlay' },
]

export default function ShortcutsModal({ isOpen, onClose }) {
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
              <h2 className="text-xl font-bold text-white">Keyboard Shortcuts</h2>
              <button
                onClick={onClose}
                className="text-white/60 hover:text-white transition-colors text-xl font-bold w-8 h-8 flex items-center justify-center rounded-full hover:bg-white/10"
                aria-label="Close"
              >
                ×
              </button>
            </div>
            <div className="space-y-3">
              {shortcuts.map(({ key, desc }) => (
                <div key={key} className="flex items-center gap-4">
                  <kbd className="min-w-[3rem] text-center px-2 py-1 rounded-lg bg-white/20 text-white text-sm font-mono font-semibold border border-white/30">
                    {key}
                  </kbd>
                  <span className="text-white/80 text-sm">{desc}</span>
                </div>
              ))}
            </div>
            <p className="mt-5 text-white/40 text-xs text-center">Press Esc or click outside to close</p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
