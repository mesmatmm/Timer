import React from 'react'
import { motion } from 'framer-motion'
import ThemeToggle from './ThemeToggle'

const tabs = [
  { id: 0, label: 'Timers', icon: '⏱' },
  { id: 1, label: 'Pomodoro', icon: '🍅' },
  { id: 2, label: 'Dashboard', icon: '📊' },
]

export default function Navbar({ activeTab, onTabChange, onShowShortcuts }) {
  return (
    <nav className="fixed top-0 left-0 right-0 z-40 bg-white/5 backdrop-blur-md border-b border-white/10">
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center gap-2">
          <span className="text-2xl">⏰</span>
          <span className="text-white font-bold text-lg hidden sm:block">TimerApp</span>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-1 bg-white/10 rounded-xl p-1">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`relative px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                activeTab === tab.id ? 'text-white' : 'text-white/60 hover:text-white'
              }`}
            >
              {activeTab === tab.id && (
                <motion.div
                  layoutId="activeTab"
                  className="absolute inset-0 bg-indigo-500 rounded-lg"
                  transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                />
              )}
              <span className="relative z-10 flex items-center gap-1.5">
                <span>{tab.icon}</span>
                <span className="hidden sm:block">{tab.label}</span>
              </span>
            </button>
          ))}
        </div>

        {/* Right controls */}
        <div className="flex items-center gap-3">
          <button
            onClick={onShowShortcuts}
            className="text-white/60 hover:text-white text-sm font-medium px-2 py-1 rounded-lg hover:bg-white/10 transition-all"
            title="Keyboard shortcuts (?)"
          >
            <span className="hidden sm:inline">Shortcuts </span>?
          </button>
          <ThemeToggle />
        </div>
      </div>
    </nav>
  )
}
